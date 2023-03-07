import { ReactNode, useCallback, useContext, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Tag as PrismaTag, Prisma, TagGroup, User } from "@prisma/client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useDisclosure,
  FormErrorMessage,
  VStack,
  IconButton,
  usePrevious,
  Select,
} from "@chakra-ui/react";
import { BorderedHStack } from "components/BorderedHStack";
import { DeleteIcon } from "@chakra-ui/icons";
import { RoleName } from "types/schema";
import { useMutation, useQueryClient } from "react-query";
import { useUser } from "hooks/useUser";
import { useOperatingAs } from "hooks/useOperatingAs";

type Props = {
  action: string;
  groupName?: string;
  allTagGroups?: (TagGroup & { tags?: PrismaTag[] })[];
  children: ({ onOpen }: { onOpen: () => void }) => ReactNode;
};

type TagGroupModalTag = PrismaTag & {
  status: "hidden" | "disabled" | "enabled";
};

export const TagGroupModal = ({
  action,
  children,
  groupName = "",
  allTagGroups = [],
}: Props) => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUser();
  const isAdmin = user?.roleName === RoleName.Admin;
  const [operatingAs, updateOperatingAs] = useOperatingAs((state) => [
    state.value,
    state.update,
  ]);

  const { mutateAsync: updateTagGroup, isLoading } = useMutation(
    (body: string) =>
      fetch("/api/tag-groups", { method: "POST", body }).then((res) =>
        res.json()
      )
  );

  const allTags = useMemo(
    () => allTagGroups.find(({ name }) => name === groupName)?.tags ?? [],
    [allTagGroups, groupName]
  );

  const defaultValues = useMemo(() => {
    const disabledTags =
      operatingAs?.disabledTags?.map((tag) => tag.name) ?? [];
    const allowedTags = operatingAs?.allowedTags?.map((tag) => tag.name) ?? [];

    return {
      name: groupName,
      tags: allTags.map((tag) => ({
        ...tag,
        status: disabledTags.includes(tag.name)
          ? ("disabled" as const)
          : allowedTags.includes(tag.name)
          ? ("enabled" as const)
          : ("hidden" as const),
      })),
    };
  }, [groupName, allTags, operatingAs?.disabledTags, operatingAs?.allowedTags]);

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ values: defaultValues });

  const {
    fields: tagFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const submit = useCallback(
    async ({ tags: finalTags, name: finalGroupName }: typeof defaultValues) => {
      const newTags = finalTags.reduce(
        (acc, { id, name }) => (!id && !!name ? [...acc, { name }] : acc),
        [] as { name: string }[]
      );
      const finalTagIds = finalTags.reduce(
        (acc, { id }) => (id ? [...acc, id] : acc),
        [] as number[]
      );
      const deletedTagIds = defaultValues.tags.reduce(
        (acc, { id }) => (!finalTagIds.includes(id) ? [...acc, id] : acc),
        [] as number[]
      );

      const updateTagGroupQuery: Prisma.TagGroupUpsertArgs = {
        where: { name: groupName },
        update: {
          name: finalGroupName,
          tags: {
            deleteMany: { id: { in: deletedTagIds } },
            createMany: { data: newTags },
          },
        },
        create: {
          name: finalGroupName,
          tags: {
            createMany: { data: newTags },
          },
        },
      };

      const updateTagsQueries = finalTags.reduce(
        (acc, { id, name, status }) => {
          if (id) {
            const defaultTag = defaultValues.tags.find((tag) => tag.id === id);

            if (defaultTag?.name !== name || defaultTag?.status !== status) {
              const originalListKey =
                defaultTag?.status === "enabled"
                  ? "allowedFor"
                  : defaultTag?.status === "disabled"
                  ? "disabledFor"
                  : undefined;
              const newListKey =
                status === "enabled"
                  ? "allowedFor"
                  : status === "disabled"
                  ? "disabledFor"
                  : undefined;

              return [
                ...acc,
                {
                  where: { id },
                  data: {
                    name,
                    ...(operatingAs && {
                      ...(originalListKey && {
                        [originalListKey]: {
                          disconnect: { id: operatingAs.id },
                        },
                      }),
                      ...(newListKey && {
                        [newListKey]: { connect: { id: operatingAs.id } },
                      }),
                    }),
                  },
                },
              ];
            }
          }

          return acc;
        },
        [] as Prisma.TagUpdateArgs[]
      );

      // TODO: Unselect all tags with a group name of selected
      // TODO: Remove quick filters w/ associated tags that were disabled/hidden

      const { updatedOperatingAs } = await updateTagGroup(
        JSON.stringify({
          updateTagGroupQuery,
          updateTagsQueries,
          ...(operatingAs && { operatingAsId: operatingAs.id }),
        })
      );

      await queryClient.invalidateQueries();

      if (operatingAs) {
        updateOperatingAs(updatedOperatingAs);
      }

      onClose();
    },
    [
      defaultValues.tags,
      groupName,
      onClose,
      operatingAs,
      queryClient,
      updateOperatingAs,
      updateTagGroup,
    ]
  );

  const onCancel = useCallback(() => {
    reset(defaultValues);
    onClose();
  }, [reset, defaultValues, onClose]);

  const validateGroupIsUnique = useCallback(
    (defaultName: string) => (value: string) =>
      allTagGroups
        .reduce(
          (acc, { name }) => (name !== defaultName ? [...acc, name] : acc),
          [] as string[]
        )
        .includes(value)
        ? "Group name must be unique"
        : true,
    [allTagGroups]
  );

  const validateTagIsUnique = useCallback(
    (defaultName: string) => (value: string) =>
      allTags
        .reduce(
          (acc, { name }) => (name !== defaultName ? [...acc, name] : acc),
          [] as string[]
        )
        .includes(value)
        ? "Tag name must be unique across all groups"
        : true,
    [allTags]
  );

  // Auto add fields / auto remove fields
  // =====

  useEffect(() => {
    if (isOpen) {
      append({ name: "" } as TagGroupModalTag, { shouldFocus: true });
    }
  }, [append, isOpen]);

  const lastValue = watch(`tags.${tagFields.length - 1}.name`);
  const prevLastValue = usePrevious(lastValue);
  const secondLastValue = watch(`tags.${tagFields.length - 2}.name`);
  const prevSecondLastValue = usePrevious(secondLastValue);

  useEffect(() => {
    if (isOpen) {
      if (prevLastValue === "" && lastValue !== "") {
        append({ name: "" } as TagGroupModalTag, {
          focusIndex: tagFields.length - 1,
        });
      }

      if (
        prevSecondLastValue !== "" &&
        secondLastValue === "" &&
        lastValue === ""
      ) {
        remove(tagFields.length - 1);
      }
    }
  }, [
    append,
    isOpen,
    lastValue,
    prevLastValue,
    prevSecondLastValue,
    remove,
    secondLastValue,
    tagFields.length,
  ]);

  // =====

  return (
    <>
      {children({ onOpen })}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <form onSubmit={handleSubmit(submit)}>
          <ModalContent>
            <ModalHeader>{action} Tag Group</ModalHeader>
            <ModalCloseButton onClick={onCancel} />
            <ModalBody
              pb={6}
              display="grid"
              gap={5}
              maxH="1200px"
              overflowY="scroll"
            >
              <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Category name"
                  {...register("name", {
                    required: true,
                    validate: {
                      isUnique: validateGroupIsUnique(defaultValues.name),
                    },
                  })}
                />
                {errors.name ? (
                  <FormErrorMessage>Title is required</FormErrorMessage>
                ) : null}
              </FormControl>

              <FormControl>
                <FormLabel>Tags</FormLabel>
                <VStack spacing={1} mt={4} display="flex" justify="start">
                  {tagFields.map((field, idx) => (
                    <BorderedHStack key={field.id}>
                      <Input
                        placeholder="Add a tag"
                        variant="unstyled"
                        px={4}
                        py={2}
                        minW="240px"
                        {...register(`tags.${idx}.name`, {
                          validate: {
                            isUnique: validateTagIsUnique(field.name),
                          },
                        })}
                      />
                      {operatingAs ? (
                        <Select
                          height="42px"
                          defaultValue=""
                          {...register(`tags.${idx}.status`)}
                        >
                          <option value="hidden">Hidden</option>
                          <option value="disabled">Disabled</option>
                          <option value="enabled">Enabled</option>
                        </Select>
                      ) : null}
                      {isAdmin ? (
                        <IconButton
                          icon={<DeleteIcon color="gray.500" />}
                          aria-label="Delete"
                          py={5}
                          onClick={() => remove(idx)}
                          isDisabled={idx + 1 === tagFields.length}
                        />
                      ) : null}
                    </BorderedHStack>
                  ))}
                </VStack>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="primary"
                mr={3}
                type="submit"
                isLoading={isLoading}
              >
                Save
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

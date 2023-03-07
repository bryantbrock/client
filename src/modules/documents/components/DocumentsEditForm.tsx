import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Input,
  Textarea,
  Button,
  MenuButton,
  Menu,
  MenuList,
  Box,
  Portal,
} from "@chakra-ui/react";
import { Tag } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Document } from "../types";
import { TagGroup } from "./TagGroup";
import { useQuery } from "react-query";
import uniq from "lodash/uniq";
import map from "lodash/map";

const TagsList = ({
  onClickTag,
  selectedTagNames,
}: {
  onClickTag: (tag: Tag) => void;
  selectedTagNames: string[];
}) => {
  const { data: allTagGroups = [] } = useQuery<Document[]>(
    "/api/tag-groups",
    () => fetch("/api/tag-groups").then((res) => res.json()),
    { keepPreviousData: true }
  );

  return (
    <MenuList
      display="flex"
      p={4}
      mx={4}
      flexWrap="wrap"
      gap={2}
      maxH="400px"
      overflow="scroll"
      maxW="calc(100vw - 24px)"
      shadow="2xl"
    >
      {allTagGroups.map(({ name, id, tags }) => (
        <Box key={id} mb={3}>
          <TagGroup
            groupName={name}
            displayedTags={tags}
            allTagGroups={allTagGroups}
            selectedTags={selectedTagNames}
            onClickTag={onClickTag}
          />
        </Box>
      ))}
    </MenuList>
  );
};

type Props = { rowsSelected: Row<Document>[]; onClose: () => void };

export const DocumentsEditForm = ({ rowsSelected, onClose }: Props) => {
  const defaultValues = useMemo(() => {
    if (rowsSelected.length === 1) {
      const { name, description, tags } = rowsSelected[0].original;

      return { name, description, tags };
    } else {
      return {
        name: "Mixed",
        description: "Mixed",
        tags: uniq(
          rowsSelected.reduce(
            (acc, row) => acc.concat(row.original.tags),
            [] as Tag[]
          )
        ),
      };
    }
  }, [rowsSelected]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const { append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  const tags = watch("tags");
  const tagIds = map(tags, "id");

  const onClickTag = useCallback(
    (tag: Tag) => {
      const isSelected = tagIds.includes(tag.id);

      if (isSelected) {
        const indexOfExistingTag = tags.findIndex(({ id }) => id === tag.id);

        remove(indexOfExistingTag);
      } else {
        append(tag);
      }
    },
    [append, remove, tagIds, tags]
  );

  return (
    <form id="edit-documents-form" onSubmit={handleSubmit(onClose)}>
      <Flex direction="column" gap={4}>
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Document name"
            isDisabled={defaultValues.name === "Mixed"}
            {...register("name", {
              required: true,
              // TODO: Validate name is unique
            })}
          />
          {errors.name ? (
            <FormErrorMessage>Name is required</FormErrorMessage>
          ) : null}
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Document description"
            isDisabled={defaultValues.description === "Mixed"}
            {...register("description")}
          />
          {errors.description ? (
            <FormErrorMessage>Name is required</FormErrorMessage>
          ) : null}
        </FormControl>

        <Flex gap={4} align="center" justify="space-between">
          <Text fontWeight="semibold">Tags</Text>
          <Menu isLazy>
            <MenuButton as={Button} variant="outline" minW="110px">
              Edit ({tags.length} )
            </MenuButton>
            <TagsList
              selectedTagNames={map(tags, "name")}
              onClickTag={onClickTag}
            />
          </Menu>
        </Flex>
      </Flex>
    </form>
  );
};

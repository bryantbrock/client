import { AddIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Flex,
  AccordionIcon,
  AccordionPanel,
  Card,
  CardBody,
  Center,
  Tag,
  TagLabel,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import {
  QuickFilter,
  Tag as PrismaTag,
  TagGroup as PrismaTagGroup,
} from "@prisma/client";
import { useOperatingAs } from "hooks/useOperatingAs";
import { useUser } from "hooks/useUser";
import { concat, entries, uniq } from "lodash";
import { useCallback, MouseEvent, useMemo } from "react";
import { useQuery } from "react-query";
import { TagGroup } from "./TagGroup";
import { TagGroupModal } from "./TagGroupModal";

type Props = {
  canModify?: boolean;
  selected: string[];
  onChange: (getTags: ((tagNames: string[]) => string[]) | string[]) => void;
};

export const DocumentsFiltersAccordion = ({
  canModify,
  selected,
  onChange,
}: Props) => {
  const { user } = useUser();
  const operatingAs = useOperatingAs((state) => state.value);

  const { data: allTagGroups = [] } = useQuery<PrismaTagGroup[]>(
    "/api/tag-groups",
    () => fetch("/api/tag-groups").then((res) => res.json()),
    { keepPreviousData: true }
  );

  const tags = useMemo(
    () =>
      concat(
        operatingAs?.allowedTags ?? user?.allowedTags ?? [],
        (operatingAs?.disabledTags ?? user?.disabledTags ?? []).map((tag) => ({
          ...tag,
          isDisabled: true,
        }))
      ),
    [
      operatingAs?.allowedTags,
      operatingAs?.disabledTags,
      user?.allowedTags,
      user?.disabledTags,
    ]
  );

  const tagsByGroup = useMemo(
    () =>
      tags.reduce(
        (acc, tag) => ({
          ...acc,
          [tag.groupName]: [...(acc[tag.groupName] ?? []), tag],
        }),
        Object.fromEntries(
          (allTagGroups ?? []).map(({ name }) => [
            name,
            [] as (PrismaTag & { isDisabled?: boolean })[],
          ])
        )
      ),
    [allTagGroups, tags]
  );

  const quickFilters = useMemo(
    () => operatingAs?.quickFilters ?? user?.quickFilters,
    [operatingAs, user]
  );

  const onQuickFilterClick = useCallback(
    (quickFilter: QuickFilter & { tags?: PrismaTag[] }) =>
      onChange((tags) =>
        uniq(concat(tags, quickFilter.tags?.map((t) => t.name) ?? []))
      ),
    [onChange]
  );

  const toggleTag = useCallback(
    (tag: string) =>
      onChange((tags: string[]) =>
        tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
      ),
    [onChange]
  );

  const onClearTags = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onChange([]);
    },
    [onChange]
  );

  if (!tags.length && !quickFilters?.length && !canModify) {
    return null;
  }

  return (
    <Accordion
      defaultIndex={[0]}
      allowMultiple
      borderWidth="1px"
      rounded="md"
      mt={4}
    >
      {quickFilters?.length || canModify ? (
        <AccordionItem>
          <AccordionButton>
            <Flex gap={2} align="center">
              <AccordionIcon />
              <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                Quick filters
              </Box>
            </Flex>
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Flex gap={2} wrap="wrap">
              {canModify ? (
                <Card w="180px" cursor="pointer">
                  <CardBody
                    onClick={() => {}} // TODO: createQuickFilter
                    _hover={{ bgColor: "gray.50" }}
                    border="1px dashed black"
                    rounded="md"
                    transition=".1s background-color ease"
                  >
                    <Center h="full" display="flex" gap={2}>
                      <AddIcon h="12px" />
                      <Text>Add</Text>
                    </Center>
                  </CardBody>
                </Card>
              ) : null}
              {quickFilters?.map((quickFilter, idx) => (
                <Card
                  w="180px"
                  key={idx}
                  bgColor="green.100"
                  shadow="sm"
                  _hover={{
                    cursor: "pointer",
                    bgColor: "green.200",
                    transition: ".1s background-color ease",
                  }}
                >
                  <CardBody
                    p={2}
                    onClick={() => onQuickFilterClick(quickFilter)}
                  >
                    <Flex direction="column" gap={4}>
                      <Text align="center" fontSize="sm" fontWeight="bold">
                        {quickFilter.name}
                      </Text>
                      <Flex wrap="wrap" gap={1} justify="center">
                        {quickFilter.tags?.map((tag) => (
                          <Tag variant="outline" key={tag.name}>
                            <TagLabel color="gray.800">{tag.name}</TagLabel>
                          </Tag>
                        ))}
                      </Flex>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      ) : null}
      {tags.length || canModify ? (
        <AccordionItem>
          <AccordionButton>
            <Flex gap={2} align="center" w="full">
              <AccordionIcon />
              <Box
                as="span"
                textAlign="left"
                fontWeight="semibold"
                minW="fit-content"
              >
                Tags {selected.length ? `(${selected.length})` : ""}
              </Box>
              <Button
                size="sm"
                px={3}
                fontWeight="semibold"
                fontSize="sm"
                variant="outline"
                onClick={onClearTags}
                visibility={selected.length ? undefined : "hidden"}
                ml={2}
              >
                Clear
              </Button>
            </Flex>
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Flex gap={8} direction={{ base: "column", lg: "row" }}>
              {canModify ? (
                <TagGroupModal action="New">
                  {({ onOpen }) => (
                    <Box>
                      <Card w="120px" h="120px" cursor="pointer">
                        <CardBody
                          onClick={onOpen}
                          _hover={{ bgColor: "gray.50" }}
                          border="1px dashed black"
                          rounded="md"
                          transition=".1s background-color ease"
                        >
                          <Center h="full" display="flex" gap={2}>
                            <AddIcon h="12px" />
                            <Text>Add</Text>
                          </Center>
                        </CardBody>
                      </Card>
                    </Box>
                  )}
                </TagGroupModal>
              ) : null}
              <Flex
                gap={4}
                align="flex-start"
                direction={{ base: "column", md: "row" }}
                flexWrap={{ base: undefined, md: "wrap" }}
              >
                {entries(tagsByGroup).map(([groupName, displayedTags]) => (
                  <TagGroup
                    groupName={groupName}
                    displayedTags={displayedTags}
                    allTagGroups={allTagGroups}
                    selectedTags={selected}
                    onClickTag={({ name }) => toggleTag(name)}
                    key={groupName}
                    canEdit={canModify}
                  />
                ))}
              </Flex>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      ) : null}
    </Accordion>
  );
};

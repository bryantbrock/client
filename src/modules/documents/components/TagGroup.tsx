import {
  Box,
  Grid,
  Flex,
  IconButton,
  Tag,
  TagLabel,
  Text,
  useBoolean,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Tag as PrismaTag, TagGroup as PrismaTagGroup } from "@prisma/client";
import { PencilIcon } from "components/icons/PencilIcon";
import { TagGroupModal } from "./TagGroupModal";

type CategoryTag = PrismaTag & { isDisabled?: boolean };

type Props = {
  groupName: string;
  allTagGroups: PrismaTagGroup[];
  displayedTags: CategoryTag[];
  selectedTags: string[];
  onClickTag: (tag: CategoryTag) => void;
  canEdit?: boolean;
};

export const TagGroup = ({
  groupName,
  allTagGroups,
  displayedTags,
  selectedTags,
  onClickTag,
  canEdit,
}: Props) => {
  const [editIconShowing, { on: showEditIcon, off: hideEditIcon }] =
    useBoolean(false);

  return (
    <Grid
      gap={2}
      maxW="200px"
      onMouseEnter={canEdit ? showEditIcon : undefined}
      onMouseLeave={canEdit ? hideEditIcon : undefined}
    >
      <Flex gap={1} align="center">
        <Text fontWeight="bold" align="start">
          {groupName}
        </Text>
        {editIconShowing ? (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<PencilIcon color="gray.900" />}
              variant="unstyled"
              size="xs"
            />
            <MenuList m={0} p={0}>
              <TagGroupModal
                action="Edit"
                groupName={groupName}
                allTagGroups={allTagGroups}
              >
                {({ onOpen }) => <MenuItem onClick={onOpen}>Edit</MenuItem>}
              </TagGroupModal>
              <TagGroupModal
                action="Delete"
                groupName={groupName}
                allTagGroups={allTagGroups}
              >
                {({ onOpen }) => <MenuItem onClick={onOpen}>Delete</MenuItem>}
              </TagGroupModal>
            </MenuList>
          </Menu>
        ) : (
          <Box w="24px" />
        )}
      </Flex>
      <Flex gap={1} direction="column" align="flex-start">
        {displayedTags.map((tag) => (
          <Box key={tag.id}>
            <Tag
              variant="outline"
              opacity={tag.isDisabled ? 0.4 : undefined}
              color={selectedTags.includes(tag.name) ? "white" : "gray.700"}
              bgColor={selectedTags.includes(tag.name) ? "gray.600" : "white"}
              onClick={!tag.isDisabled ? () => onClickTag(tag) : undefined}
              transition=".2s background-color ease-in-out"
              _hover={{
                cursor: tag.isDisabled ? "not-allowed" : "pointer",
                ...(!tag.isDisabled && {
                  bgColor: selectedTags.includes(tag.name)
                    ? "gray.700"
                    : "gray.100",
                }),
              }}
            >
              <TagLabel>{tag.name}</TagLabel>
            </Tag>
          </Box>
        ))}
      </Flex>
    </Grid>
  );
};

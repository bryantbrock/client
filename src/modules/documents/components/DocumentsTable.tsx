import { Box, Flex, Tag, TagLabel } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/table/IndeterminateCheckbox";
import { Table } from "components/table/Table";
import { useOperatingAs } from "hooks/useOperatingAs";
import { useCallback, useMemo, MouseEvent } from "react";
import { useQuery } from "react-query";
import { Document } from "../types";
import { DocumentsEditForm } from "./DocumentsEditForm";

type Props = {
  canModify?: boolean;
  searchTerm: string;
  selectedTagNames: string[];
  onToggleTagName: (tagName: string) => void;
};

export const DocumentsTable = ({
  canModify,
  searchTerm,
  selectedTagNames,
  onToggleTagName,
}: Props) => {
  const operatingAs = useOperatingAs((state) => state.value);

  const documentsEndpoint = useMemo(
    () =>
      `/api/documents?clientId=${
        operatingAs?.id ?? ""
      }&q=${searchTerm}&tags=${encodeURIComponent(selectedTagNames.join(","))}`,
    [operatingAs?.id, searchTerm, selectedTagNames]
  );

  const { data: documents = [] } = useQuery<Document[]>(
    documentsEndpoint,
    () => fetch(documentsEndpoint).then((res) => res.json()),
    { keepPreviousData: true }
  );

  const internalOnToggleTagName = useCallback(
    (e: MouseEvent<HTMLSpanElement>, tagName: string) => {
      e.stopPropagation();
      onToggleTagName(tagName);
    },
    [onToggleTagName]
  );

  const columns = useMemo<ColumnDef<Document>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllPageRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <Box px={1}>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </Box>
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: (info) => info.getValue(),
      },
      {
        header: "Tags",
        accessor: "tags",
        cell: ({ row }) => (
          <Flex gap={1} wrap="wrap" maxW="400px">
            {row.original.tags.map((tag) => (
              <Tag
                variant="outline"
                key={tag.name}
                size="sm"
                onClick={(e) => internalOnToggleTagName(e, tag.name)}
              >
                <TagLabel color="gray.800">{tag.name}</TagLabel>
              </Tag>
            ))}
          </Flex>
        ),
      },
    ],
    [internalOnToggleTagName]
  );

  return (
    <Table
      data={documents}
      columns={columns}
      canDelete={canModify}
      onDelete={canModify ? () => {} : undefined} // TODO: Delete document(s)
      editForm={
        canModify
          ? (rowsSelected, onClose) => ({
              form: (
                <DocumentsEditForm
                  onClose={onClose}
                  rowsSelected={rowsSelected}
                />
              ),
              id: "edit-documents-form",
              header:
                rowsSelected.length > 1 ? "Edit Documents" : "Edit Document",
            })
          : undefined
      }
    />
  );
};

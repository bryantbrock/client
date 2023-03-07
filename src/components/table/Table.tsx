import { ReactNode, useMemo, useState } from "react";
import {
  Button,
  Flex,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Table as ChakraTable,
} from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { ConfirmDeleteModal } from "components/ConfirmDeleteModal";
import { Drawer } from "components/Drawer";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (rows: Row<T>[]) => void;
  onAdd?: () => void;
  editForm?: (
    rows: Row<T>[],
    onClose: () => void
  ) => {
    form: ReactNode;
    id: string;
    header?: string;
  };
};

export function Table<T>({
  data,
  columns,
  canDelete,
  onDelete,
  onAdd,
  editForm,
}: Props<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const disableButtons = useMemo(
    () => !Object.keys(rowSelection).length,
    [rowSelection]
  );

  const table = useReactTable({
    columns,
    data,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <Flex direction="column" gap={2}>
      <Flex w="full" justify="end" mt={4}>
        <Flex gap={2}>
          {editForm ? (
            <Drawer
              renderForm={(onClose) =>
                editForm?.(table.getSelectedRowModel().rows, onClose)
              }
            >
              {({ onOpen }) => (
                <Button
                  variant="outline"
                  isDisabled={disableButtons}
                  onClick={() => onOpen()}
                >
                  Edit
                </Button>
              )}
            </Drawer>
          ) : null}
          {canDelete && onDelete ? (
            <ConfirmDeleteModal
              onDelete={() => onDelete(table.getSelectedRowModel().rows)}
            >
              {({ onOpen }) => (
                <Button
                  variant="outline"
                  isDisabled={disableButtons}
                  onClick={() => onOpen()}
                >
                  Delete
                </Button>
              )}
            </ConfirmDeleteModal>
          ) : null}
          <Button onClick={() => onAdd?.()} variant="primary" w="120px">
            Add
          </Button>
        </Flex>
      </Flex>

      <TableContainer borderWidth="1px" rounded="md" shadow="sm">
        <ChakraTable variant="striped">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <Tr
                key={row.id}
                cursor="pointer"
                transition=".1s background-color ease"
                onClick={() => row.toggleSelected()}
                _hover={{
                  backgroundColor: idx % 2 === 0 ? "gray.300" : "gray.100",
                }}
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </ChakraTable>
      </TableContainer>
    </Flex>
  );
}

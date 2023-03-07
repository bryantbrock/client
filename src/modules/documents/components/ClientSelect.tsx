import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { User } from "@prisma/client";
import { useQuery } from "react-query";
import { useOperatingAs } from "hooks/useOperatingAs";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Text,
  Flex,
} from "@chakra-ui/react";

type Props = {
  distributorId?: number;
  operatingAs?: Partial<User> | null;
};

const ClientList = ({ distributorId, operatingAs }: Props) => {
  const updateOperatingAs = useOperatingAs((s) => s.update);

  const { data: clients = [] } = useQuery<Pick<User, "id" | "name">[]>(
    ["/api/users/get", "POST", distributorId],
    () =>
      fetch("/api/users/get", {
        method: "POST",
        body: JSON.stringify({
          ...(distributorId && { where: { distributorId } }),
          include: {
            allowedTags: true,
            disabledTags: true,
            defaultTags: true,
            quickFilters: { include: { tags: true } },
          },
        }),
      }).then((res) => res.json())
  );

  return (
    <MenuList minW="310px" maxH="400px" overflow="scroll">
      {clients.map((client) => (
        <MenuItem
          key={client.id}
          onClick={() => updateOperatingAs(client)}
          bgColor={operatingAs?.name === client.name ? "gray.100" : undefined}
        >
          <Flex justify="space-between" align="center" w="full" gap={2}>
            <Text>{client.name}</Text>
            {operatingAs?.name === client.name ? (
              <CheckIcon color="gray.400" h="12px" w="12px" />
            ) : null}
          </Flex>
        </MenuItem>
      ))}
    </MenuList>
  );
};

export const OperatingAsSelect = ({ distributorId }: Props) => {
  const [operatingAs, updateOperatingAs] = useOperatingAs((s) => [
    s.value,
    s.update,
  ]);

  return (
    <Flex gap={2}>
      <Flex justify="space-between" align="center">
        <Text fontWeight="bold">Operating as</Text>
      </Flex>

      <Menu isLazy>
        <MenuButton
          w="310px"
          as={Button}
          rightIcon={<ChevronDownIcon />}
          textAlign="left"
        >
          <Text
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            fontWeight="normal"
          >
            {operatingAs?.name ?? "Select a client"}
          </Text>
        </MenuButton>
        <ClientList distributorId={distributorId} operatingAs={operatingAs} />
      </Menu>

      <Button
        fontWeight="semibold"
        variant="outline"
        fontSize="sm"
        onClick={() => updateOperatingAs(null)}
      >
        Clear
      </Button>
    </Flex>
  );
};

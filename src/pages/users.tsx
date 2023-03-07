import React, { useEffect, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import UsersRow from "modules/users/components/usersRow";
import CreateUserModal from "modules/users/components/modals/createUserModal";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Table,
  Td,
  Text,
  Thead,
  Tr,
  Tbody,
} from "@chakra-ui/react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [globalRoles, setGlobalRoles] = useState([]);
  const [globalClients, setGlobalClients] = useState([]);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      refreshUsers();
      refreshRoles();
      refreshClients();
      if (globalClients && globalRoles) {
        setLoading(false);
      }
    }
  }, [globalClients, globalRoles, loading, users]);

  const refreshUsers = async () => {
    await fetch("/api/user", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  };

  const refreshRoles = async () => {
    await fetch("/api/role", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setGlobalRoles(data);
      });
  };

  const refreshClients = async () => {
    await fetch("/api/client", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setGlobalClients(data);
      });
  };

  if (loading) {
    return (
      <Center>
        <CircularProgress isIndeterminate color="green.300" />
      </Center>
    );
  }

  return (
    <Box>
      <Text as="h4" color="primary">
        Users
      </Text>

      <Flex justify="end">
        <Button onClick={() => setCreateUserModal(true)}></Button>
      </Flex>

      {createUserModal && (
        <CreateUserModal
          closeModal={() => setCreateUserModal(false)}
          users={users}
          setUsers={setUsers}
          refreshUsers={refreshUsers}
          globalRoles={globalRoles}
          globalClients={globalClients}
        />
      )}
      <Box style={{ marginTop: 15 }}>
        <Table>
          <Thead>
            <Tr>
              <Td align="right">Active</Td>
              <Td align="right">First Name</Td>
              <Td align="right">Last Name</Td>
              <Td align="right">Email</Td>
              <Td align="right">Clients</Td>
              <Td align="right">Roles</Td>
              <Td align="right">Actions</Td>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((row, index) => (
              <UsersRow
                user={row}
                setUsers={setUsers}
                key={index}
                globalRoles={globalRoles}
                globalClients={globalClients}
                refreshUsers={refreshUsers}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default withPageAuthRequired(Users);

import React, { useState } from "react";
import AddClientsModal from "modules/validation/components/modals/addClientsModal";
import ValidationRow from "modules/validation/components/validationRow";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Button,
  Td,
  Text,
  Table,
  Tr,
  Thead,
  Tbody,
  Box,
  Grid,
  Flex,
} from "@chakra-ui/react";

const Validation = () => {
  const [clients, setClients] = useState([]);

  const [addClientsModal, setAddClientsModal] = useState(false);

  return (
    <Grid gap={2} p={5}>
      <Text variant="h4" color="primary">
        Validation
      </Text>

      <Flex justify="end">
        <Button onClick={() => setAddClientsModal(true)}>Add Client</Button>
      </Flex>

      {addClientsModal && (
        <AddClientsModal
          closeModal={() => setAddClientsModal(false)}
          clients={clients}
          setClients={setClients}
        />
      )}

      <Text variant="h6" color="primary">
        Queue
      </Text>

      <Box>
        <Table>
          <Thead>
            <Tr>
              <Td>Queue #</Td>
              <Td align="right">Date/Time</Td>
              <Td align="right">Lab</Td>
              <Td align="right">Name</Td>
              <Td align="right">Validated</Td>
              <Td align="right">Panel</Td>
              <Td align="right">Step</Td>
              <Td align="right">Status</Td>
              <Td align="right">Assigned To</Td>
              <Td align="right"># Notes</Td>
              <Td align="right">Action</Td>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((row, index) => (
              <ValidationRow
                client={row}
                clients={clients}
                setClients={setClients}
                openUpdateModal={() => {}}
                key={index}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Grid>
  );
};

export default withPageAuthRequired(Validation);

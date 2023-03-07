import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { addToValidationQueue } from "../../cases/addToValidationQueue";

const panels = [
  {
    value: "Select",
    label: "-- Select --",
  },
  {
    value: "COVID",
    label: "COVID",
  },
  {
    value: "Fungal",
    label: "Fungal",
  },
  {
    value: "RPP Lite",
    label: "RPP Lite",
  },
  {
    value: "RPP",
    label: "RPP",
  },
  {
    value: "RPP Plus",
    label: "RPP Plus",
  },
  {
    value: "STI",
    label: "STI",
  },
  {
    value: "UTI",
    label: "UTI",
  },
  {
    value: "UTI Plus",
    label: "UTI Plus",
  },
  {
    value: "Vaginitis",
    label: "Vaginitis",
  },
];

const AddClientsModal = (props) => {
  const handleClose = () => props.closeModal();

  const [newClient, setNewClient] = useState(""); // Client = Lab
  const [newClientError, setNewClientError] = useState(false);

  const [panel, setPanel] = useState(panels[0].value);
  const [panelError, setPanelError] = useState(false);

  const [assignedTo, setAssignedTo] = useState("");
  const [assignedToError, setAssignedToError] = useState(false);

  const addNewClient = () => {
    setNewClientError(false);
    setPanelError(false);
    setAssignedToError(false);

    if (!newClient) {
      setNewClientError(true);
      return;
    }
    if (panel === panels[0].value || !panel) {
      setPanelError(true);
      return;
    }
    if (!assignedTo) {
      setAssignedToError(true);
      return;
    }

    addToValidationQueue(
      props.clients,
      props.setClients,
      newClient,
      panel,
      assignedTo
    );
    handleClose();
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <div style={{ marginTop: 15 }}>
          <TextField
            error={newClientError}
            id="new-client-input"
            required
            fullWidth
            label="Lab"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            helperText="Write the lab name"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            Choose Panel
          </Typography>

          <TextField
            error={panelError}
            id="outlined-select-panels"
            required
            fullWidth
            select
            label="Select"
            value={panel}
            onChange={(event) => setPanel(event.target.value)}
            helperText="Please select your panel"
          >
            {panels.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            error={assignedToError}
            id="assigned-to-input"
            required
            fullWidth
            label="Assigned To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            helperText="Who are you assigning this test?"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="secondary" onClick={addNewClient}>
            Add
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddClientsModal;

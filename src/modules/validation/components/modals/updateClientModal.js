import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { updateValidationQueue } from "../../cases/updateValidationQueue";

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

const UpdateClientModal = (props) => {
  const handleClose = () => props.closeModal();

  const {
    queue,
    lab: oldLab,
    name: oldName,
    validated: oldValidated,
    panel: oldPanel,
    step: oldStep,
    status: oldStatus,
    assigned_to: oldAssignedTo,
  } = props.client;
  const [client, setClient] = useState(oldLab);
  const [name, setName] = useState(oldName);
  const [validated, setValidated] = useState(oldValidated);
  const [panel, setPanel] = useState(oldPanel);
  const [step, setStep] = useState(oldStep);
  const [status, setStatus] = useState(oldStatus);
  const [assignedTo, setAssignedTo] = useState(oldAssignedTo);

  const updateClient = () => {
    const updatedInfo = {
      queue,
      lab: client,
      name,
      validated,
      panel,
      step,
      status,
      assignedTo,
    };
    updateValidationQueue(props.clients, props.setClients, updatedInfo);
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
            // error={newClientError}
            id="new-client-input"
            required
            fullWidth
            label="Lab"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            helperText="Write the lab name"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            // error={newClientError}
            id="name-input"
            required
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="Write a name"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            // error={newClientError}
            id="validated-input"
            required
            fullWidth
            label="Validated"
            value={validated}
            onChange={(e) => setValidated(e.target.value)}
            helperText="Write validated status"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            Choose Panel
          </Typography>

          <TextField
            // error={panelError}
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
            // error={newClientError}
            id="step-input"
            required
            fullWidth
            label="Step"
            value={step}
            onChange={(e) => setStep(e.target.value)}
            helperText="Write step"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            // error={newClientError}
            id="status-input"
            required
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            helperText="Write status"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            // error={newClientError}
            id="assigned-to-input"
            required
            fullWidth
            label="Assigned To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            helperText="Write assigned to"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="secondary" onClick={updateClient}>
            Update
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default UpdateClientModal;

import React, { useState } from "react";
import updateUser from "modules/users/cases/updateUser";

import {
  Button,
  Checkbox,
  Select,
  Modal,
  Box,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

const UpdateUserModal = (props) => {
  const handleClose = () => props.closeModal();
  const globalRoles = props.globalRoles;
  const globalClients = props.globalClients;
  const refreshUsers = props.refreshUsers;
  const { id, first_name, last_name, email, roles, clients, auth0_id } =
    props.user;
  const [active, setActive] = useState(props.user.active);
  const [newFirstName, setNewFirstName] = useState(first_name);
  const [firstNameError, setFirstNameError] = useState(false);
  const [newLastName, setNewLastName] = useState(last_name);
  const [lastNameError, setLastNameError] = useState(false);
  const [newRole, setNewRole] = useState(roles);
  const [roleError, setRoleError] = useState(false);
  const [newClient, setNewClient] = useState(clients);
  const [clientError, setClientError] = useState(false);

  let setSocialLogin = false;
  if (auth0_id) {
    let authType = auth0_id.split("|");
    if (authType[0] == "google-oauth2") {
      setSocialLogin = true;
    }
  }
  const goUpdateUser = () => {
    setFirstNameError(false);
    setLastNameError(false);
    setRoleError(false);
    let error = false;
    if (!setSocialLogin) {
      if (!newFirstName) {
        setFirstNameError(true);
        error = true;
      }
      if (!newLastName) {
        setLastNameError(true);
        error = true;
      }
    }
    if (!newRole.length) {
      setRoleError(true);
      error = true;
    }

    if (error) {
      return false;
    } else {
      const updatedUser = {
        id,
        active,
        first_name: newFirstName,
        last_name: newLastName,
        roles: newRole,
        clients: newClient,
      };
      updateUser(updatedUser, refreshUsers, handleClose);
    }
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <Typography variant="h4" color="primary">
          Update User: {email}
        </Typography>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            <Checkbox
              id="new-active-input"
              checked={active}
              label="Active"
              helpertext="Is this user active?"
              onChange={(e) => setActive(!active)}
            />
            Active
          </Typography>
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            id="new-first-name-input"
            error={firstNameError}
            required
            fullWidth
            disabled={setSocialLogin}
            label="First name"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            helpertext="Write user first name"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            id="new-last-name-input"
            error={lastNameError}
            required
            fullWidth
            disabled={setSocialLogin}
            label="Last name"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            helpertext="Write user last name"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            Roles
          </Typography>

          <Select
            id="outlined-select-role"
            error={roleError}
            required
            fullWidth
            multiple
            label="Select"
            value={newRole}
            onChange={(event) => setNewRole(event.target.value)}
            helpertext="Please select user role"
          >
            {globalRoles.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            Clients
          </Typography>

          <Select
            id="outlined-select-client"
            error={clientError}
            required
            fullWidth
            multiple
            label="Select"
            value={newClient}
            onChange={(event) => setNewClient(event.target.value)}
            helpertext="Please select user client"
          >
            {globalClients.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}
        >
          <div style={{ margin: 5 }}>
            <Button label="Cancel" onClick={handleClose} />
          </div>
          <div style={{ margin: 5 }}>
            <Button label="Update" onClick={goUpdateUser} />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default UpdateUserModal;

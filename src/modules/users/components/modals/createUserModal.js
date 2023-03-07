import React, { useState, useEffect } from "react";
import createUser from "modules/users/cases/createUser";

import {
  Button,
  Checkbox,
  Select,
  MenuItem,
  Typography,
  TextField,
  Box,
  Modal,
  ButtonBase,
} from "@mui/material";

const CreateUserModal = (props) => {
  const globalRoles = props.globalRoles;
  const globalClients = props.globalClients;
  const refreshUsers = props.refreshUsers;

  const handleClose = () => props.closeModal();

  const [active, setActive] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [roles, setRole] = useState([]);
  const [roleError, setRoleError] = useState(false);

  const [clients, setClient] = useState([]);
  const [clientError, setClientError] = useState(false);

  const addNewUser = () => {
    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setRoleError(false);
    setClientError(false);
    let error = false;
    if (!firstName) {
      setFirstNameError(true);
      error = true;
    }
    if (!lastName) {
      setLastNameError(true);
      error = true;
    }
    if (!email) {
      setEmailError(true);
      error = true;
    }
    if (!password) {
      setPasswordError(true);
      error = true;
    }
    if (!roles.length) {
      setRoleError(true);
      error = true;
    }

    if (error) {
      return false;
    } else {
      const newUser = {
        active: active,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        roles,
        clients,
      };
      createUser(newUser, refreshUsers, handleClose);
    }
  };
  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRole(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleClientChange = (event) => {
    const {
      target: { value },
    } = event;
    setClient(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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
          Add a User
        </Typography>
        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            <Checkbox
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
            error={firstNameError}
            id="new-first-name-input"
            required
            fullWidth
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            helpertext="Write user first name"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            error={lastNameError}
            id="new-last-name-input"
            required
            fullWidth
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            helpertext="Write user last name"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            error={emailError}
            id="new-email-input"
            required
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helpertext="Write user email"
            type={"email"}
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <TextField
            error={passwordError}
            id="new-password-input"
            required
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helpertext="Write user password"
            type="password"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            Roles
          </Typography>

          <Select
            error={roleError}
            id="outlined-select-role"
            required
            fullWidth
            multiple
            label="Select"
            value={roles}
            onChange={(event) => handleRoleChange(event)}
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
            error={clientError}
            id="outlined-select-client"
            fullWidth
            multiple
            label="Select"
            value={clients}
            onChange={(event) => handleClientChange(event)}
            helpertext="Please select client(s)"
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
            <Button label="Add" onClick={addNewUser} />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateUserModal;

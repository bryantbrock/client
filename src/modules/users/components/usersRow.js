import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import {
  TableRow,
  TableCell,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import {
  Update as UpdateIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import deleteUser from "modules/users/cases/deleteUser";
import UpdateUserModal from "modules/users/components/modals/updateUserModal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const UsersRow = (props) => {
  const { id, active, first_name, last_name, email, roles, clients, actions } =
    props.user;
  const [loading, setLoading] = useState(true);
  const globalRoles = props.globalRoles;
  const globalClients = props.globalClients;
  const refreshUsers = props.refreshUsers;
  const [displayRoles, setDisplayRoles] = useState([]);
  const [displayClients, setDisplayClients] = useState([]);
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    refreshUserRoles();
    refreshUserClients();
  }, [
    globalRoles,
    globalClients,
    props.user,
    props.user.active,
    refreshUserRoles,
    refreshUserClients,
  ]);

  const refreshUserRoles = useCallback(() => {
    var linkedRoles = [];
    var displayedRoles = [];
    if (globalRoles) {
      linkedRoles = globalRoles.filter((globalRole) => {
        return roles.includes(globalRole.id);
      });
      linkedRoles.map((role) => {
        displayedRoles.push(role.name);
      });
      setDisplayRoles(displayedRoles);
    }
  }, [globalRoles, roles]);

  const refreshUserClients = useCallback(() => {
    var linkedClients = [];
    var displayedClients = [];
    if (globalClients) {
      linkedClients = globalClients.filter((globalClient) => {
        return clients.includes(globalClient.id);
      });
      linkedClients.map((client) => {
        displayedClients.push(client.name);
      });
      setDisplayClients(displayedClients);
    }
  }, [clients, globalClients]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClose = () => {
    setOpen(false);
    deleteUser(id, refreshUsers);
  };

  return (
    <StyledTableRow
      key={id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="right">
        {active && <CheckIcon />}
        {!active && <CloseIcon />}
      </TableCell>
      <TableCell align="right">{first_name}</TableCell>
      <TableCell align="right">{last_name}</TableCell>
      <TableCell align="right">{email}</TableCell>
      <TableCell align="right">
        {displayClients.map((client, key) => {
          return (
            <span key={id + "_" + key}>
              {client} <br />
            </span>
          );
        })}
      </TableCell>
      <TableCell align="right">
        {displayRoles.map((role, key) => {
          return (
            <span key={id + "_" + key}>
              {role} <br />
            </span>
          );
        })}
      </TableCell>
      <TableCell align="right">
        {actions.update && (
          <IconButton
            style={styles.buttonIcon}
            onClick={() => setUpdateUserModal(true)}
          >
            <UpdateIcon />
          </IconButton>
        )}
        {actions.delete && (
          <IconButton
            style={styles.buttonIcon}
            onClick={() => handleClickOpen()}
          >
            <DeleteIcon />
          </IconButton>
        )}
        {actions.delete && (
          <div>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>Delete User?</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Are you sure you want to delete {email}?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeleteClose}>Delete</Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </TableCell>

      {updateUserModal && (
        <UpdateUserModal
          closeModal={() => setUpdateUserModal(false)}
          user={props.user}
          globalRoles={globalRoles}
          globalClients={globalClients}
          refreshUsers={refreshUsers}
        />
      )}
    </StyledTableRow>
  );
};

export default UsersRow;

const styles = {
  buttonIcon: {
    padding: 0,
  },
};

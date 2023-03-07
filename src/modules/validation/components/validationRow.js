import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import UploadIcon from "@mui/icons-material/Upload";
import NoteIcon from "@mui/icons-material/Note";
import SummarizeIcon from "@mui/icons-material/Summarize";
import IconButton from "@mui/material/IconButton";
import UpdateIcon from "@mui/icons-material/Update";
import TableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import { deleteFromValidationQueue } from "../cases/deleteFromValidationQueue";
import UpdateClientModal from "./modals/updateClientModal";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ValidationRow = (props) => {
  const {
    queue,
    date,
    lab,
    name,
    validated,
    panel,
    step,
    status,
    assigned_to,
    notes,
    actions,
  } = props.client;

  const [updateClientModal, setUpdateClientModal] = useState(false);

  return (
    <StyledTableRow
      key={queue}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {queue}
      </TableCell>
      <TableCell align="right">{date.toDateString()}</TableCell>
      <TableCell align="right">{lab}</TableCell>
      <TableCell align="right">{name}</TableCell>
      <TableCell align="right">{validated}</TableCell>
      <TableCell align="right">{panel}</TableCell>
      <TableCell align="right">{step}</TableCell>
      <TableCell align="right">{status}</TableCell>
      <TableCell align="right">{assigned_to}</TableCell>
      <TableCell align="right">{notes}</TableCell>
      <TableCell align="right">
        {actions.download && (
          <IconButton style={styles.buttonIcon}>
            <DownloadIcon />
          </IconButton>
        )}

        {actions.analysis && (
          <IconButton style={styles.buttonIcon}>
            <InsertChartIcon />
          </IconButton>
        )}

        {actions.upload && (
          <IconButton style={styles.buttonIcon}>
            <UploadIcon />
          </IconButton>
        )}

        {actions.add_review_notes && (
          <IconButton style={styles.buttonIcon}>
            <NoteIcon />
          </IconButton>
        )}

        {actions.download_final_report && (
          <IconButton style={styles.buttonIcon}>
            <SummarizeIcon />
          </IconButton>
        )}

        {actions.update && (
          <IconButton
            style={styles.buttonIcon}
            onClick={() => setUpdateClientModal(true)}
          >
            <UpdateIcon />
          </IconButton>
        )}

        {actions.delete && (
          <IconButton
            style={styles.buttonIcon}
            onClick={() =>
              deleteFromValidationQueue(queue, props.clients, props.setClients)
            }
          >
            <DeleteIcon />
          </IconButton>
        )}
      </TableCell>

      {updateClientModal && (
        <UpdateClientModal
          closeModal={() => setUpdateClientModal(false)}
          client={props.client}
          clients={props.clients}
          setClients={props.setClients}
        />
      )}
    </StyledTableRow>
  );
};

export default ValidationRow;
const styles = {
  buttonIcon: {
    padding: 0,
  },
};

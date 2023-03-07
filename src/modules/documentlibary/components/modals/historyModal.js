import React, { useContext, useEffect, useState } from "react";
import { modalStyle } from "@/styles/modals";
import Modal from "@mui/material/Modal";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import PrimaryButton from "@/utils/primaryButton";
import { tableStyles } from "@/styles/tables";
import { getDocumentHistory } from "../../cases/getDocumentHistory";
import HistoryRow from "./historyRow";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const HistoryModal = ({ closeModal, documentID, documentName }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    retrieveHistory();
  }, [retrieveHistory]);

  const retrieveHistory = useCallback(async () => {
    const response = await getDocumentHistory(documentID);
    setHistory(response);
    setLoading(false);
  }, [documentID]);

  return (
    <Modal
      open={true}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography align="center" color="primary" variant="h4">
          {documentName} History
        </Typography>

        <Paper style={tableStyles.largeTable}>
          <Table aria-label="a dense table" style={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Details</StyledTableCell>
                <StyledTableCell align="left">User</StyledTableCell>
                <StyledTableCell align="left">Date/Time</StyledTableCell>
                <StyledTableCell align="left">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <StyledTableCell>
                    <CircularProgress />
                  </StyledTableCell>
                </TableRow>
              ) : (
                history.length > 0 &&
                history.map((document, index) => (
                  <HistoryRow doc={document} key={index} />
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        <div
          style={{
            marginTop: 15,
            justifyContent: "center",
            display: "flex",
          }}
        >
          <PrimaryButton key={1} onClick={closeModal} label="Done" />
        </div>
      </Box>
    </Modal>
  );
};

export default HistoryModal;

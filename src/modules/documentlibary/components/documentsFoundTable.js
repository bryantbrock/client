import React, { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import DocumentFoundRow from "./documentFoundRow";
import { CircularProgress, TableFooter, Typography } from "@mui/material";
import ThirdButton from "@/utils/thirdButton";
import { tableStyles } from "@/styles/tables";
import UploadNewDocumentModal from "./modals/uploadNewDocumentModal";
import { ClientsContext } from "../../contexts/clientsContext";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const DocumentsFoundTable = ({ searchText, tagsFilters }) => {
  const { selectedClient } = useContext(ClientsContext);

  const [loading, setLoading] = useState(true);

  const [documents, setDocuments] = useState([]);
  const [documentsByTags, setDocumentsByTags] = useState([]);

  const [uploadNewDocument, setUploadNewDocument] = useState(false);

  useEffect(() => {
    apiCall();
  }, [apiCall, selectedClient]);

  useEffect(() => {
    apiCall();
  }, [apiCall, searchText]);

  useEffect(() => {
    if (tagsFilters.length > 0) {
      let containSelectedTags = documents.filter((doc) => {
        // Check if the document has all required tags
        let hasAllTags = true;

        // Loop through all required tags
        tagsFilters.forEach((filter) => {
          // Check if the document has the current required tag
          let hasTag = false;
          doc.tags.forEach((tag) => {
            // If the document has the current required tag, set hasTag to true
            if (tag.tag.id === filter.id) {
              hasTag = true;
            }
          });
          // If the document does not have the current required tag, set hasAllTags to false
          if (!hasTag) {
            hasAllTags = false;
          }
        });

        // Return true if the document has all required tags, otherwise false
        return hasAllTags;
      });

      setDocumentsByTags(containSelectedTags);
    } else {
      setDocumentsByTags([]);
    }
  }, [documents, tagsFilters]);

  const apiCall = useCallback(() => {
    setLoading(true);
    !selectedClient && retrieveDocuments();
    selectedClient && retrieveClientDocuments();
  }, [retrieveClientDocuments, retrieveDocuments, selectedClient]);

  const retrieveDocuments = useCallback(async () => {
    await fetch("/api/library/documents", {
      method: "POST",
      headers: {
        "Content-type": "json/application",
      },
      body: JSON.stringify({
        client_id: null,
        searchText: searchText,
      }),
    })
      .then((res) => res.json())
      .then((documents) => {
        // console.log(documents)
        setDocuments(documents);
        setLoading(false);
      })
      .catch();
  }, [searchText]);

  const retrieveClientDocuments = useCallback(async () => {
    await fetch("/api/library/documents/get-client-documents", {
      method: "POST",
      headers: {
        "Content-type": "json/application",
      },
      body: JSON.stringify({
        client_id: selectedClient.id,
        searchText: searchText,
      }),
    })
      .then((res) => res.json())
      .then((documents) => {
        // console.log(documents)
        setDocuments(documents);
        setLoading(false);
      })
      .catch();
  }, [searchText, selectedClient.id]);

  return (
    <Paper style={tableStyles.largeTable}>
      <Table aria-label="a dense table" style={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Name</StyledTableCell>
            <StyledTableCell align="left">Download</StyledTableCell>
            {selectedClient && (
              <StyledTableCell align="left">Documents</StyledTableCell>
            )}
            <StyledTableCell align="left">Tags</StyledTableCell>
            <StyledTableCell align="right">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        {loading ? (
          <TableBody>
            <TableRow>
              <StyledTableCell>
                <CircularProgress />
              </StyledTableCell>
            </TableRow>
          </TableBody>
        ) : (
          <>
            <TableBody>
              {tagsFilters.length > 0 ? (
                documentsByTags.map((document, index) => (
                  <DocumentFoundRow doc={document} key={index} />
                ))
              ) : documents.length > 0 ? (
                documents.map((document, index) => (
                  <DocumentFoundRow
                    doc={document}
                    key={index}
                    refresh={apiCall}
                  />
                ))
              ) : (
                <TableRow>
                  <StyledTableCell>
                    <Typography>No documents found</Typography>
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <StyledTableCell align="left">
                  {!selectedClient && (
                    <ThirdButton
                      key={1}
                      onClick={() => setUploadNewDocument(true)}
                      label="Upload New Document"
                    />
                  )}
                </StyledTableCell>
                {selectedClient && <StyledTableCell />}
                <StyledTableCell />
                <StyledTableCell />
                <StyledTableCell>
                  <Typography align="center" variant="caption">
                    {documents.length} Documents returned
                  </Typography>
                </StyledTableCell>
              </TableRow>
            </TableFooter>
          </>
        )}
      </Table>

      {uploadNewDocument && (
        <UploadNewDocumentModal
          closeModal={() => setUploadNewDocument(false)}
          refresh={apiCall}
        />
      )}
    </Paper>
  );
};

export default DocumentsFoundTable;

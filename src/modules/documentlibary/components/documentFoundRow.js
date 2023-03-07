import React, { useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Chip, IconButton, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { chipStyles } from "@/styles/chips";

import DownloadModal from "./modals/downloadModal";
import HistoryModal from "./modals/historyModal";
import UploadFinalFileModal from "./modals/uploadFinalFileModal";
import UploadTemplateDocumentFile from "./modals/uploadTemplateDocumentFile";
import EditDocumentFileModal from "./modals/editDocumentFileModal";
import { ClientsContext } from "../../contexts/clientsContext";
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DocumentFoundRow = ({ doc, refresh }) => {
  const { selectedClient } = useContext(ClientsContext);

  const {
    id,
    name,
    description,
    is_template,
    version,
    created_at,
    parent_id,
    path,
    tags,
    child,
    final_document,
    actions,
  } = doc;

  const [downloadModal, setDownloadModal] = useState(false);
  const [uploadFinalFileModal, setuploadFinalFileModal] = useState(false);
  const [histortModal, setHistoryModal] = useState(false);
  const [uploadTemplateDocumentFile, setUploadTemplateDocumentFile] =
    useState(false);
  const [editDocumentFileModal, setEditDocumentFileModal] = useState(false);

  if (child !== null) {
    version = child.version;
    created_at = child.created_at;
    path = child.path;
  }

  let final_version, final_created_at, final_path;
  if (final_document) {
    final_version = final_document.version;
    final_created_at = final_document.created_at;
    final_path = final_document.path;
  }
  const isNewerVersion = version > final_version;

  let isEarlier = false;

  if (isNewerVersion) {
    isEarlier = created_at > final_created_at ? true : false;
  }

  return (
    <StyledTableRow
      key={id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">
        {name}
        {description && (
          <Tooltip title={description}>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="left">
        <Typography color="primary">
          {is_template ? "Template" : "Download"}
        </Typography>

        <Typography variant="caption">
          v{version} - {created_at}
        </Typography>
      </TableCell>

      {selectedClient && (
        <TableCell align="left">
          {final_document ? (
            <>
              <Typography color="primary">
                {/* {final_document} */}
                Final
              </Typography>

              <Typography variant="caption" color={isEarlier ? "red" : "black"}>
                v{final_version} - {final_created_at}
              </Typography>
            </>
          ) : (
            is_template === true && <Typography>Not Uploaded</Typography>
          )}
        </TableCell>
      )}

      <TableCell align="left">
        {tags.length > 0 &&
          tags.map((tag, index) => (
            <Chip
              label={tag.tag.name}
              key={index}
              style={chipStyles.unselectedChip}
            />
          ))}
      </TableCell>

      <TableCell align="right">
        {!selectedClient ? (
          <IconButton
            style={styles.buttonIcon}
            onClick={() => {
              fetch("api/library/documents/record-download-document", {
                method: "POST",
                headers: {
                  "Content-type": "json/application",
                },
                body: JSON.stringify({
                  object_id: child ? child.id : id,
                  parent_id: child ? child.parent_id : parent_id,
                  version: child ? child.version : version,
                  is_template: is_template,
                  client_id: null, // no client selected
                }),
              }).catch();
            }}
            href={`/api/upload/get?key=${path}`}
          >
            <FileDownloadOutlinedIcon />
          </IconButton>
        ) : (
          final_document && (
            <IconButton
              style={styles.buttonIcon}
              onClick={() => {
                fetch("api/library/documents/record-download-document", {
                  method: "POST",
                  headers: {
                    "Content-type": "json/application",
                  },
                  body: JSON.stringify({
                    object_id: final_document.id,
                    parent_id: final_document.parent_id,
                    version: final_version,
                    is_template: is_template,
                    client_id: final_document.client_id, // no client selected
                  }),
                }).catch();
              }}
              href={`/api/upload/get?key=${final_path}`}
            >
              <FileDownloadOutlinedIcon />
            </IconButton>
          )
        )}

        {selectedClient && is_template && (
          // actions.upload_final_file &&
          <IconButton
            style={styles.buttonIcon}
            onClick={() => setuploadFinalFileModal(true)}
          >
            <Tooltip title="Upload final file">
              <FileUploadOutlinedIcon />
            </Tooltip>
          </IconButton>
        )}

        {
          // actions.histoy &&
          <IconButton
            style={styles.buttonIcon}
            onClick={() => setHistoryModal(true)}
          >
            <Tooltip title="History">
              <HistoryOutlinedIcon />
            </Tooltip>
          </IconButton>
        }

        {!selectedClient && (
          <IconButton
            style={styles.buttonIcon}
            onClick={() => setUploadTemplateDocumentFile(true)}
          >
            <Tooltip title="Upload template document file">
              <PublishOutlinedIcon />
            </Tooltip>
          </IconButton>
        )}

        {!selectedClient && (
          <IconButton
            style={styles.buttonIcon}
            onClick={() => setEditDocumentFileModal(true)}
          >
            <Tooltip title="Edit document file">
              <EditOutlinedIcon />
            </Tooltip>
          </IconButton>
        )}
      </TableCell>

      {downloadModal && (
        <DownloadModal closeModal={() => setDownloadModal(false)} />
      )}

      {selectedClient && uploadFinalFileModal && (
        <UploadFinalFileModal
          templateVersion={version}
          finalVersion={final_version}
          parentID={id}
          refresh={refresh}
          closeModal={() => setuploadFinalFileModal(false)}
        />
      )}

      {/* History modal no client selected*/}
      {!selectedClient && histortModal && (
        <HistoryModal
          closeModal={() => setHistoryModal(false)}
          documentID={child ? child.id : id}
          documentName={name}
        />
      )}

      {/* History modal client selected*/}
      {selectedClient && histortModal && (
        <HistoryModal
          closeModal={() => setHistoryModal(false)}
          documentID={final_document ? final_document.id : id} // : id is when is just a download file
          documentName={name}
        />
      )}

      {uploadTemplateDocumentFile && (
        <UploadTemplateDocumentFile
          name={name}
          description={description}
          is_template={is_template}
          version={version}
          parent_id={id}
          refresh={refresh}
          closeModal={() => setUploadTemplateDocumentFile(false)}
        />
      )}

      {editDocumentFileModal && (
        <EditDocumentFileModal
          id={id}
          name={name}
          description={description}
          tags={tags}
          closeModal={() => setEditDocumentFileModal(false)}
          refresh={refresh}
        />
      )}
    </StyledTableRow>
  );
};

export default DocumentFoundRow;

const styles = {
  buttonIcon: {
    padding: 0,
  },
};

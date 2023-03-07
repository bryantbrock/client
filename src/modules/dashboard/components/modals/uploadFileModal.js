import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useDropzone } from "react-dropzone";
import { modalStyle } from "@/styles/modals";
import { original_green } from "@/utils/theme";

const panels = [
  {
    value: "Select...",
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

const setups = [
  {
    value: "Select...",
    label: "-- Select --",
  },
  {
    value: "Comparision",
    label: "Comparision",
  },
  {
    value: "Culture Comparision",
    label: "Culture Comparision",
  },
  {
    value: "Interfering Self Census",
    label: "Interfering Self Census",
  },
  {
    value: "Linearity",
    label: "Linearity",
  },
  {
    value: "LOD",
    label: "LOD",
  },
  {
    value: "Multiple",
    label: "Multiple",
  },
  {
    value: "Natrol",
    label: "Natrol",
  },
  {
    value: "Precision",
    label: "Precision",
  },
  {
    value: "Stability",
    label: "Stability",
  },
];

const runs = [
  {
    value: "Select...",
    label: "-- Select --",
  },
  {
    value: "D1A-D3B (for linearity)",
    label: "D1A-D3B (for linearity)",
  },
  {
    value: "D4A-D5D (for linearity)",
    label: "D4A-D5D (for linearity)",
  },
  {
    value: "D5E-D5J (for linearity)",
    label: "D5E-D5J (for linearity)",
  },
];

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  marginTop: 10,
  borderColor: original_green,
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  textAlign: "center",
};

const withFileStyle = {
  ...baseStyle,
  padding: "0px",
  marginTop: 0,
};

const focusedStyle = {
  borderColor: "#231E84",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const UploadFileModal = (props) => {
  const handleClose = () => props.closeModal();

  const [value, setValue] = useState("No");
  const [panel, setPanel] = useState(panels[0].value);
  const [setup, setSetup] = useState(setups[0].value);
  const [run, setRun] = useState(runs[0].value);
  const [lotNumber, setLotNumber] = useState("");

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "image/*": [],
      "application/octet-stream": [".pcrd", ".eds"],
    },
    multiple: false,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(acceptedFiles.length > 0 ? withFileStyle : {}),
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [acceptedFiles, isFocused, isDragAccept, isDragReject]
  );

  const acceptedFileItems = props.uploadFile
    ? props.uploadFile.map((file) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ))
    : acceptedFiles.map((file) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          color="primary"
        >
          Upload Data File
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          It’s best to upload a BioRad or Quant Studio data file. Excel and Word
          documents may take longer to process.
        </Typography>

        <div
          style={{
            marginTop: 15,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <Typography variant="subtitle1" style={{ color: "gray" }}>
              Is this data for an ongoing validation?
            </Typography>
            <Typography variant="subtitle2" style={{ color: "gray" }}>
              Select No if the validation/verification is complete
            </Typography>
          </div>

          <div
            style={{
              marginLeft: 15,
            }}
          >
            <FormControl>
              {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            1. Choose Panel
          </Typography>

          <TextField
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
          <Typography variant="h6" color="primary">
            2. Choose Setup
          </Typography>

          <TextField
            id="outlined-select-setups"
            required
            fullWidth
            select
            label="Select"
            value={setup}
            onChange={(event) => setSetup(event.target.value)}
            helperText="Please select your setup"
          >
            {setups.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            3. Choose Run
          </Typography>

          <TextField
            id="outlined-select-runs"
            required
            fullWidth
            select
            label="Select"
            value={run}
            onChange={(event) => setRun(event.target.value)}
            helperText="Please select your run"
          >
            {runs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            4. Enter Lot #
          </Typography>

          <TextField
            id="outlined-required"
            required
            label="Lot number"
            value={lotNumber}
            onChange={(event) => setLotNumber(event.target.value)}
            placeholder="Lot # (i.e. xxxxx-xxxx)"
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <Typography variant="h6" color="primary">
            5. Upload File
          </Typography>

          {props.uploadFile.length > 0 ? (
            <div>
              <aside>
                <ul>{acceptedFileItems}</ul>
              </aside>
            </div>
          ) : (
            <section>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag {"'n'"} drop a file here, or click to select file</p>
              </div>
              <aside>
                <ul>{acceptedFileItems}</ul>
              </aside>
            </section>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default UploadFileModal;

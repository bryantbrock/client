import React, { useMemo } from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { cardsStyles } from "@/styles/cards";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { original_green } from "@/utils/theme";
import PrimaryButton from "@/utils/primaryButton";
import SecondaryButton from "@/utils/secondaryButton";

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

const DragNDropCard = (props) => {
  const router = useRouter();

  const { description, name, links } = props;

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

  const acceptedFileItems = acceptedFiles.map((file, index) => (
    <li key={index}>
      {file.path} - {file.size} bytes
    </li>
  ));

  // If you want to access file contents you have to use the FileReader API:
  // https://react-dropzone.js.org/#section-basic-example

  return (
    <Card sx={cardsStyles.cardContainer} elevation={10}>
      <CardContent>
        <Typography
          variant="h5"
          style={{
            textAlign: "center",
          }}
          color="primary"
        >
          {name}
        </Typography>

        <Typography
          variant="body2"
          style={{ textAlign: "center", marginTop: 15 }}
        >
          {description}
        </Typography>

        <section>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Drag {"'n'"} drop a file here, or click to select file</p>
          </div>
          <aside>
            <ul>{acceptedFileItems}</ul>
          </aside>
        </section>
      </CardContent>

      <CardActions
        disableSpacing={true}
        style={{
          flexDirection: "column",
          position: "absolute",
          bottom: 0,
          justifyContent: "center",
          display: "flex",
          width: "95%",
        }}
      >
        {links.map((button, index) => (
          <div key={index} style={{ width: "100%" }}>
            {button.button_type === "primary" && (
              <PrimaryButton
                key={index}
                label={button.label}
                width="full"
                onClick={(e) => {
                  e.preventDefault();
                  if (button.type === "extern") {
                    window.open(button.path, "_blank", "noopener,noreferrer");
                  } else {
                    if (button.path === "uploadFileModal")
                      props.openUploadFileModal(acceptedFiles);

                    if (button.path === "/validation") router.push(button.path);
                  }
                }}
              />
            )}

            {button.button_type === "secondary" && (
              <SecondaryButton
                key={index}
                label={button.label}
                width="full"
                onClick={(e) => {
                  e.preventDefault();
                  if (button.type === "extern") {
                    window.open(button.path, "_blank", "noopener,noreferrer");
                  } else {
                    if (button.path === "uploadFileModal")
                      props.openUploadFileModal(acceptedFiles);

                    if (button.path === "/validation") router.push(button.path);
                  }
                }}
              />
            )}
          </div>
        ))}
      </CardActions>
    </Card>
  );
};

export default DragNDropCard;

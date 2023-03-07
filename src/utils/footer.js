import { Box, Container, Paper, Typography } from "@mui/material";
import React from "react";
import { original_blue } from "../services/theme";

export default function LoggedFooter() {
  return (
    <div
      style={{
        // flexGrow: 1,
        justifyContent: "center",
        display: "flex",
        // mb: 2,
        alignSelf: "center",
        width: "100%",
        backgroundColor: original_blue,
        marginTop: "3%",
        overflow: "hidden",
        position: "absolute",
        marginLeft: 0,
        left: 0,
        height: 100,
      }}
    >
      <Typography
        variant="caption"
        color="white"
        sx={{ alignSelf: "flex-end" }}
      >
        Powered by Molecular Designs
      </Typography>
    </div>
  );
}

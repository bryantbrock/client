import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const CollapsibleComponent = (props) => {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div>
      <Button
        style={{
          minWidth: 275,
          paddingLeft: 10,
          borderRadius: 0,
          textTransform: "none",
          width: "100%",
          justifyContent: "left",
          marginTop: 10,
        }}
        onClick={() => setCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
        <Typography variant="subtitle1" color="primary" align="left">
          {props.subtitle}
        </Typography>
      </Button>

      <div>{!isCollapsed && props.component}</div>
    </div>
  );
};

export default CollapsibleComponent;

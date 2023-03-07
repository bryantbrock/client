// @ts-nocheck
import React, { useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { Menu } from "@mui/material";

const LoggedLayoutDesktopButtons = (props) => {
  const router = useRouter();

  let currentlyHovering = false;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (e) => {
    if (anchorEl !== e.currentTarget) {
      setAnchorEl(e.currentTarget);
    }
  };

  const handleHover = () => {
    currentlyHovering = true;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseHover = () => {
    currentlyHovering = false;
    setTimeout(() => {
      if (!currentlyHovering) {
        handleClose();
      }
    }, 50);
  };

  return (
    <>
      <Button
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={(e) => {
          handleClick(e);
          router.push(props.buttons.main_path);
        }}
        onMouseOver={handleClick}
        onMouseLeave={handleCloseHover}
        key={props.buttons.main_path}
        sx={{ color: "white" }}
        variant="outlined"
        style={{
          borderRadius: 0,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {props.buttons.main_text}
      </Button>
      {props.buttons.alts.length > 0 && (
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
          MenuListProps={{
            onMouseEnter: handleHover,
            onMouseLeave: handleCloseHover,
            style: { pointerEvents: "auto" },
          }}
          // getContentAnchorEl={null}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          {props.buttons.alts.map((item, index) => (
            <MenuItem
              onClick={() => {
                handleClose();
                router.push(item.path);
              }}
              key={index}
            >
              {item.menu_text}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default LoggedLayoutDesktopButtons;

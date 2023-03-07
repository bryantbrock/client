// @ts-nocheck
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";
import { Badge, Menu } from "@mui/material";

import IconButton from "@mui/material/IconButton";

const LoggedLayoutNavIcons = (props) => {
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
      <IconButton
        color="inherit"
        aria-label="notifications"
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={(e) => {
          handleClick(e);
          router.push(props.main_path);
        }}
        onMouseOver={handleClick}
        onMouseLeave={handleCloseHover}
        key={props.main_path}
        sx={{ color: "white" }}
        style={{
          borderRadius: 0,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {props.has_badge ? (
          <Badge badgeContent={props.badge_num} color="error">
            {props.main_icon}
          </Badge>
        ) : (
          props.main_icon
        )}
      </IconButton>
      {props.alts.length > 0 && (
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
          {props.alts.map((item, index) => (
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

export default LoggedLayoutNavIcons;

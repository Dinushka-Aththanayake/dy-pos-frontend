import React from "react";
import { Box, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";


function Footer() {
  const navigate= useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: "70px",
        right: "10px",
        // bottom: "10px",
        // left: "10px",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        listStyle: "none",
        gap: 1,
        backgroundColor: "red",
        color: "white",
        padding: "4px 4px",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      
      <IconButton sx={{ color: "white" }}>
        <NotificationsIcon />
        
      </IconButton>
      <IconButton sx={{ color: "white" }}>
      <LogoutIcon onClick={()=>navigate("/")}/>
       </IconButton >
    </Box>
  );
}

export default Footer;

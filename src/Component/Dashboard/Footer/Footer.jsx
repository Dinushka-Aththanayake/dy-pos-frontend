import React, { useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import "./Footer.css"; // <-- Link to CSS file

function Footer() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const dummyNotifications = [
    "No Notifications..",

  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: "70px",
        right: "10px",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: "white",
          color: "white",
          padding: "4px 4px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          opacity :"0.5"
        }}
      >
        <IconButton sx={{ color: "white", backgroundColor:"red"}} onClick={() => setShowNotifications(!showNotifications)}>
          <NotificationsIcon />
        </IconButton>

        <IconButton sx={{ color: "white", backgroundColor: "red" }} onClick={() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("employee");
          navigate("/")
        }}>
          <LogoutIcon />
        </IconButton>
      </Box>

      {showNotifications && (
        <Paper elevation={3} className="notification-box">
          <Typography variant="subtitle1" sx={{ padding: "8px" }}>
            <strong>No Notifications..</strong> 
          </Typography>
          
        </Paper>
      )}
    </Box>
  );
}

export default Footer;

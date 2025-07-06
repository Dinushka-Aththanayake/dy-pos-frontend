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
    "New booking received",
    "User John updated profile",
    "Flight AI-203 delayed",
    "Payment received from Jane",
    "Maintenance scheduled tomorrow",
    "Flight schedule updated",
    "Admin approved request",
    "New user registered",
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

        <IconButton sx={{ color: "white" , backgroundColor:"red"}} onClick={() => navigate("/")}>
          <LogoutIcon />
        </IconButton>
      </Box>

      {showNotifications && (
        <Paper elevation={3} className="notification-box">
          <Typography variant="subtitle1" sx={{ padding: "8px" }}>
            <strong>Notifications</strong> 
          </Typography>
          <ol className="notification-list">
            {dummyNotifications.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ol>
        </Paper>
      )}
    </Box>
  );
}

export default Footer;

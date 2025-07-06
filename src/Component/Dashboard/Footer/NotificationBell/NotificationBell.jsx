import React, { useState } from "react";
import "./NotificationBell.css"; // Import the CSS file
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const notifications = [
    "New appointment scheduled.",
    "Inventory updated.",
    "Payment received.",
    "New jobcard added."
  ];

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={toggleNotifications}>
        <FaBell size={20} color="white" />
      </div>

      {showNotifications && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="notification-item">No notifications</div>
          ) : (
            notifications.map((note, index) => (
              <div key={index} className="notification-item">
                {note}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

import React, { useState, useEffect } from "react";
import "./NewAppoinment.css";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDateToISO } from "../../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function NewAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const editAppointment = location.state?.appointmentsss || null;
  const [numPlate, setNumPlate] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerTelephone, setcustomerTelephone] = useState("");
  const branchId = 1;

  const token = localStorage.getItem("access_token");

  // Pre-fill form fields if editing
  useEffect(() => {
    if (editAppointment) {
      setNumPlate(editAppointment.numPlate || "");
      setCustomerName(editAppointment.customerName || "");
      setcustomerTelephone(editAppointment.customerTelephone || "");

      if (editAppointment.datetime) {
        const datetime = new Date(editAppointment.datetime);
        const dateStr = datetime.toISOString().split("T")[0];
        const timeStr = datetime
          .toTimeString()
          .split(":")
          .slice(0, 2)
          .join(":");
        setDate(dateStr);
        setTime(timeStr);
      }
    }
  }, [editAppointment]);

  const handleConfirm = async () => {
    const datetime = formatDateToISO(date, time);
    const branchInt = branchId ? parseInt(branchId, 10) : 1;

    const requestData = {
      numPlate,
      datetime,
      customerName,
      customerTelephone,
      branchId: branchInt,
    };

    // Include ID for update
    if (editAppointment?.id) {
      requestData.id = editAppointment.id;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/upsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        alert(
          editAppointment
            ? "Appointment updated successfully!"
            : "Appointment created successfully!"
        );
        navigate("/appoinment");
      } else {
        alert("Failed to save appointment.");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Error saving appointment. Please try again.");
    }
  };

  const fetchAppointmentsByDate = async (selectedDate) => {
    if (!selectedDate) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/search?afterDate=${formatDateToISO(selectedDate, "00:00")}&beforeDate=${formatDateToISO(selectedDate, "23:59")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setAppointments(data);
        setFilteredAppointments(data);
      } else {
        setAppointments([]);
        setFilteredAppointments([]);
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching appointments by date:", error);
    }
  };

  useEffect(() => {
    if (date) {
      fetchAppointmentsByDate(date);
    } else {
      setFilteredAppointments([]);
    }
  }, [date]);

  const formatDate = (datetime) => {
    const dateObj = new Date(datetime);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  return (
    <div>
      <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
        New Appointment
      </h2>
      <div className="new-appointment-container">
        <div className="appointment-form-box">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Number Plate:</label>
              <input
                type="text"
                value={numPlate}
                onChange={(e) => setNumPlate(e.target.value.toUpperCase())}
              />
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Customer Name:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mobile Number:</label>
              <input
                type="text"
                value={customerTelephone}
                onChange={(e) => setcustomerTelephone(e.target.value)}
              />
            </div>
          </form>
          <div className="button-group">
            <button className="confirm-btn9" onClick={handleConfirm}>
              {editAppointment ? "Update" : "Confirm"}
            </button>
            <button
              className="cancel-btn9"
              onClick={() => navigate("/appoinment")}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="appointment-list-box">
          <div className="new-appointment-header">
            <h2>Appointments</h2>
          </div>
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Number Plate</th>
                <th>Time</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.numPlate}</td>
                    <td>{formatDate(appointment.datetime).time}</td>
                    <td>{appointment.branch?.name || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No appointments for selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NewAppointment;

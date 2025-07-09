import React, { useState, useEffect } from "react";
import "./NewAppoinment.css";
import { useNavigate } from "react-router-dom";
import { formatDateToISO } from "../../../../utils";

function NewAppointment() {
  const navigate = useNavigate();
  const [numPlate, setNumPlate] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerTelephone, setcustomerTelephone] = useState("");
  const [branchId, setBranchId] = useState("");

  const token = localStorage.getItem("access_token");

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

    try {
      const response = await fetch(
        "http://localhost:3000/appointments/upsert",
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
        alert("Appointment created successfully!");
        navigate("/appoinment");
      } else {
        alert("Failed to create appointment.");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Error creating appointment. Please try again.");
    }
  };

  // 🔍 Fetch appointments based on selected date
  const fetchAppointmentsByDate = async (selectedDate) => {
    if (!selectedDate) return;

    try {
      const response = await fetch(
        `http://localhost:3000/appointments/search?date=${selectedDate}`,
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
        console.error("Unexpected response format:", data);
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments by date:", error);
    }
  };

  // ⏱ Watch for changes in date and fetch accordingly
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
    const time = dateObj.toLocaleTimeString();
    return { date, time };
  };
  return (
    <div className="new-appointment-container">
      <div className="appointment-form-box">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Number Plate:</label>
            <input
              type="text"
              value={numPlate}
              onChange={(e) => setNumPlate(e.target.value)}
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
          <div className="form-group">
            <label>Branch:</label>
            <select
              className="branch-dropdown11"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="1">Ganemulla</option>
              <option value="2">Kadawatha</option>
            </select>
          </div>
        </form>
        <div className="button-group">
          <button className="confirm-btn9" onClick={handleConfirm}>
            Confirm
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
  );
}

export default NewAppointment;

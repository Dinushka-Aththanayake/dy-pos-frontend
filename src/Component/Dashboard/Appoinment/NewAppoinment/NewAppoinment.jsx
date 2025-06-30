import React, { useState, useEffect } from "react";
import "./NewAppoinment.css";
import { useNavigate } from "react-router-dom";

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
    const datetime = `${date} ${time}:00`;
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
        "http://localhost:3000/appointments/create",
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
        navigate("/dashboard");
      } else {
        alert("Failed to create appointment.");
        
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Error creating appointment. Please try again.");
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/appointments/search", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const today = new Date().toISOString().split("T")[0];
          const todayAppointments = data.filter((app) =>
            app.datetime.startsWith(today)
          );
          setAppointments(todayAppointments);
          setFilteredAppointments(todayAppointments);
        } else {
          console.error("Unexpected response format:", data);
          setAppointments([]);
          setFilteredAppointments([]);
        }
      })
      .catch((error) => console.error("Error fetching appointments!", error));
  }, []);

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
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="appointment-list-box">
        <div className="new-appointment-header">
          <h2>Today Appointments</h2>
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
            {filteredAppointments.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.numPlate}</td>
                <td>
                  {appointment.datetime
                    ? appointment.datetime.split(" ")[1]?.slice(0, 5)
                    : "N/A"}
                </td>
                <td>{appointment.branch?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NewAppointment;

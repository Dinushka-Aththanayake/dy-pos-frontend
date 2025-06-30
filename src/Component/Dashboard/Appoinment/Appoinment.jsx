import React, { useState, useEffect } from "react";
import "./Appoinment.css";
import { useNavigate } from "react-router-dom";

function Appointment() {
  const Navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchPlate, setSearchPlate] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("http://localhost:3000/branches/findAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBranches(data);
        } else {
          console.error("Unexpected response format:", data);
          setBranches([]);
        }
      })
      .catch((error) => console.error("Error fetching branches!", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

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
          setAppointments(data);
          setFilteredAppointments(data);
        } else {
          console.error("Unexpected response format:", data);
          setAppointments([]);
          setFilteredAppointments([]);
        }
      })
      .catch((error) => console.error("Error fetching appointments!", error));
  }, []);

  const handleSearch = () => {
    let filtered = [...appointments];

    if (searchPlate.trim() !== "") {
      filtered = filtered.filter(
        (appointment) =>
          appointment.numPlate && appointment.numPlate.includes(searchPlate)
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (appointment) => formatDate(appointment.datetime).date === selectedDate
      );
    }

    if (selectedBranch !== "All") {
      filtered = filtered.filter(
        (appointment) =>
          appointment.branch && appointment.branch.name === selectedBranch
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    handleSearch();
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    handleSearch();
  };

  const handleCancel = async (id) => {
    if (!id) return;

    const appointmentId = Number(id); // Ensure it's an integer

    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(
          `http://localhost:3000/appointments/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: appointmentId }), // Pass correct parameter name
          }
        );

        if (response.ok) {
          alert("Appointment canceled successfully.");
          setAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== appointmentId)
          );
          setFilteredAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== appointmentId)
          );
          setSelectedAppointment(null);
        } else {
          const errorData = await response.json();
          alert(`Failed to cancel the appointment: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error canceling appointment:", error);
        alert("An error occurred while canceling the appointment.");
      }
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const formatDate = (datetime) => {
    const dateObj = new Date(datetime);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return { date, time };
  };

  return (
    <div className="appointment-content">
      <div className="appointment-table-section">
        <div className="filter-section">
          <input
            type="text"
            placeholder="Enter Number Plate..."
            className="search-input1"
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value)}
          />
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={searchPlate.trim() === ""}
          >
            Search
          </button>
        </div>
        <div className="filter-section5">
          <input
            type="date"
            className="date-picker"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <select
            className="branch-dropdown"
            value={selectedBranch}
            onChange={handleBranchChange}
          >
            <option value="All">All</option>
            {branches.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="appintment-table-container">
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Number Plate</th>
                <th>Date</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => {
                const { date } = formatDate(appointment.datetime);
                return (
                  <tr
                    key={appointment.id}
                    onClick={() => handleAppointmentClick(appointment)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedAppointment?.id === appointment.id
                          ? "#f0f0f0"
                          : "",
                    }}
                  >
                    <td>{appointment.numPlate}</td>
                    <td>{date}</td>
                    <td>{appointment.branch.name}</td>
                    <td>
                      <button
                        className={`status-btn ${appointment.status.toLowerCase()}`}
                        disabled
                      >
                        {appointment.status}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          className="action-btn"
          onClick={() => Navigate("/newappoinment")}
        >
          Create New Appointment
        </button>
      </div>
      <div className="appointment-form-container">
        <form>
          <div className="form-field">
            <label>Number Plate:</label>
            <input
              type="text"
              value={selectedAppointment ? selectedAppointment.numPlate : ""}
              readOnly
            />
          </div>
          <div className="form-field">
            <label>Customer Name:</label>
            <input
              type="text"
              value={
                selectedAppointment ? selectedAppointment.customerName : ""
              }
              readOnly
            />
          </div>
          <div className="form-field">
            <label>Mobile Number:</label>
            <input
              type="text"
              value={
                selectedAppointment ? selectedAppointment.customerTelephone : ""
              }
              readOnly
            />
          </div>
          <div className="form-field">
            <label>Date:</label>
            <input
              type="text"
              value={
                selectedAppointment
                  ? formatDate(selectedAppointment.datetime).date
                  : ""
              }
              readOnly
            />
          </div>
          <div className="form-field">
            <label>Time:</label>
            <input
              type="text"
              value={
                selectedAppointment
                  ? formatDate(selectedAppointment.datetime).time
                  : ""
              }
              readOnly
            />
          </div>
          <div className="form-field">
            <label>Branch:</label>
            <input
              type="text"
              value={selectedAppointment ? selectedAppointment.branch.name : ""}
              readOnly
            />
          </div>
        </form>
        <div className="buttongroupap">
          <button
            className="cancel-btn22"
            onClick={() => handleCancel(selectedAppointment?.id)}
            disabled={!selectedAppointment}
          >
            Cancel Appointment
          </button>
          <button
            className="action-btn22"
            onClick={() =>
              Navigate("/newjobcard", { state: selectedAppointment })
            }
            disabled={!selectedAppointment}
          >
            Create Jobcard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Appointment;

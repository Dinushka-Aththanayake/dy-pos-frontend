import React, { useState, useEffect } from "react";
import "./Appoinment.css";
import { useNavigate } from "react-router-dom";
import { formatDateToISO } from "../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility for showing dialogs
const showDialog = async (options) => {
  if (window.electronAPI && window.electronAPI.showMessageBox) {
    await window.electronAPI.showMessageBox(options);
  } else {
    window.alert(options.message || options.title || '');
  }
};
const showError = async (title, message) => {
  if (window.electronAPI && window.electronAPI.showErrorBox) {
    await window.electronAPI.showErrorBox(title, message);
  } else {
    window.alert(message || title || '');
  }
};

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

    fetch(`${API_BASE_URL}/branches/findAll`, {
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

  const fetchAppointments = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/search`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
      console.error("Error fetching appointments!", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);


  const handleSearch = () => {
    const token = localStorage.getItem("access_token");
    const url = new URL(`${API_BASE_URL}/appointments/search`);

    if (searchPlate.trim() !== "") {
      url.searchParams.append("numPlate", searchPlate.trim().toUpperCase());
    }

    if (selectedDate) {
      url.searchParams.append("afterDate", formatDateToISO(selectedDate, "00:00"));
      url.searchParams.append("beforeDate", formatDateToISO(selectedDate, "23:59"));
    }

    if (selectedBranch !== "All") {
      const branchObj = branches.find((b) => b.name === selectedBranch);
      if (branchObj) {
        url.searchParams.append("branchId", branchObj.id);
      }
    }

    fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFilteredAppointments(data);
        } else {
          console.error("Unexpected search response format:", data);
          setFilteredAppointments([]);
        }
      })
      .catch((error) => {
        console.error("Error searching appointments!", error);
        setFilteredAppointments([]);
      });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleCancel = async (id) => {
    if (!id) return;

    const appointmentId = Number(id);

    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(
          `${API_BASE_URL}/appointments/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: appointmentId }),
          }
        );

        if (response.ok) {
          window.electronAPI.showMessageBox({
            type: 'info',
            message: 'Appointment canceled successfully.'
          });
          fetchAppointments();
          setAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== appointmentId)
          );
          setFilteredAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== appointmentId)
          );
          setSelectedAppointment(null);
        } else {
          const errorData = await response.json();
          window.electronAPI.showErrorBox('Cancel Failed', `Failed to cancel the appointment: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error canceling appointment:", error);
        window.electronAPI.showErrorBox('Error', 'An error occurred while canceling the appointment.');
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
    <div style={{backgroundColor:"#f0f8ff",padding:"20px",paddingLeft:"20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}}>
        <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
          Appointments
        </h2>
        <button className="action-btn" onClick={() => Navigate("new")}
          style={{padding:"10px"}}>
          Create Appointment
        </button>
      </div>
      <div className="appointment-content">
        <div className="appointment-table-section">
          <div className="filter-section">
            <input
              type="text"
              placeholder="Enter Number Plate..."
              className="search-input1"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
              style={{flex:4}}
            />
            <input
              type="date"
              className="date-picker"
              value={selectedDate}
              onChange={handleDateChange}
              style={{flex:1}}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
          
          <div
            className="appintment-table-container2"
            style={{
              marginTop: "20px",
              overflowX: "auto",
              borderRadius: "10px",
              border: "1px solid #d0e1f9",
              backgroundColor: "#f4faff",
              boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.1)",
              padding: "0",
            }}
          >
            <table
              className="appointment-table2"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Arial, sans-serif",
                color: "#003366",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#cce5ff",
                  textAlign: "left",
                }}
              >
                <tr style={{ backgroundColor: "#e6f2ff" }}>
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
        </div>
        {selectedAppointment &&(
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
                  selectedAppointment
                    ? selectedAppointment.customerTelephone
                    : ""
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
                value={
                  selectedAppointment ? selectedAppointment.branch.name : ""
                }
                readOnly
              />
            </div>
          </form>
          {(selectedAppointment?.status === "PENDING") && (
          <div className="buttongroupap">
            <button
              className="cancel-btn22"
              onClick={() => {
                if (
                  !selectedAppointment ||
                  selectedAppointment.status === "CANCELLED" ||
                  selectedAppointment.status === "COMPLETED"
                ) {
                  showDialog({
                    type: 'warning',
                    message: "Action not allowed for CANCELLED or COMPLETED appointments."
                  });
                  return;
                }
                handleCancel(selectedAppointment.id);
              }}
            >
              Cancel Appointment
            </button>

            <button
              className="action-btn22"
              onClick={async () => {
                if (
                  !selectedAppointment ||
                  selectedAppointment.status === "CANCELLED" ||
                  selectedAppointment.status === "COMPLETED"
                ) {
                  showDialog({
                    type: 'warning',
                    message: "You cannot create a jobcard for a CANCELLED or COMPLETED appointment."
                  });
                  return;
                }

                const token = localStorage.getItem("access_token");

                try {
                  const response = await fetch(
                    `${API_BASE_URL}/appointments/complete`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ id: selectedAppointment.id }),
                    }
                  );

                  if (response.ok) {
                    Navigate("/jobcard/new", {
                      state: { appointments: selectedAppointment },
                    });
                  } else {
                    const errorData = await response.json();
                    showError('Error', errorData.message || 'Failed to complete appointment.');
                  }
                } catch (error) {
                  console.error("Error completing appointment:", error);
                  showError('Error', error.message || 'Failed to complete appointment.');
                }
              }}
            >
              Create Jobcard
            </button>

            <button
              className="action-btn22"
              onClick={() => {
                if (
                  !selectedAppointment ||
                  selectedAppointment.status === "CANCELLED" ||
                  selectedAppointment.status === "COMPLETED"
                ) {
                  showDialog({
                    type: 'warning',
                    message: "You cannot edit a CANCELLED or COMPLETED appointment."
                  });
                  return;
                }
                Navigate("new", {
                  state: { appointmentsss: selectedAppointment },
                });
              }}
            >
              Edit
            </button>
          </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

export default Appointment;

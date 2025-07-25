import "./JobCard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { div, s } from "framer-motion/client";
import { formatDateToISO } from "../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility for showing dialogs
const showDialog = async (options) => {
  if (window.electronAPI && window.electronAPI.showMessageBox) {
    await window.electronAPI.showMessageBox(options);
  } else {
    window.alert(options.message || options.title || "");
  }
};

function JobCard() {
  const Navigate = useNavigate();
  const [jobCards, setJobCards] = useState([]);
  const [selectedJobCard, setSelectedJobCard] = useState(null);

  const [searchNumPlate, setSearchNumPlate] = useState("");
  const [createdAfter, setCreatedAfter] = useState("");
  const [createdBefore, setCreatedBefore] = useState("");

  const formatDate = (datetime) => {
    if (!datetime) return { date: "", time: "" };
    const dateObj = new Date(datetime);
    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const fetchJobCards = (params = {}) => {
    const token = localStorage.getItem("access_token");
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/jobCards/search${
      queryParams ? `?${queryParams}` : ""
    }`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJobCards(data);
        } else {
          console.error("Unexpected response format:", data);
          setJobCards([]);
        }
      })
      .catch((error) => console.error("error fetching jobcards!", error));
  };

  useEffect(() => {
    fetchJobCards(); // Initial load
  }, []);

  const handleSearch = () => {
    const params = {};
    if (searchNumPlate) params.numPlate = searchNumPlate;
    if (createdAfter)
      params.createdAfter = formatDateToISO(createdAfter, "00:00");
    if (createdBefore)
      params.createdBefore = formatDateToISO(createdBefore, "23:59");
    fetchJobCards(params);
  };

  return (
    <div style={{ backgroundColor: "#eff5fd", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
          Job Cards
        </h2>
        <button className="btn-primary" onClick={() => Navigate("new")}>
          Create Job Card
        </button>
      </div>

      <div className="jobcard-content">
        <div className="jobcard-left">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="filter-container">
              <input
                type="text"
                placeholder="Search by Number Plate..."
                value={searchNumPlate}
                onChange={(e) =>
                  setSearchNumPlate(e.target.value.toUpperCase())
                }
                style={{ flex: 5 }}
              />{" "}
              <input
                type="date"
                className="input-date-jobcard"
                value={createdAfter}
                onChange={(e) => setCreatedAfter(e.target.value)}
              />
              <input
                type="date"
                className="input-date-jobcard"
                value={createdBefore}
                onChange={(e) => setCreatedBefore(e.target.value)}
              />
              <button className="btn-primary" onClick={handleSearch}>
                Search
              </button>{" "}
            </div>
          </div>
          <div
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
              className="job-table1"
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
                  <th style={{ textAlign: "center" }}>#</th>
                  <th style={{ textAlign: "center" }}>Vehicle Num</th>
                  <th style={{ textAlign: "center" }}>Created</th>
                  <th style={{ textAlign: "center" }}>Completed</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobCards.map((jobCard, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedJobCard(jobCard)}
                    className={
                      selectedJobCard === jobCard ? "selected-row" : ""
                    }
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedJobCard?.id === jobCard.id ? "#f0f0f0" : "",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{jobCard.numPlate}</td>
                    <td>{formatDate(jobCard.created).date}</td>
                    <td>{formatDate(jobCard.completed).date}</td>
                    <td>
                      <button
                        className={`status-btn ${jobCard.status.toLowerCase()}`}
                        disabled
                      >
                        {jobCard.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section - Job Details */}
        {selectedJobCard && (
          <div className="jobcard-right">
            <div className="info-box">
              <p>
                <strong>Reference Number:</strong>{" "}
                {selectedJobCard ? selectedJobCard.id : ""}
              </p>
              <p>
                <strong>Number Plate:</strong>{" "}
                {selectedJobCard ? selectedJobCard.numPlate : ""}
              </p>
              <p>
                <strong>Name:</strong>{" "}
                {selectedJobCard ? selectedJobCard.customerName : ""}
              </p>
              <p>
                <strong>Mobile Number:</strong>{" "}
                {selectedJobCard ? selectedJobCard.customerTelephone : ""}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {selectedJobCard
                  ? formatDate(selectedJobCard.created).date
                  : ""}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {selectedJobCard
                  ? formatDate(selectedJobCard.completed).date
                  : ""}
              </p>
              <p>
                <strong>Branch:</strong> {selectedJobCard?.branch?.name || ""}
              </p>
            </div>
            <div
              className="job-details"
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
                className="details-table"
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
                  <tr>
                    <th>#</th>
                    <th>Job</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Charge</th>
                    <th>Employee</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJobCard?.jobs?.map((job, index) => {
                    return (
                      <tr key={job.id} style={{ backgroundColor: "#e6f2ff" }}>
                        <td>{index + 1}</td>
                        <td>{job.title}</td>
                        <td>{formatDate(job.startTime).time}</td>
                        <td>{formatDate(job.endTime).time}</td>
                        <td>{job.charge}</td>
                        <td>{job.employee.firstName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!(selectedJobCard.status === "COMPLETED") && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "15px",
                }}
              >
                <button
                  className="btn-secondary111"
                  style={{ flex: 1, marginTop: "15px" }}
                  disabled={
                    !selectedJobCard || selectedJobCard.status === "COMPLETED"
                  }
                  onClick={async () => {
                    if (!selectedJobCard) {
                      await showDialog({
                        type: "error",
                        title: "No Selection",
                        message: "Please select a Job Card first.",
                      });
                    } else if (selectedJobCard.status === "COMPLETED") {
                      await showDialog({
                        type: "error",
                        title: "Cannot Edit",
                        message:
                          "Completed bill cannot be edited or billed again.",
                      });
                    } else {
                      Navigate("/billing", {
                        state: { jobCard: selectedJobCard },
                      });
                    }
                  }}
                >
                  Create a Bill
                </button>

                <button
                  className="btn-secondary111"
                  style={{ flex: 1, marginTop: "15px" }}
                  disabled={
                    !selectedJobCard || selectedJobCard.status === "COMPLETED"
                  }
                  onClick={async () => {
                    if (!selectedJobCard) {
                      await showDialog({
                        type: "error",
                        title: "No Selection",
                        message: "Please select a Job Card first.",
                      });
                    } else if (selectedJobCard.status === "COMPLETED") {
                      await showDialog({
                        type: "error",
                        title: "Cannot Edit",
                        message:
                          "Completed bill cannot be edited or billed again.",
                      });
                    } else {
                      Navigate("new", { state: { jobcard: selectedJobCard } });
                    }
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

export default JobCard;

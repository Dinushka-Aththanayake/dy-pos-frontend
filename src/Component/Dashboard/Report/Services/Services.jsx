import React, { useState, useEffect } from "react";
import "./Services.css";
import {
  formatDateToISO,
  formatDateToLocalString,
  formatDateToTime,
} from "../../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Services() {
  const [employee, setEmployee] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jobReference, setJobReference] = useState("");

  const token = localStorage.getItem("access_token");

  // Fetch employees
  useEffect(() => {
    fetch(`${API_BASE_URL}/employees/findAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEmployee(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching employees!", err));
  }, [token]);

  // Fetch all jobs initially
  useEffect(() => {
    fetchJobs(); // call the fetch function without filters
  }, [token]);

  const fetchJobs = (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/jobs/search${params ? `?${params}` : ""}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const jobList = Array.isArray(data) ? data : [];
        setJobs(jobList);
        setFilteredJobs(jobList);
        console.log("Fetched jobs:", jobList);
      })
      .catch((err) => console.error("Error fetching jobs!", err));
  };

  const handleSearch = () => {
    const filters = {};
    if (selectedEmployee) filters.employeeId = selectedEmployee;
    if (startDate) filters.completedAfter = formatDateToISO(startDate, "00:00");
    if (endDate) filters.completedBefore = formatDateToISO(endDate, "23:59");
    if (jobReference) filters.id = jobReference;
    fetchJobs(filters); // fetch jobs with query filters
  };

  const totalPrice = filteredJobs.reduce(
    (sum, job) => sum + (job.charge || 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="sales-report-container">
        <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
          Services History
        </h2>
        <div className="sales-filter-section">
          <select
            style={{ width: "100%" }}
            className="employee-selector"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All</option>
            {employee.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="date-picker"
            placeholder="Job Reference"
            value={jobReference}
            onChange={(e) => setJobReference(e.target.value)}
          />
          <input
            type="date"
            className="date-picker"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="date-picker"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            className="searchbutton"
            onClick={handleSearch}
            style={{
              padding: "10px",
              backgroundColor: "#4682b4",
              color: "white",
            }}
          >
            Search
          </button>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <div
            style={{
              marginTop: "20px",
              overflowX: "auto",
              borderRadius: "10px",
              border: "1px solid #d0e1f9",
              backgroundColor: "#f4faff",
              boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.1)",
              padding: "0",
              flex: 4.5,
            }}
          >
            <table
              className="sales-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Arial, sans-serif",
                color: "#003366",
              }}
            >
              <thead style={{ backgroundColor: "#cce5ff", textAlign: "left" }}>
                <tr>
                  <th>Ref</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Employee</th>
                  <th>Start </th>
                  <th>Expected </th>
                  <th>End</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job, index) => {
                    const emp = employee.find((e) => e.id === job.employeeId);
                    return (
                      <tr key={job.id}>
                        <td>{job.id || "-"}</td>
                        <td>{job.title || "-"}</td>
                        <td>{(job.charge || 0).toFixed(2)}</td>
                        <td>{job.employee.firstName || "-"}</td>
                        <td>
                          {job.startTime
                            ? formatDateToTime(new Date(job.startTime))
                            : "-"}{" "}
                        </td>
                        <td>
                          {job.expectedEndTime
                            ? formatDateToTime(new Date(job.expectedEndTime))
                            : "-"}
                        </td>
                        <td>
                          {job.endTime
                            ? formatDateToTime(new Date(job.endTime))
                            : "-"}
                        </td>
                        <td>
                          {job.jobCard.completed
                            ? formatDateToLocalString(
                                new Date(job.jobCard.completed)
                              )
                            : "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div
            className="summary"
            style={{
              flex: 1,
              borderRadius: "10px",
              border: "1px solid #d0e1f9",
              backgroundColor: "#f4faff",
              boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.1)",
              padding: "15px",
              maxHeight: "200px",
            }}
          >
            <p style={{ marginTop: "15px", fontWeight: "bold" }}>
              Total Sale Price:
            </p>
            <p style={{ fontSize: "18px", color: "#0077cc" }}>
              {" "}
              Rs. {totalPrice}.00
            </p>
            <button
              className="searchbutton"
              style={{ float: "right", padding: "10px 25px 10px 25px" }}
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;

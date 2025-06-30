import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import "./NewJobcards.css";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function NewJobcards() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const location = useLocation();
  const appointment = location.state || {};
  console.log("From appointment: " + appointment.customerName); 
  const [employee, setEmployee] = useState([]);
  const [branches, setBranches] = useState([]);
  const [jobCard, setJobCard] = useState(
    {
    numPlate: appointment.numPlate || "",
    completed: "",
    customerName:appointment.customerName || "",
    customerTelephone: appointment.customerTelephone ||"",
    branchId: "",
    jobs: [{ title: "", charge: 0, startTime: "", expectedEndTime: "", endTime: "", employeeId: null }],
  });

  const getFormattedDateTime = () => new Date().toISOString();

  const formatToISO = (time) => {
    if (!time) return null;
    const date = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };

  useEffect(() => {
    fetch("http://localhost:3000/employees/findAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setEmployee(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching employees!", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/branches/findAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching branches!", error));
  }, []);

  const handleChange = (field, value) => {
    setJobCard({ ...jobCard, [field]: value });
  };

  const handleJobChange = (index, field, value) => {
    const updatedJobs = [...jobCard.jobs];
    if (field === "charge") {
      updatedJobs[index][field] = parseInt(value, 10) || 0;
    } else if (field === "employeeId") {
      updatedJobs[index][field] = value ? parseInt(value, 10) : null;
    } else if (["startTime", "expectedEndTime", "endTime"].includes(field)) {
      updatedJobs[index][field] = formatToISO(value);
    } else {
      updatedJobs[index][field] = value;
    }
    setJobCard({ ...jobCard, jobs: updatedJobs });
  };

  const addNewJob = () => {
    setJobCard({
      ...jobCard,
      jobs: [
        ...jobCard.jobs,
        { title: "", charge: 0, startTime: "", expectedEndTime: "", endTime: "", employeeId: null },
      ],
    });
  };

  const deleteJob = (index) => {
    const updatedJobs = jobCard.jobs.filter((_, i) => i !== index);
    setJobCard({ ...jobCard, jobs: updatedJobs });
  };

  const submitJobCard = async () => {
    const formattedJobCard = {
      ...jobCard,
      completed: getFormattedDateTime(),
      branchId: parseInt(jobCard.branchId, 10),
    };

    try {
      const response = await fetch("http://localhost:3000/jobCards/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedJobCard),
      });

      if (response.ok) {
        alert("Job Card created successfully!");
        navigate("/dashboard");
      } else {
        alert("Failed to create Job Card.");
      }
    } catch (error) {
      console.error("Error creating Job Card:", error);
      alert("Error creating Job card. Please try again.");
    }
  };

  return (
    <div className="job-card1">
      <div className="secnew-jobcard">
        <div className="form-group">
          <label>Number Plate:</label>
          <input type="text" value={jobCard.numPlate} onChange={(e) => handleChange("numPlate", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Customer Name:</label>
          <input type="text" value={jobCard.customerName} onChange={(e) => handleChange("customerName", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Mobile Number:</label>
          <input type="text" value={jobCard.customerTelephone}  onChange={(e) => handleChange("customerTelephone", e.target.value)} />
        </div>
        <div className="form-group">
          <label>Branch:</label>
          <select onChange={(e) => handleChange("branchId", e.target.value)} defaultValue="">
            <option value="" disabled>Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <table className="job-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Job</th>
              <th>Charge</th>
              <th>Start Time</th>
              <th>Expected Endtime</th>
              <th>End Time</th>
              <th>Employee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobCard.jobs.map((job, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input type="text" onChange={(e) => handleJobChange(index, "title", e.target.value)} />
                </td>
                <td>
                  <input type="number" onChange={(e) => handleJobChange(index, "charge", e.target.value)} />
                </td>
                <td>
                  <input type="time" onChange={(e) => handleJobChange(index, "startTime", e.target.value)} />
                </td>
                <td>
                  <input type="time" onChange={(e) => handleJobChange(index, "expectedEndTime", e.target.value)} />
                </td>
                <td>
                  <input type="time" onChange={(e) => handleJobChange(index, "endTime", e.target.value)} />
                </td>
                <td>
                  <select onChange={(e) => handleJobChange(index, "employeeId", e.target.value)} defaultValue="">
                    <option value="" disabled>Select employee</option>
                    {employee.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <IconButton onClick={() => deleteJob(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-group11">
          <button className="add-job-btn" onClick={addNewJob}>
            Add New Job
          </button>
          <button className="add-job-cancalbtn" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button className="proceed-btn" onClick={submitJobCard}>
            Submit Job Card
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewJobcards;

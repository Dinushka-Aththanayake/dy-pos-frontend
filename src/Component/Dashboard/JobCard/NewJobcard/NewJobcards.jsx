import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NewJobcards.css";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  formatDateToISO,
  formatDateToISODate,
  formatDateToTime,
  getTodayDate,
} from "../../../../utils";

function NewJobcards() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const location = useLocation();
  const { appointments, jobcard } = location.state || {};
  const [appointment, setAppointment] = useState(appointments);
  const [editJobCard, setEditJobCard] = useState(jobcard);
  const [employee, setEmployee] = useState([]);
  const [branches, setBranches] = useState([]);

  const [jobCard, setJobCard] = useState(() => {
    if (editJobCard) {
      return {
        ...editJobCard,
        jobs: editJobCard.jobs.map((job) => ({
          ...job,
          charge: job.charge || 0,
          startTime: job.startTime ? new Date(job.startTime) : undefined,
          expectedEndTime: job.expectedEndTime
            ? new Date(job.expectedEndTime)
            : undefined,
          endTime: job.endTime ? new Date(job.endTime) : undefined,
          employeeId: job.employee.id || null,
        })),
      };
    } else {
      return {
        numPlate: appointment?.numPlate || "",
        completed: "",
        customerName: appointment?.customerName || "",
        customerTelephone: appointment?.customerTelephone || "",
        branchId: 1,
        jobs: [
          {
            title: "",
            charge: 0,
            startTime: undefined,
            expectedEndTime: undefined,
            endTime: undefined,
            employeeId: null,
          },
        ],
      };
    }
  });

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

  const handleChange = (field, value) => {
    setJobCard({ ...jobCard, [field]: value });
  };

  const handleJobChange = (index, field, value) => {
    const updatedJobs = [...jobCard.jobs];
    if (field === "charge") {
      updatedJobs[index][field] = parseInt(value, 10) || 0;
    } else if (field === "employeeId") {
      updatedJobs[index][field] = value ? parseInt(value, 10) : null;
    } else if (field.endsWith("Time")) {
      updatedJobs[index][field] = new Date(
        formatDateToISODate(getTodayDate(), value)
      );
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
        {
          title: "",
          charge: 0,
          startTime: undefined,
          expectedEndTime: undefined,
          endTime: undefined,
          employeeId: null,
        },
      ],
    });
  };

  const deleteJob = async (index) => {
    const jobToDelete = jobCard.jobs[index];

    // If job has an ID, call the delete API
    if (jobToDelete.id) {
      try {
        const response = await fetch("http://localhost:3000/jobs/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: jobToDelete.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete job from backend.");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
        return;
      }
    }

    // Remove job from frontend state
    const updatedJobs = jobCard.jobs.filter((_, i) => i !== index);
    setJobCard({ ...jobCard, jobs: updatedJobs });
  };

  const submitJobCard = async () => {
    const { jobs, ...formattedJobCard } = { ...jobCard, branchId: 1 };

    try {
      const jobCardRes = await fetch("http://localhost:3000/jobcards/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedJobCard),
      });

      const jobCardData = await jobCardRes.json();

      if (!jobCardRes.ok || !jobCardData?.id) {
        alert("Failed to create/update job card.");
        return;
      }

      const jobCardId = jobCardData.id;

      for (const job of jobs) {
        const jobPayload = {
          ...job,
          jobCardId: jobCardId,
          charge: parseInt(job.charge, 10) || 0,
          employeeId: job.employeeId ? parseInt(job.employeeId, 10) : null,
          startTime: job.startTime ? job.startTime.toISOString() : undefined,
          expectedEndTime: job.expectedEndTime
            ? job.expectedEndTime.toISOString()
            : undefined,
          endTime: job.endTime ? job.endTime.toISOString() : undefined,
        };

        const jobRes = await fetch("http://localhost:3000/jobs/upsert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobPayload),
        });

        if (!jobRes.ok) {
          throw new Error("Failed to upsert job.");
        }
      }

      alert("Job card and jobs submitted successfully!");
      navigate("/jobcard");
    } catch (error) {
      console.error("Error submitting job card:", error);
      alert("Error submitting job card and jobs. Please try again.");
    }
  };

  return (
    <div className="job-card1">
      <div className="secnew-jobcard">
        <div className="form-group">
          <label>Number Plate:</label>
          <input
            type="text"
            value={jobCard.numPlate}
            onChange={(e) =>
              handleChange("numPlate", e.target.value.toUpperCase())
            }
          />
        </div>
        <div className="form-group">
          <label>Customer Name:</label>
          <input
            type="text"
            value={jobCard.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            value={jobCard.customerTelephone}
            onChange={(e) => handleChange("customerTelephone", e.target.value)}
          />
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
                  <input
                    type="text"
                    value={job.title || ""}
                    onChange={(e) =>
                      handleJobChange(index, "title", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={job.charge || ""}
                    onChange={(e) =>
                      handleJobChange(index, "charge", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={job.startTime ? formatDateToTime(job.startTime) : ""}
                    onChange={(e) =>
                      handleJobChange(index, "startTime", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={
                      job.expectedEndTime
                        ? formatDateToTime(job.expectedEndTime)
                        : ""
                    }
                    onChange={(e) =>
                      handleJobChange(index, "expectedEndTime", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={job.endTime ? formatDateToTime(job.endTime) : ""}
                    onChange={(e) =>
                      handleJobChange(index, "endTime", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={job.employeeId || ""}
                    onChange={(e) =>
                      handleJobChange(index, "employeeId", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select employee
                    </option>
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
          <button
            className="add-job-cancalbtn"
            onClick={() => navigate("/jobcard")}
          >
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

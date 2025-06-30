import "./JobCard.css";
import { useNavigate } from "react-router-dom";
import {useState,useEffect} from "react";

function JobCard() {
  const Navigate=useNavigate();
  const [jobCards, setJobCards] = useState([]);
  const [selectedJobCard, setSelectedJobCard] = useState([]);

  const formatDate = (datetime) => {
    if (!datetime) return { date: "", time: "" };
    const dateObj = new Date(datetime);
    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

   
  useEffect(() =>{
    const token=localStorage.getItem("access_token");

    fetch("http://localhost:3000/jobCards/search",{
      method: "GET",
      headers :{
        "Content-Type" : "application/json",
        Authorization : `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) =>{
      if(Array.isArray(data)){
        setJobCards(data);
      }else{
        console.error("Unexpected response format:", data);
        setJobCards([]);
      }
    })
    .catch((error) => console.error("error fetching jobcards!",error));
  },[]);

  return (
   
      <div className="jobcard-content">
        {/* Left Section - Job List */}
        <div className="jobcard-left">
          <div className="filter-container">
            <input type="text" placeholder="Search by Number Plate..." />
            <button className="btn-primary">Search</button>
          </div>
          <table className="job-table">
            <thead>
              <tr>
              <th>#</th>
                <th>Num Plate</th>
                <th>Date</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobCards.map((jobCard,index) =>(
                
                <tr
                  key={index}
                  onClick={() => setSelectedJobCard(jobCard)}
                  className={selectedJobCard === jobCard ? "selected-row" : ""}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedJobCard?.id === jobCard.id
                        ? "#f0f0f0"
                        : "",
                  }}>
                    <td>{index + 1}</td>
                <td>{jobCard.numPlate}</td>
                <td>{formatDate(jobCard.completed).date}</td>
                <td>{jobCard.branch?.name || "N/A"}</td>
                <td><button
                        className={`status-btn ${jobCard.status.toLowerCase()}`}
                        disabled
                      >
                        {jobCard.status}
                      </button></td>
              </tr>

              ))}
              
              
            </tbody>
          </table>
          <button className="btn-secondary" onClick={() => Navigate("/newjobcard")}>Create New Job Card</button>
        </div>

        {/* Right Section - Job Details */}
        <div className="jobcard-right">
          <div className="info-box">
            <p>
              <strong>Number Plate:</strong> {selectedJobCard ? selectedJobCard.numPlate : ""}
            </p>
            <p>
              <strong>Name:</strong> {selectedJobCard ? selectedJobCard.customerName : ""}
            </p>
            <p>
              <strong>Mobile Number:</strong> {selectedJobCard ? selectedJobCard.customerTelephone : ""}
            </p>
            <p>
              <strong>Start Date:</strong> {selectedJobCard ? formatDate(selectedJobCard.created).date: ""}
            </p>
            <p>
              <strong>End Date:</strong> {selectedJobCard ? formatDate(selectedJobCard.completed).date: ""}
            </p>
            <p>
              <strong>Branch:</strong> {selectedJobCard?.branch?.name || ""}
            </p>
          </div>
          <div className="job-details">
            <table className="details-table">
              <thead>
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
                {selectedJobCard?.jobs?.map((job,index) =>{
                  return (
                    <tr key={job.id}>
                      <td>{index + 1}</td>
                      <td>{job.title}</td>
                      <td>{formatDate(job.startTime).time}</td>
                      <td>{formatDate(job.endTime).time}</td>
                      <td>{job.charge}</td>
                      <td>{job.employee.firstName}</td>
                    </tr>
                  )
                })}
                
              </tbody>
            </table>
          </div>
          <button className="btn-secondary">Create a Bill</button>
        </div>
      </div>
    
  );
}

export default JobCard;

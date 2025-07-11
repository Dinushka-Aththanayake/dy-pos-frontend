import { useState, useEffect } from "react";
import "./Employee.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Employee = () => {
  const [records, setRecords] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [employee, setEmployee] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API_BASE_URL}/employees/findAll`, {
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

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/attendances/search`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error("Failed to fetch attendance records");
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleInOutBar = async (empId) => {
    try {
      const token = localStorage.getItem("access_token");
      let type = "IN"; // Default to IN

      const statusResponse = await fetch(
        `${API_BASE_URL}/attendances/status?employeeId=${empId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (statusResponse.status === 200) {
        const statusData = await statusResponse.json();
        if (statusData?.type === "IN") {
          type = "OUT";
        } else if (statusData?.type === "OUT") {
          type = "IN";
        }
      }

      const recordResponse = await fetch(
        `${API_BASE_URL}/attendances/record`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId: empId, type }),
        }
      );

      if (recordResponse.ok) {
        setMessage(`Attendance marked as ${type}`);

        // Hide after 1 second
        setTimeout(() => {
          setMessage("");
        }, 1000);

        fetchRecords();
        setEmployeeId(""); // Clear barcode input
        setCurrentName(""); // Clear username input
        setPassword(""); // Clear password input
      } else {
        alert("Failed to record attendance.");
      }
    } catch (error) {
      console.error("Error during attendance marking:", error);
      alert("An error occurred while marking attendance.");
    }
  };

  const handleInOutAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: currentName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const empId = data.employee.id;
        setEmployeeId(empId);
        handleInOutBar(empId);
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const filteredRecords = filterName
    ? records.filter((record) =>
        record.name.toLowerCase().includes(filterName.toLowerCase())
      )
    : records;

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const queryParams = new URLSearchParams();

      if (selectedEmployee) queryParams.append("employeeId", selectedEmployee);
      if (selectedType) queryParams.append("type", selectedType);
      if (startDate) queryParams.append("recordedAfter", startDate);
      if (endDate) queryParams.append("recordedBefore", endDate);

      const url = `${API_BASE_URL}/attendances/search?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error("Failed to fetch filtered records");
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div>
      <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
          Attendances
        </h2>
      <div className="employee-layout">
        <div className="table-section">
          <div className="emfilter-section">
            <input
              type="date"
              className="filter-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="filter-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <select
              className="filter-input"
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
            <select
              className="filter-input"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>

            <button className="search-btn1" onClick={handleSearch}>
              Search
            </button>
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
              className="employee-table"
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
                <tr
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>In/Out</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.employee.firstName}</td>
                    <td>{new Date(record.recorded).toLocaleDateString()}</td>
                    <td>
                      {new Date(record.recorded).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td>{record.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-section">
          <input
            type="number"
            placeholder="Barcode"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="inout-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInOutBar(employeeId);
              }
            }}
          />
          <button
            onClick={() => handleInOutBar(employeeId)}
            className="search-btn"
            style={{ marginBottom: "20px" }}
          >
            In/Out
          </button>
          {message && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#dff0d8",
                color: "#3c763d",
                border: "1px solid #d6e9c6",
                borderRadius: "5px",
                marginTop: "10px",
                transition: "opacity 0.5s ease-in-out",
              }}
            >
              {message}
            </div>
          )}
          <input
            type="text"
            placeholder="Username"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            className="inout-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="inout-input"
          />
          <button onClick={handleInOutAuth} className="search-btn">
            In/Out
          </button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Employee;

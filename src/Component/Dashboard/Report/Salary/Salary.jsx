import React, { useEffect, useState } from "react";
import "./Salary.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Salary() {
  const Navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [employee, setEmployee] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch employee list
  useEffect(() => {
    fetch(`${API_BASE_URL}/employees/findAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEmployee(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching employees!", err));
  }, []);

  // Fetch all salary records on load
  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = (
    employeeId = "",
    createdAfter = "",
    createdBefore = ""
  ) => {
    const url = new URL(`${API_BASE_URL}/salaries/search`);
    if (employeeId) url.searchParams.append("employeeId", employeeId);
    if (createdAfter) url.searchParams.append("createdAfter", createdAfter);
    if (createdBefore) url.searchParams.append("createdBefore", createdBefore);

    fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSalaryRecords(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching salaries!", err));
  };

  const handleSearch = () => {
    fetchSalaries(selectedEmployee, fromDate, toDate);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
          Salary History
        </h2>
        <button
          className="salary-create-btn"
          onClick={() => Navigate("calculator")}
        >
          Create Salary
        </button>
      </div>
      <div className="salary-main-container">
        <div className="salary-records-container">
          <div className="salary-search-section">
            <select
              className="salary-search-byname"
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
              type="date"
              className="from-date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="to-date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

            <button className="salary-search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>

          <div
            className="salary-table"
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
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    Employee Name
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    OT Hours
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    OT Rate
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    Bonus/Incentives
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    Allowances
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    Additions
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    Deductions
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    Basic Salary
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                    }}
                  >
                    Final Salary
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaryRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "12px" }}
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  salaryRecords.map((record) => (
                    <tr key={record.id} style={{ backgroundColor: "#e6f2ff" }}>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.created?.split("T")[0]}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.employee?.firstName || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.otHours}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.otPayPerHour}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.bonus}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.allowance}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.additional}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.deduction}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                        }}
                      >
                        {record.basic}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontWeight: "bold",
                        }}
                      >
                        {(() => {
                          const otHours = parseFloat(record.otHours) || 0;
                          const otRate = parseFloat(record.otPayPerHour) || 0;
                          const bonus = parseFloat(record.bonus) || 0;
                          const allowance = parseFloat(record.allowance) || 0;
                          const additional = parseFloat(record.additional) || 0;
                          const deduction = parseFloat(record.deduction) || 0;
                          const basic = parseFloat(record.basic) || 0;

                          const final =
                            basic +
                            otHours * otRate +
                            bonus +
                            allowance +
                            additional -
                            deduction;

                          return parseFloat(final).toFixed(2);
                        })()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Salary;

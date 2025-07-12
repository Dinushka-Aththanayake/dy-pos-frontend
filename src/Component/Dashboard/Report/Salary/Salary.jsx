import React, { useEffect, useState } from "react";
import "./Salary.css";
import { useNavigate } from "react-router-dom";
import { formatDateToISO, formatDateToLocalString } from "../../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Salary() {
  const Navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [employee, setEmployee] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [salary, setSalary] = useState(null);

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
    if (createdAfter)
      url.searchParams.append(
        "createdAfter",
        formatDateToISO(createdAfter, "00:00")
      );
    if (createdBefore)
      url.searchParams.append(
        "createdBefore",
        formatDateToISO(createdBefore, "23:59")
      );

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#f0f8ff",
          padding: 20,
        }}
      >
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
                      fontSize: "12px",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    Employee Name
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    OT Hours
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    OT Rate
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    Bonus/ Incentives
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    Allowances
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    Additions
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    Deductions
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    Basic Salary
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    Final Salary
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      borderBottom: "2px solid #99ccff",
                      fontSize: "12px",
                    }}
                  >
                    Action
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
                          fontSize: "14px",
                        }}
                      >
                        {formatDateToLocalString(new Date(record.created))}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        {record.employee?.firstName || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        {record.otHours}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        {record.otPayPerHour}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        {record.bonus}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        {record.allowance}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        {record.additional}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        {record.deduction}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        {record.basic}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontWeight: "bold",
                          fontSize: "14px",
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
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #d0e1f9",
                          fontSize: "14px",
                        }}
                      >
                        <button
                          style={{
                            backgroundColor: "#4682b4",
                            color: "white",
                            padding: 10,
                            fontSize: "14px",
                          }}
                          onClick={()=> Navigate("show", { state: { salary: record } })}
                        >
                          Print
                        </button>
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

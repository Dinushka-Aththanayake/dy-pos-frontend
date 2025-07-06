import React from "react";
import "./Salary.css";

import { useNavigate } from "react-router-dom";

function Salary() {

  const Navigate=useNavigate();
  return (
    <div className="salary-main-container">
      <div className="salary-records-container">
        <div className="salary-search-section">
          <div className="salary-search-sub-section">
            <input type="text" className="salary-search-byname" placeholder="Search by en Employee.." />
            <div className="search-bydatetime">
              <input type="date" className="from-date" />
              <input type="date" className="to-date" />
            </div>
          </div>
          <div className="search-btn-section">
            <button className="salary-search-btn">Search</button>
            <button className="salary-create-btn" onClick={() => Navigate("/salarycalculator")}>Create</button>
          </div>
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
            padding:"0",
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
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  Date
                </th>
                <th
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  Employee Name
                </th>
                <th
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  OT Hours
                </th>
                <th
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  OT Rate
                </th>
                <th
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  Bonus/Incentives
                </th>
                <th
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  Allowances
                </th>
                <th
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  Deductions
                </th>
                <th
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  Basic Salary
                </th>
                <th
                  style={{ padding: "12px", borderBottom: "2px solid #99ccff" }}
                >
                  Final Salary
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Example static row; replace with .map() from fetched data */}
              <tr style={{ backgroundColor: "#e6f2ff" }}>
                <td
                  style={{ padding: "10px", borderBottom: "1px solid #d0e1f9" }}
                >
                  2025-07-06
                </td>
                <td
                  style={{ padding: "10px", borderBottom: "1px solid #d0e1f9" }}
                >
                  Dinushka Himesh
                </td>
                <td
                  style={{ padding: "10px", borderBottom: "1px solid #d0e1f9" }}
                >
                  5
                </td>
                <td
                  style={{ padding: "10px", borderBottom: "1px solid #d0e1f9" }}
                >
                  200
                </td>
                <td
                  style={{ padding: "10px", borderBottom: "1px solid #d0e1f9" }}
                >
                  1000
                </td>
                <td
                  style={{ padding: "10px", borderBottom: "1px solid #d0e1f9" }}
                >
                  1500
                </td>
                <td
                  style={{ padding: "10px", borderBottom: "1px solid #d0e1f9" }}
                >
                  500
                </td>
                <td
                  style={{ padding: "10px", borderBottom: "1px solid #d0e1f9" }}
                >
                  30000
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #d0e1f9",
                    fontWeight: "bold",
                  }}
                >
                  33700
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Salary;

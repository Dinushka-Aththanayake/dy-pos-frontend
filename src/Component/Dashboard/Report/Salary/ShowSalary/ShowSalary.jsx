import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ShowSalary() {
  const location = useLocation();
  const { salary } = location.state || {};
  const [printSalary, setPrintSalary] = useState(salary || null);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!printSalary) {
    return <div>No salary data available.</div>;
  }

  const {
    basic,
    allowance,
    bonus,
    additional,
    deduction,
    otHours,
    otPayPerHour,
    created,
    employee,
  } = printSalary;

  const otPay = parseFloat(otHours) * parseFloat(otPayPerHour);
  const netSalary =
    parseFloat(basic) +
    parseFloat(allowance) +
    parseFloat(bonus) +
    parseFloat(additional) +
    otPay -
    parseFloat(deduction);

  const createdDate = new Date(created);
  const month = createdDate.toLocaleString("default", { month: "long" });
  const year = createdDate.getFullYear();

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Ranawaka Car Audio &</h2>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>All Accessories</h2>
      <h2 style={{ textAlign: "center", marginBottom: "40px",fontSize: "18px", fontWeight: "bold" }}>
        Salary Pay Sheet
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <strong>Employee Name:</strong> {employee?.firstName} <br />
        <strong>Month:</strong> {month} <br />
        <strong>Year:</strong> {year}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
        }}
      >
        <tbody>
          <tr>
            <td style={cellStyle}>Basic Salary</td>
            <td style={cellStyleRight}>Rs. {parseFloat(basic).toFixed(2)}</td>
          </tr>
          <tr>
            <td style={cellStyle}>Allowance</td>
            <td style={cellStyleRight}>Rs. {parseFloat(allowance).toFixed(2)}</td>
          </tr>
          <tr>
            <td style={cellStyle}>Bonus</td>
            <td style={cellStyleRight}>Rs. {parseFloat(bonus).toFixed(2)}</td>
          </tr>
          <tr>
            <td style={cellStyle}>Additional</td>
            <td style={cellStyleRight}>Rs. {parseFloat(additional).toFixed(2)}</td>
          </tr>
          <tr>
            <td style={cellStyle}>OT Pay ({otHours} hrs @ Rs.{otPayPerHour})</td>
            <td style={cellStyleRight}>Rs. {otPay.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={cellStyle}>Deduction</td>
            <td style={cellStyleRight}>Rs. {parseFloat(deduction).toFixed(2)}</td>
          </tr>
          <tr style={{ fontWeight: "bold", borderTop: "2px solid #000" }}>
            <td style={cellStyle}>Net Salary</td>
            <td style={cellStyleRight}>Rs. {netSalary.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: "50px" }}>
        ___________________________<br />
        Authorized Signature
      </div>
    </div>
  );
}

const cellStyle = {
  border: "1px solid #000",
  padding: "10px",
  textAlign: "left",
};

const cellStyleRight = {
  ...cellStyle,
  textAlign: "right",
};

export default ShowSalary;

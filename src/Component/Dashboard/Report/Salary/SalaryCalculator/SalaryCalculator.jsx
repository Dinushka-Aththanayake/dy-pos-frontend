import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SalaryCalculator() {
  const Navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [basicSalary, setBasicSalary] = useState(0);

  const [otHours, setOtHours] = useState("");
  const [otRate, setOtRate] = useState("");
  const [bonus, setBonus] = useState("");
  const [allowances, setAllowances] = useState("");
  const [deductions, setDeductions] = useState("");

  const [finalSalary, setFinalSalary] = useState(null);

  // Fetch employees from backend
  useEffect(() => {
    fetch("http://localhost:3067/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch basic salary when employee changes
  useEffect(() => {
    if (selectedEmployeeId) {
      fetch(`http://localhost:3067/employees/${selectedEmployeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((emp) => setBasicSalary(emp.basicSalary || 0))
        .catch((err) => console.error(err));
    } else {
      setBasicSalary(0);
    }
  }, [selectedEmployeeId]);

  const calculateSalary = () => {
    const otPay = parseFloat(otHours || 0) * parseFloat(otRate || 0);
    const bonusAmount = parseFloat(bonus || 0);
    const allowanceAmount = parseFloat(allowances || 0);
    const deductionAmount = parseFloat(deductions || 0);

    const total =
      parseFloat(basicSalary) +
      otPay +
      bonusAmount +
      allowanceAmount -
      deductionAmount;

    setFinalSalary(total.toFixed(2));
  };

  return (
    <div className="salarycal-main-container" style={{ padding: "25px",display:"flex", alignItems:"center" }}>
      <div
        style={{
          padding: "20px",
          maxWidth: "500px",
          margin: "auto",
          backgroundColor: "rgb(218, 234, 244)",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <label>Employee:</label>
        <select
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            borderStyle: "solid",
            borderColor: "rgb(28, 103, 150)",
          }}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        <label>Basic Salary:</label>
        <input
          type="number"
          value={basicSalary}
          readOnly
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            backgroundColor: "#eaeaea",
            borderRadius: "5px",
            borderStyle: "solid",
            borderColor: "rgb(28, 103, 150)",
          }}
        />

        <label>OT Hours:</label>
        <input
          type="number"
          value={otHours}
          onChange={(e) => setOtHours(e.target.value)}
          placeholder="Enter OT Hours"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            borderStyle: "solid",
            borderColor: "rgb(28, 103, 150)",
          }}
        />

        <label>OT Rate (per hour):</label>
        <input
          type="number"
          value={otRate}
          onChange={(e) => setOtRate(e.target.value)}
          placeholder="Enter OT Rate"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            borderStyle: "solid",
            borderColor: "rgb(28, 103, 150)",
          }}
        />

        <label>Bonus / Incentives:</label>
        <input
          type="number"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          placeholder="Enter Bonus"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            borderStyle: "solid",
            borderColor: "rgb(28, 103, 150)",
          }}
        />

        <label>Allowances:</label>
        <input
          type="number"
          value={allowances}
          onChange={(e) => setAllowances(e.target.value)}
          placeholder="Enter Allowances"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            borderStyle: "solid",
            borderColor: "rgb(28, 103, 150)",
          }}
        />

        <label>Deductions:</label>
        <input
          type="number"
          value={deductions}
          onChange={(e) => setDeductions(e.target.value)}
          placeholder="Enter Deductions"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "20px",
            borderRadius: "5px",
            borderStyle: "solid",
            borderColor: "rgb(28, 103, 150)",
          }}
        />
        <div className="btn-salary-calculator" style={{display:"flex", justifyContent:"space-between"}}>
          <button
            onClick={calculateSalary}
            style={{
              padding: "10px 10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              width:"100px",
              fontSize:"12px"
            }}
          >
            Calculate 
          </button>
          <button
            onClick={() => Navigate("/reports/salary")}
            style={{
              padding: "10px 20px",
              backgroundColor: "rgb(189, 75, 75)",
              color: "#fff",
              border: "none",
              width:"100px",
              borderRadius: "6px",
            }}
          >
            Cancel
          </button>

          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "rgb(24, 81, 48)",
              color: "#fff",
              border: "none",
              width:"100px",
              borderRadius: "6px",
            }}
          >
            Save
          </button>
        </div>

        {finalSalary !== null && (
          <div style={{ marginTop: "20px", fontSize: "18px" }}>
            <strong>Final Salary: Rs. {finalSalary}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalaryCalculator;

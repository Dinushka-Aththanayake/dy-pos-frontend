import { div } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateToISO } from "../../../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility for showing dialogs
const showDialog = async (options) => {
  if (window.electronAPI && window.electronAPI.showMessageBox) {
    await window.electronAPI.showMessageBox(options);
  } else {
    window.alert(options.message || options.title || '');
  }
};

function SalaryCalculator() {
  const Navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [employee, setEmployee] = useState([]);
  const [basicSalary, setBasicSalary] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [otHours, setOtHours] = useState("");
  const [otRate, setOtRate] = useState("");
  const [bonus, setBonus] = useState("");
  const [allowances, setAllowances] = useState("");
  const [deductions, setDeductions] = useState("");
  const [addition, setAddition] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [finalSalary, setFinalSalary] = useState(null);

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
      .catch((error) => {
        console.error("Error fetching employees!", error);
        showDialog({
          type: 'error',
          title: 'Error',
          message: 'Error fetching employees. Please try again later.' 
        });
      });
  }, []);

  // Fetch basic salary of selected employee
  useEffect(() => {
    if (selectedEmployee) {
      fetch(`${API_BASE_URL}/employees/search?id=${selectedEmployee}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((emp) => setBasicSalary(emp[0]?.basic_salary || 0))
        .catch((err) => console.error(err));
    } else {
      setBasicSalary(0);
    }
  }, [selectedEmployee]);

  // OT Hours Calculation Logic
  const handleCalculateOTHours = async () => {
    if (!selectedEmployee || !fromDate || !toDate) {
      showDialog({
        type: 'error',
        title: 'Error',
        message: 'Please select employee, from date and to date!'
      });
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/attendances/search?employeeId=${selectedEmployee}&recordedAfter=${formatDateToISO(fromDate, "00:00")}&recordedBefore=${formatDateToISO(toDate, "23:59")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const records = await res.json();

      // Sort records by time
      // records.sort((a, b) => new Date(a.time) - new Date(b.time));

      let totalOTMinutes = 0;

      for (let i = 0; i < records.length; i++) {
        const record = records[i];

        if (record.type === "OUT") {
          // Find previous IN record
          const inRecord = records
            .slice(0, i)
            .reverse()
            .find((r) => r.type === "IN");

          if (!inRecord) continue;

          const inTime = new Date(inRecord.recorded);
          const outTime = new Date(record.recorded);
          console.log(inTime, outTime);

          const noon = new Date(inTime);
          noon.setHours(12, 1, 0, 0);

          const baseTime = new Date(outTime);
          baseTime.setHours(19, 0, 0, 0); // 7:00 PM

          // IN must be before 12:01 PM and OUT must be after 7:00 PM
          if (inTime < noon && outTime > baseTime) {
            let otMinutes = (outTime - baseTime) / (1000 * 60);
            if (otMinutes > 0) totalOTMinutes += otMinutes;
          }
        }
      }

      const totalOTHours = (totalOTMinutes / 60).toFixed(2);
      setOtHours(totalOTHours);
    } catch (err) {
      console.error("Error calculating OT Hours", err);
      showDialog({
        type: 'error',
        title: 'Error',
        message: 'Failed to calculate OT Hours. Please try again.'
      });
    }
  };

  const calculateSalary = () => {
    const otPay = parseFloat(otHours || 0) * parseFloat(otRate || 0);
    const bonusAmount = parseFloat(bonus || 0);
    const allowanceAmount = parseFloat(allowances || 0);
    const deductionAmount = parseFloat(deductions || 0);
    const additionAmount = parseFloat(addition || 0);

    const total =
      parseFloat(basicSalary) +
      otPay +
      additionAmount +
      bonusAmount +
      allowanceAmount -
      deductionAmount;

    setFinalSalary(total.toFixed(2));
  };

  const handleSave = async () => {
    if (!selectedEmployee) {
      showDialog({
        type: 'error',
        title: 'Error',
        message: 'Please select an employee to save the salary.'
      });
      return;
    }

    try {
      const payload = {
        employeeId: parseInt(selectedEmployee),
        basic: parseFloat(basicSalary || 0),
        otHours: parseFloat(otHours || 0),
        otPayPerHour: parseFloat(otRate || 0),
        bonus: parseFloat(bonus || 0),
        allowance: parseFloat(allowances || 0),
        additional: parseFloat(addition || 0),
        deduction: parseFloat(deductions || 0),
      };

      const res = await fetch(`${API_BASE_URL}/salaries/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showDialog({
          title: 'Success',
          message: 'Salary saved successfully.',
        });
        Navigate("/reports/salary");
      } else {
        const errorData = await res.json();
        showDialog({
          type: 'error',
          title: 'Error',
          message: 'Failed to save salary: ' + (errorData.message || "Unknown error.")
        });
      }
    } catch (err) {
      console.error("Error saving salary:", err);
      showDialog({
        type: 'error',
        title: 'Error',
        message: 'Error occurred while saving salary. Please try again.'
      });
    }
  };

  return (
    <div>
      <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
        Salary Calculator
      </h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <div
          className="salarycal-main-container"
          style={{
            padding: "25px",
            display: "flex",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              padding: "30px",

              backgroundColor: "rgb(218, 234, 244)",
              borderRadius: "12px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <label>Employee:</label>
            <select
              className="filter-input"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "5px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#80cfff",
              }}
            >
              <option value="" disabled>
                Select Employee
              </option>
              {employee.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName}
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
                borderRadius: "5px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#80cfff",
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
                borderWidth: "1px",
                borderColor: "#80cfff",
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
                borderWidth: "1px",
                borderColor: "#80cfff",
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
                borderWidth: "1px",
                borderColor: "#80cfff",
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
                borderWidth: "1px",
                borderColor: "#80cfff",
              }}
            />

            <label>Addition:</label>
            <input
              type="number"
              value={addition}
              onChange={(e) => setAddition(e.target.value)}
              placeholder="Enter Allowances"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "5px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#80cfff",
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
                borderWidth: "1px",
                borderColor: "#80cfff",
              }}
            />
            <div
              className="btn-salary-calculator"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <button
                onClick={calculateSalary}
                style={{
                  padding: "10px 10px",
                  backgroundColor: "#1964a2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  flex: "1",
                  fontSize: "12px",
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
                  flex: "1",
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
                  flex: "1",
                  borderRadius: "6px",
                }}
                onClick={handleSave}
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
        <div
          className="othours-calculator"
          style={{
            flex: 1,
            padding: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgb(218, 234, 244)",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <label htmlFor="">From:</label>
            <input
              type="date"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                backgroundColor: "#eaeaea",
                borderRadius: "5px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#80cfff",
              }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label htmlFor="">To:</label>
            <input
              type="date"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                backgroundColor: "#eaeaea",
                borderRadius: "5px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#80cfff",
              }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button
              style={{
                padding: "10px 10px",
                backgroundColor: "#1964a2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                marginTop: "15px",
                marginBottom: "20px",
              }}
              onClick={handleCalculateOTHours}
            >
              Calculate OT Hours
            </button>
            <label htmlFor="">OT Hours:</label>
            <p>{otHours} hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryCalculator;

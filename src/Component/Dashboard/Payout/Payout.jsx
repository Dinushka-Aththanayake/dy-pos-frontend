import React, { useState, useEffect } from "react";
import "./Payout.css";
import { formatDateToISO } from "../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Payout() {
  const token = localStorage.getItem("access_token");

  const [employee, setEmployee] = useState([]);
  const [fetchedPayouts, setfetchedPayouts] = useState([]);
  const [payout, setPayout] = useState({
    description: "",
    collectedEmployeeId: "",
    amount: "",
  });
  const [beforeDate, setBeforeDate] = useState("");
  const [afterDate, setAfterDate] = useState("");

  useEffect(() => {
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

  const fetchPayouts = () => {
    fetch(`${API_BASE_URL}/payouts/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setfetchedPayouts(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching payouts!", error));
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleCreatePayout = () => {
    if (!payout.collectedEmployeeId || !payout.amount || !payout.description) {
      alert("Please fill all required fields");
      return;
    }

    fetch(`${API_BASE_URL}/payouts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payout),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create payout");
        }
      })
      .then(() => {
        alert("Payout created successfully!");
        setPayout({description: "", collectedEmployeeId: "", amount: "" ,});
        fetchPayouts();
      })
      .catch((error) => {
        console.error("Error creating payout:", error);
        alert("Error creating payout!");
      });
  };

  return (
    <div style={{backgroundColor:"#eff5fd",padding:"20px"}} >
      <h2 style={{color:"rgb(0, 51, 102)",marginBottom:"10px"}}>Payouts</h2>
      <div className="employee-layout">
        <div className="table-section">
          <div className="emfilter-section">
            <input
              type="date"
              value={afterDate}
              onChange={(e) => setAfterDate(e.target.value)}
              className="filter-input"
            />
            <input
              type="date"
              value={beforeDate}
              onChange={(e) => setBeforeDate(e.target.value)}
              className="filter-input"
            />
            <button
              className="search-btn1"
              onClick={() => {
                const url = new URL(`${API_BASE_URL}/payouts/search`);
                if (beforeDate)
                  url.searchParams.append("beforeDate", formatDateToISO(beforeDate, "23:59"));
                if (afterDate) url.searchParams.append("afterDate", formatDateToISO(afterDate, "00:00"));

                fetch(url.toString(), {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((res) => res.json())
                  .then((data) =>
                    setfetchedPayouts(Array.isArray(data) ? data : [])
                  )
                  .catch((err) => {
                    console.error("Error filtering payouts!", err);
                    alert("Failed to fetch filtered payouts");
                  });
              }}
            >
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
              className="employee-table1"
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
                <tr style={{ backgroundColor: "#e6f2ff" }}>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Collected Emp</th>
                  <th>Logged Emp</th>
                </tr>
              </thead>
              <tbody>
                {fetchedPayouts.map((payout, index) => (
                  <tr key={index}>
                    <td>{new Date(payout.date).toLocaleString()}</td>
                    <td>{payout.amount}</td>
                    <td>{payout.description}</td>
                    <td>{payout.collectedEmployee?.firstName || "-"}</td>
                    <td>{payout.loggedInEmployee?.firstName || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-section">
          <input
            type="text"
            placeholder="Description"
            className="inout-input"
            value={payout.description}
            onChange={(e) =>
              setPayout({ ...payout, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Amount"
            className="inout-input"
            value={payout.amount}
            onChange={(e) =>
              setPayout({ ...payout, amount: parseFloat(e.target.value) })
            }
            min="0"
          />
          <select
            className="inout-input"
            value={payout.collectedEmployeeId}
            onChange={(e) =>
              setPayout({ ...payout, collectedEmployeeId: e.target.value })
            }
            style={{ paddingRight: "5px" }}
          >
            <option value="" disabled>
              Select an Employee
            </option>
            {employee.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName}
              </option>
            ))}
          </select>
          <button onClick={handleCreatePayout} className="search-btn">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payout;

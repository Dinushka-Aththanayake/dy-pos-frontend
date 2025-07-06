import React, { useState, useEffect } from "react";

function Payout() {
  const token = localStorage.getItem("access_token");

  const [employee, setEmployee] = useState([]);
  const [fetchedPayouts, setfetchedPayouts] = useState([]);
  const [payout, setPayout] = useState({
    collectedEmployeeId: "",
    amount: "",
  });
  const [filterName, setFilterName] = useState("");

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

  const fetchPayouts = () => {
    fetch("http://localhost:3000/payouts/search", {
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
    if (!payout.collectedEmployeeId || !payout.amount) {
      alert("Please fill all required fields");
      return;
    }

    fetch("http://localhost:3000/payouts/create", {
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
        setPayout({ collectedEmployeeId: "", amount: "" });
        fetchPayouts();
      })
      .catch((error) => {
        console.error("Error creating payout:", error);
        alert("Error creating payout!");
      });
  };

  return (
    <div className="employee-layout">
      <div className="table-section">
        <div className="emfilter-section">
          <input
            type="date"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="filter-input"
          />
          <input
            type="date"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="filter-input"
          />
          <button className="search-btn1">Search</button>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Collected Employee</th>
              <th>Logged Employee</th>
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

      <div className="form-section">
        <input
          type="text"
          placeholder="Description (optional)"
          className="inout-input"
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
  );
}

export default Payout;

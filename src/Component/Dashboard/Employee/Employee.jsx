import { useState } from "react";
import "./Employee.css";

const Employee = () => {
  const [records, setRecords] = useState([
    { name: "Kamal", date: "20/01/2025", time: "4:00 pm", status: "Out" },
    { name: "Ravi", date: "20/01/2025", time: "4:00 pm", status: "Out" },
    { name: "Kamal", date: "20/01/2025", time: "8:30 am", status: "In" },
    { name: "Ravi", date: "20/01/2025", time: "8:00 am", status: "In" },
    { name: "Ahmed", date: "19/01/2025", time: "3:00 pm", status: "Out" },
    { name: "Sara", date: "19/01/2025", time: "9:00 am", status: "In" },
    { name: "John", date: "18/01/2025", time: "5:00 pm", status: "Out" },
    { name: "Emily", date: "18/01/2025", time: "8:00 am", status: "In" },
  ]);

  const [filterName, setFilterName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [password, setPassword] = useState("");

  const handleInOut = () => {
    if (!currentName || !password) {
      alert("Please enter your name and password.");
      return;
    }

    const latestRecord = records.find((record) => record.name === currentName);
    const newStatus =
      latestRecord && latestRecord.status === "In" ? "Out" : "In";

    const newRecord = {
      name: currentName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: newStatus,
    };

    setRecords([newRecord, ...records]); // Add new record to the top of the list
    setCurrentName("");
    setPassword("");
  };

  const filteredRecords = filterName
    ? records.filter((record) =>
        record.name.toLowerCase().includes(filterName.toLowerCase())
      )
    : records;

  return (
    <div className="employee-layout">
      <div className="table-section">
        <div className="emfilter-section">
          <input
            type="text"
            placeholder="Filter by name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="filter-input"
          />
          <button className="search-btn1">Search</button>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>In/Out</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.name}</td>
                <td>{record.date}</td>
                <td>{record.time}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-section">
        <input
          type="text"
          placeholder="Name"
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
        <button onClick={handleInOut} className="search-btn">
          In/Out
        </button>
      </div>
    </div>
  );
};

export default Employee;

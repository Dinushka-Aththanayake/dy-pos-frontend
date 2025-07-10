import React, { useEffect, useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";

function Account() {
  const navigation = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch("http://localhost:3000/employees/findAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching employees!", error));
  }, []);

  useEffect(() => {
    if (!selectedEmployeeId) return;

    fetch(`http://localhost:3000/employees/search?id=${selectedEmployeeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedEmployee(data[0]);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error fetching employee data!", err);
        setSelectedEmployee(null);
      });
  }, [selectedEmployeeId]);

  const handleSave = () => {
    if (!selectedEmployee) return;

    const { password, ...employeeData } = selectedEmployee;

    fetch("http://localhost:3000/employees/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    })
      .then((res) => {
        if (res.ok) {
          alert("Employee details updated successfully.");
          setIsEditing(false);
        } else {
          alert("Failed to update employee.");
        }
      })
      .catch((err) => {
        console.error("Error saving employee!", err);
      });
  };

  const handleChangePassword = () => {
    if (!selectedEmployee?.id) return;

    const newPassword = prompt("Enter new password:");
    if (!newPassword || newPassword.trim() === "") {
      alert("Password cannot be empty.");
      return;
    }

    fetch("http://localhost:3000/employees/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: selectedEmployee.id,
        newPassword,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Password changed successfully.");
        } else {
          alert("Failed to change password.");
        }
      })
      .catch((err) => {
        console.error("Error changing password!", err);
      });
  };

  const handleChange = (field, value) => {
    setSelectedEmployee({ ...selectedEmployee, [field]: value });
  };

  return (
    <div className="container">
      <h2 className="title1">User Details</h2>
      <div className="search-container">
        <select
          className="search-input"
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
        >
          <option value="" disabled>
            Select employee
          </option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName}
            </option>
          ))}
        </select>
      </div>

      
        <div className="form">
          <label className="label">Username:</label>
          <input
            type="text"
            className="input1"
            value={selectedEmployee?.username || ""}
            onChange={(e) => handleChange("username", e.target.value)}
            readOnly={!isEditing}
          />

          <label className="label">First Name:</label>
          <input
            type="text"
            className="input1"
            value={selectedEmployee?.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            readOnly={!isEditing}
          />

          <label className="label">Last Name:</label>
          <input
            type="text"
            className="input1"
            value={selectedEmployee?.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            readOnly={!isEditing}
          />

          <label className="label">Address:</label>
          <input
            type="text"
            className="input1"
            value={selectedEmployee?.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            readOnly={!isEditing}
          />

          <label className="label">Mobile Number:</label>
          <input
            type="text"
            className="input1"
            value={selectedEmployee?.telephone || ""}
            onChange={(e) => handleChange("telephone", e.target.value)}
            readOnly={!isEditing}
          />

          <label className="label">Password:</label>
          <input
            type="password"
            className="input1"
            value="*********"
            readOnly
          />

          <label className="label">Basic Salary:</label>
          <input
            type="number"
            className="input1"
            value={selectedEmployee?.basic_salary || ""}
            onChange={(e) => handleChange("basic_salary", e.target.value)}
            readOnly={!isEditing}
          />
          
          <label className="label">Role:</label>
          <input
            type="text"
            className="input1"
            value={selectedEmployee?.role || "ss"}
            readOnly
          />

          <div
            className="account-btn-group"
            style={{ display: "flex", justifyContent: "right" }}
          >
            {!isEditing ? (
              <button
                className="edit-button"
                style={{ marginLeft: "10px" }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className="edit-button"
                style={{ marginLeft: "10px" }}
                onClick={handleSave}
              >
                Save
              </button>
            )}
            <button
              className="edit-button"
              style={{ marginLeft: "10px" }}
              onClick={handleChangePassword}
            >
              Change Password
            </button>
            <button className="edit-button" style={{ marginLeft: "10px" }}
            onClick={()=> navigation("new")}>
              Register Users
            </button>
          </div>
        </div>
      
    </div>
  );
}

export default Account;

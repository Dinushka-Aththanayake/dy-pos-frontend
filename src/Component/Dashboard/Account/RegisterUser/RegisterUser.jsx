import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function RegisterUser() {
  const token = localStorage.getItem("access_token");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    telephone: "",
    basic_salary: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    const {
      username,
      password,
      firstName,
      lastName,
      address,
      telephone,
      basic_salary,
    } = formData;

    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !address ||
      !telephone ||
      !basic_salary
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      username,
      password,
      firstName,
      lastName,
      address,
      telephone,
      basic_salary: parseFloat(basic_salary),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/employees/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User registered successfully!");
      handleCancel();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to register user. Check the inputs or try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      telephone: "",
      basic_salary: "",
    });
  };

  return (
    <div className="container">
      <h2 className="title1">Register User</h2>

      <div className="form">
        <label className="label">Username:</label>
        <input
          type="text"
          name="username"
          className="input1"
          value={formData.username}
          onChange={handleInputChange}
        />

        <label className="label">First Name:</label>
        <input
          type="text"
          name="firstName"
          className="input1"
          value={formData.firstName}
          onChange={handleInputChange}
        />

        <label className="label">Last Name:</label>
        <input
          type="text"
          name="lastName"
          className="input1"
          value={formData.lastName}
          onChange={handleInputChange}
        />

        <label className="label">Address:</label>
        <input
          type="text"
          name="address"
          className="input1"
          value={formData.address}
          onChange={handleInputChange}
        />

        <label className="label">Mobile Number:</label>
        <input
          type="text"
          name="telephone"
          className="input1"
          value={formData.telephone}
          onChange={handleInputChange}
        />

        <label className="label">Password:</label>
        <input
          type="password"
          name="password"
          className="input1"
          value={formData.password}
          onChange={handleInputChange}
        />

        <label className="label">Basic Salary:</label>
        <input
          type="number"
          name="basic_salary"
          className="input1"
          value={formData.basic_salary}
          onChange={handleInputChange}
        />

        <div
          className="account-btn-group"
          style={{ display: "flex", justifyContent: "right" }}
        >
          <button
            className="cancel-button"
            style={{
              backgroundColor: "red",
              color: "white",
              marginRight: "10px",
              padding: "8px 15px"
            }}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="edit-button"
            style={{ backgroundColor: "green", color: "white",padding: "8px 15px",marginTop:"0" }}
            onClick={handleCreate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;

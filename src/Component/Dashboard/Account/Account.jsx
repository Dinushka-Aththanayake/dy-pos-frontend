import React from "react";
import "./Account.css";

function Account() {
  return (
    <div className="container">
      <h2 className="title1">User Details</h2>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Name"
        />
        <button className="search-button">Search</button>
      </div>
      <div className="form">
        <label className="label">Username:</label>
        <input type="text" className="input1" />
        <label className="label">Name:</label>
        <input type="text" className="input1" />
        <label className="label">Address:</label>
        <input type="text" className="input1" />
        <label className="label">Mobile Number:</label>
        <input type="text" className="input1" />
        <label className="label">Home Mobile:</label>
        <input type="text" className="input1" />
        <label className="label">Password:</label>
        <input type="password" className="input1" />
        <label className="label">Basic Salary:</label>
        <input type="number" className="input1" />
        <div className="account-btn-group" style={{display:"flex", justifyContent:"right"}}>
          <button className="edit-button" style={{marginLeft:"10px"}}>Edit</button>
          <button className="edit-button" style={{marginLeft:"10px"}}>Save</button>
          <button className="edit-button"style={{marginLeft:"10px"}}>Register Users</button>
        </div>
      </div>
    </div>
  );
}

export default Account;

import React from 'react'
import './Signin.css'

function Signin() {
  return (
    <div className="login-container">
      <div className="login-boxss">
        <h2>SignIn</h2>
        <form className="form">
        
        <label className="label">Username:</label>
        <input type="text" className="input" />
        <label className="label">Full Name:</label>
        <input type="text" className="input" />
        <label className="label">Address:</label>
        <input type="text" className="input" />
        <label className="label">Mobile Number:</label>
        <input type="text" className="input" />
        <label className="label">Home Mobile:</label>
        <input type="text" className="input" />
        <label className="label">Password:</label>
        <input type="password" className="input" />
        <label className="label">Role:</label>
        <select className='role-dropdown'>
            <option value="Employee" >Employee</option>
            <option value="Owner">Owner</option>
        </select>
          <button type="submit" className="login-button">Sign In</button>
        </form>
        
      </div>
    </div>
  )
}

export default Signin;
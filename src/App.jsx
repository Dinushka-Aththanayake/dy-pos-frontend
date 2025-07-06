import { useState } from "react";
import "./App.css";
import DashboardLayoutBasic from "./Component/Dashboard/Dashboard";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NewJobcards from "./Component/Dashboard/JobCard/NewJobcard/NewJobcards";
import NewAppoinment from "./Component/Dashboard/Appoinment/NewAppoinment/NewAppoinment";
import Intro from "./Component/Intro/Intro";
import Login from "./Component/Login/Login";
import Signin from "./Component/Signin/Signin";
import Dashboardlayout from "./Component/Dashboardlayout/Dashboardlayout";
import SalaryCalculator from "./Component/Dashboard/Report/Salary/SalaryCalculator/SalaryCalculator";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/dashboard" element={<Dashboardlayout />} />
        <Route path="/newjobcard" element={<NewJobcards/>} />
        <Route path="/newappoinment" element={<NewAppoinment/>} />
        <Route path="/salarycalculator" element={<SalaryCalculator/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;

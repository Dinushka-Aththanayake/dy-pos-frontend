import React from "react";
import DashboardLayoutBasic from "../Dashboard/Dashboard";
import Footer from "../Dashboard/Footer/Footer";

function Dashboardlayout() {
  return (
    <div >
      <div
        className="footer"
        style={{ zIndex: 100 }}
      >
        <Footer />
      </div>
      <div className="layout" >
        <DashboardLayoutBasic />
      </div>
      
    </div>
  );
}

export default Dashboardlayout;

import React from "react";
import { useLocation } from "react-router-dom";
import BillView from "./BillView";

function ShowBills() {
  const location = useLocation();
  // bill and autoPrint (optional) are passed via location.state
  const { bill = {}, autoPrint = false } = location.state || {};
  return <BillView bill={bill} autoPrint={autoPrint} />;
}

export default ShowBills;

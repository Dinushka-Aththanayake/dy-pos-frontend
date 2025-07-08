import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HoldBills() {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchHeldBills = async () => {
      try {
        const response = await fetch("http://localhost:3000/bills/search?isFinalized=", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setBills(data);
      } catch (error) {
        console.error("Error fetching held bills:", error);
      }
    };

    fetchHeldBills();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
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
        className="sales-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          color: "#003366",
        }}
      >
        <thead style={{ backgroundColor: "#cce5ff", textAlign: "left" }}>
          <tr>
            <th>#</th>
            <th>Number Plate</th>
            <th>Customer Name</th>
            <th>Mobile Number</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No held bills found.
              </td>
            </tr>
          ) : (
            bills.map((bill, index) => (
              <tr key={bill.id}>
                <td>{index + 1}</td>
                <td>{bill.customerNumPlate || "N/A"}</td>
                <td>{bill.customerName || "N/A"}</td>
                <td>{bill.customerTelephone || "N/A"}</td>
                <td>{formatDate(bill.created)}</td>
                <td>
                  <button
                    className="see-more-button"
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/billing", { state: {holdbill: bill} })}
                  >
                    Unhold
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HoldBills;

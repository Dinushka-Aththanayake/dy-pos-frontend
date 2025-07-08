import React from "react";
import { useLocation } from "react-router-dom";

function ShowBills() {
  const location = useLocation();
  const bill = location.state || {};
  console.log(bill);

  // Calculate item total
  const itemTotal =
    bill.items?.reduce((acc, item) => {
      return acc + item.quantity * parseFloat(item.unitPrice);
    }, 0) || 0;

  // Calculate service total (if jobCard and jobs exist)
  const serviceTotal =
    bill.jobCard?.jobs?.reduce((acc, job) => {
      return acc + parseFloat(job.charge);
    }, 0) || 0;

  // Calculate full total
  const totalBill = itemTotal + serviceTotal;

  return (
    <div className="mm" style={{ padding: "20px" }}>
      <div className="detail-section">
        <p>
          <strong style={{ marginRight: "15px" }}>Bill Reference:</strong>{" "}
          {bill.id}
        </p>
        {bill.jobCard?.id && (
          <p>
            <strong style={{ marginRight: "15px" }}>Job Card Reference:</strong>{" "}
            {bill.jobCard.id}
          </p>
        )}
        <p>
          <strong style={{ marginRight: "15px" }}>Customer Name:</strong>
          {bill.customerName}
        </p>
        <p>
          <strong style={{ marginRight: "15px" }}>Number Plate:</strong>
          {bill.customerNumPlate}
        </p>
        <p>
          <strong style={{ marginRight: "15px" }}>Mobile Number:</strong>
          {bill.customerTelephone}
        </p>
        <p>
          <strong style={{ marginRight: "15px" }}>Date:</strong>
          {bill.finalized
            ? new Date(bill.finalized).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            : "N/A"}
        </p>
      </div>

      {/* Items Table */}
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
              <th>Inventory Ref</th>
              <th>Barcode</th>
              <th>Name</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.inventory.id}</td>
                <td>{item.inventory.product.barCode}</td>
                <td>{item.inventory.product.name}</td>
                <td>{parseFloat(item.unitPrice).toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>
                  {(item.quantity * parseFloat(item.unitPrice)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            textAlign: "right",
            fontWeight: "bold",
            fontSize: "18px",
            color: "#333",
            paddingRight: "15px",
            marginTop: "15px",
          }}
        >
          Total Item Price: Rs. {itemTotal.toFixed(2)}
        </div>
      </div>

      {/* Jobs Table (only if jobCard exists) */}
      {bill.jobCard?.jobs && bill.jobCard.jobs.length > 0 && (
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
                <th>Job Reference</th>
                <th>Title</th>
                <th>Employee Name</th>
                <th>Charge</th>
              </tr>
            </thead>
            <tbody>
              {bill.jobCard.jobs.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.employee.firstName}</td>
                  <td>{parseFloat(item.charge).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              textAlign: "right",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#333",
              paddingRight: "15px",
              marginTop: "15px",
            }}
          >
            Total Services Price: Rs. {serviceTotal.toFixed(2)}
          </div>
        </div>
      )}

      {/* Final Total */}
      <div
        style={{
          textAlign: "right",
          fontWeight: "bold",
          fontSize: "20px",
          color: "#000",
          paddingRight: "15px",
          marginTop: "20px",
        }}
      >
        Total Bill Price: Rs. {totalBill.toFixed(2)}
      </div>
    </div>
  );
}

export default ShowBills;

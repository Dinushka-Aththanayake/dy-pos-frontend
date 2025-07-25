import React, { useEffect, useState } from "react";
import "./BillView.css";
import logo from "../../../../assets/logo.png";
import kenwood from "../../../../assets/kenwood.png";
import jbl from "../../../../assets/jbl.png";
import pioneer from "../../../../assets/pioneer.png";
import lenovo from "../../../../assets/lenovo.png";
import zunavi from "../../../../assets/zunavi.jpeg";
import { useLocation } from "react-router-dom";
import { log } from "electron-builder";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function BillView() {
  const location = useLocation();
  const { billid, autoprint } = location.state || {};
  const billId = billid || location.state?.billid;
  const autoPrint = autoprint || location.state?.autoprint || false;
  const token = localStorage.getItem("access_token");

  const [bill, setBill] = useState({});
  console.log("Bill ID:", billId);

  useEffect(() => {
    if (billId) {
      fetch(`${API_BASE_URL}/bills/search?id=${billId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setBill(data[0]))
        .catch((err) => console.error("Failed to fetch bill:", err));
    }
  }, [billId]);
  console.log("Fetched bill data:", bill);

  useEffect(() => {
    if (autoPrint) {
      setTimeout(() => window.print(), 1500);
    }
  }, [autoPrint]);

  const handlePrint = () => {
    window.print();
  };

  const itemTotal =
    bill.items?.reduce(
      (acc, item) => acc + item.quantity * parseFloat(item.unitPrice),
      0
    ) || 0.0;
  const serviceTotal =
    bill.jobCard?.jobs?.reduce((acc, job) => acc + parseFloat(job.charge), 0) ||
    0.0;
  const totalBill = itemTotal + serviceTotal;
  const discount = parseFloat(bill.discount) || 0;
  const finalTotal = totalBill - discount;

  return (
    <div className="print-bill-container">
      <button className="print-btn" onClick={handlePrint}>
        Print
      </button>
      <div className="bill-header-custom">
        <div className="bill-header-row">
          <div className="bill-header-logo">
            <img src={logo} alt="Logo" style={{ height: 75 }} />
          </div>
          <div
            className="bill-header-title"
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
            }}
          >
            <div
              className="company-name-header"
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}
            >
              Ranawaka Car Audio
            </div>
            <div
              className="company-name-header"
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}
            >
              &{" "}
            </div>
            <div
              className="company-name-header"
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}
            >
              All Accessories
            </div>
            <div style={{ fontSize: 14, color: "#555" }}>
              All Accessories and Tint House
            </div>
          </div>
        </div>
        <div
          className="bill-header-divider"
          style={{ borderBottom: "2px solid #1964a2", margin: "5px 0 3px 0" }}
        />
        <div
          className="bill-header-contact"
          style={{
            textAlign: "center",
            fontSize: 10,
            fontStyle: "italic",
            color: "#555",
          }}
        >
          644/E/3, Bandarawatta, Kadawatha
          <br />
          Tel: 071-0919845 / 0769715454
        </div>
      </div>
      <div className="print-header">
        <h2>INVOICE</h2>
        <div className="print-meta">
          <div>
            <strong>Bill Ref:</strong> {bill.id}
          </div>
          {bill.jobCard?.id && (
            <div>
              <strong>Job Card Ref:</strong> {bill.jobCard?.id}
            </div>
          )}
          <div>
            <strong>Date:</strong>{" "}
            {bill.finalized
              ? new Date(bill.finalized).toLocaleString("en-GB")
              : "N/A"}
          </div>
        </div>
      </div>
      <div className="print-customer">
        <div>
          <strong>Customer Name:</strong> {bill.customerName}
        </div>
        <div>
          <strong>Vehicle Number:</strong> {bill.customerNumPlate}
        </div>
        <div>
          <strong>Mobile Number:</strong> {bill.customerTelephone}
        </div>
      </div>
      <h4 style={{ marginTop: 1, fontSize: "13px" }}>Items</h4>
      <table className="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Ref</th>
            <th>In Ref</th>
            <th>Barcode</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {bill.items?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.id}</td>
              <td>{item.inventory.id}</td>
              <td>{item.inventory.product.barCode}</td>
              <td style={{ fontSize: 11 }}>{item.inventory.product.name}</td>
              <td>{parseFloat(item.unitPrice).toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>{(item.quantity * parseFloat(item.unitPrice)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {bill.jobCard?.jobs && bill.jobCard.jobs.length > 0 && (
        <>
          <h4 style={{ marginTop: 10, fontSize: "13px" }}>Services</h4>
          <table className="print-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Job Ref</th>
                <th>Title</th>

                <th>Charge</th>
              </tr>
            </thead>
            <tbody>
              {bill.jobCard.jobs.map((job, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{job.id}</td>
                  <td>{job.title}</td>

                  <td>{parseFloat(job.charge).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <div className="print-summary">
        <div style={{ fontSize: 13 }}>
          <strong>Total Item Price:</strong> Rs. {itemTotal.toFixed(2)}
        </div>
        <div style={{ fontSize: 13 }}>
          <strong>Total Service Price:</strong> Rs. {serviceTotal.toFixed(2)}
        </div>
        <div style={{ fontSize: 13 }}>
          <strong>Discount:</strong> Rs. {discount.toFixed(2)}
        </div>
        <div className="print-final" style={{ fontSize: 12 }}>
          <strong>Final Total:</strong> Rs. {finalTotal.toFixed(2)}
        </div>
      </div>
      <div className="signature-row">
        <div className="signature-field">
          <span className="signature-label">Authorized</span>
          <div className="signature-line" />
        </div>
        <div className="signature-field">
          <span className="signature-label">Received</span>
          <div className="signature-line" />
        </div>
      </div>
      <div className="footorimgsection">
        <div className="imgsection">
          <img src={kenwood} alt="" className="billimg" />
        </div>
        <div className="imgsection">
          <img src={jbl} alt="" className="billimg" />
        </div>
        <div className="imgsection">
          <img src={pioneer} alt="" className="billimg" />
        </div>
        <div className="imgsection">
          <img src={lenovo} alt="" className="billimg" />
        </div>
        <div className="imgsection">
          <img src={zunavi} alt="" className="billimg" />
        </div>
      </div>
      <div className="print-footer">Thank you for your business!</div>
    </div>
  );
}

export default BillView;

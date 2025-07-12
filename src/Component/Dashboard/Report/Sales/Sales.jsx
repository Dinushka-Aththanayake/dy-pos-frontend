import React, { useState, useEffect } from "react";
import "./Sales.css";
import { formatDateToISO, formatDateToLocalString } from "../../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Sales() {
  const [branch, setBranch] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [barcode, setBarcode] = useState("");
  const [data, setData] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchSalesData(); // initial load without filters
  }, []);

  const fetchSalesData = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.barCode) queryParams.append("barCode", filters.barCode);
      if (filters.finalizedAfter)
        queryParams.append("finalizedAfter", formatDateToISO(filters.finalizedAfter, "00:00"));
      if (filters.finalizedBefore)
        queryParams.append("finalizedBefore", formatDateToISO(filters.finalizedBefore, "23:59"));

      const url = `${API_BASE_URL}/items/search?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        const updated = result.map((item) => ({
          ...item,
          profit: item.salesPrice - item.price,
        }));
        setData(updated);
      } else {
        console.error("Failed to fetch sales data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearch = () => {
    const filters = {
      barCode: barcode.trim(),
      finalizedAfter: startDate || undefined,
      finalizedBefore: endDate || undefined,
    };
    fetchSalesData(filters);
  };

  const totalPrice = (data?.reduce((sum, item) => sum + (parseFloat(item?.inventory?.buyPrice) || 0), 0)).toFixed(2);
  const totalSalePrice = (data.reduce(
    (sum, item) => sum + (parseFloat(item.unitPrice) || 0),
    0
  )).toFixed(2);
  const totalProfit = (data.reduce(
    (sum, item) => sum + ((parseFloat(item.unitPrice) || 0) - (parseFloat(item?.inventory?.buyPrice) || 0)),
    0
  )).toFixed(2);

  return (
    <div>
    <div className="sales-report-container">
      <h2 style={{ color: "rgb(0, 51, 102)",marginBottom:"10px" }}>Sales Item History</h2>
      <div className="sales-filter-section">
        <input
          type="text"
          placeholder="Search by Barcode..."
          className="searchbar"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="date-picker"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="date-picker"
        />
        <button
          className="searchbutton"
          style={{
            padding: "10px",
            backgroundColor: "#4682b4",
            color: "white",
          }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div style={{ display: "flex", gap: "15px", flexDirection:"row" }}>
        <div
          style={{
            marginTop: "20px",
            borderRadius: "10px",
            border: "1px solid #d0e1f9",
            backgroundColor: "#f4faff",
            boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.1)",
            padding: "0",
            flex: 4.5,
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
            <thead
              style={{
                backgroundColor: "#cce5ff",
                textAlign: "left",
              }}
            >
              <tr>
                <th>#</th>
                <th>Reference</th>
                <th>Barcode</th>
                <th>Product Name</th>
                <th>Buy Price</th>
                <th>Sale Price</th>
                <th>Profit</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.inventory?.product?.barCode || "N/A"}</td>
                  <td>{item.inventory?.product?.name || "N/A"}</td>
                  <td>{item.inventory.buyPrice}</td>
                  <td>{item.unitPrice}</td>
                  <td>
                    {(item.unitPrice - item.inventory.buyPrice).toFixed(2)}
                  </td>
                  <td>
                    {item.bill.finalized
                      ? formatDateToLocalString(new Date(item.bill.finalized))
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="summary"
          style={{
            flex: 1,
            borderRadius: "10px",
            border: "1px solid #d0e1f9",
            backgroundColor: "#f4faff",
            boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.1)",
            padding: "15px",
            maxHeight: "400px"
          }}
        >
          <p style={{ marginTop: "15px" }}>Total Buy Price:</p>
          <p style={{ fontSize: "18px", color: "#0077cc" }}>Rs.{totalPrice}</p>
          <p style={{ marginTop: "15px" }}>Total Sale Price:</p>
          <p style={{ fontSize: "18px", color: "#0077cc" }}>Rs.{totalSalePrice}</p>
          <p style={{ marginTop: "15px" }}>Total Profit:</p>
          <p style={{ fontSize: "18px", color: "#0077cc" }}>Rs.{totalProfit}</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Sales;

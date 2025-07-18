import React, { useState, useEffect } from "react";
import "./History.css";
import { useNavigate } from "react-router-dom";
import { div } from "framer-motion/client";
import { formatDateToISO } from "../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility for showing dialogs
const showDialog = async (options) => {
  if (window.electronAPI && window.electronAPI.showMessageBox) {
    await window.electronAPI.showMessageBox(options);
  } else {
    window.alert(options.message || options.title || '');
  }
};

function History() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [searchParams, setSearchParams] = useState({
    id: "",
    customerNumPlate: "",
    finalizedAfter: "",
    finalizedBefore: "",
  });
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [totalSearchedBillsPrice, setTotalSearchedBillsPrice] = useState(0);
  const token = localStorage.getItem("access_token");

  // Fetch all bills on initial load
  useEffect(() => {
    fetch(`${API_BASE_URL}/bills/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBills(data);
        } else {
          console.error("Unexpected response format:", data);
          setBills([]);
        }
      })
      .catch((error) => console.error("Error fetching bills!", error));
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Total calculation for one bill
  const calculateTotal = (bill) => {
    const itemTotal =
      bill.items?.reduce(
        (sum, item) => sum + parseFloat(item.unitPrice) * item.quantity,
        0
      ) || 0;
    const jobCardTotal =
      bill.jobCard?.jobs?.reduce(
        (sum, job) => sum + parseFloat(job.charge),
        0
      ) || 0;
    return itemTotal + jobCardTotal - bill.discount;
  };

  // Total of all searched bills
  const calculateAllBillsTotal = (bills) => {
    return bills.reduce((sum, bill) => sum + calculateTotal(bill), 0);
  };

  // Handle Search with query parameters
  const handleSearch = () => {
    const url = new URL(`${API_BASE_URL}/bills/search`);

    if (searchParams.id.trim() !== "") {
      url.searchParams.append("id", searchParams.id.trim());
    }

    if (searchParams.customerNumPlate.trim() !== "") {
      url.searchParams.append(
        "customerNumPlate",
        searchParams.customerNumPlate.trim().toUpperCase()
      );
    }

    if (searchParams.finalizedAfter) {
      url.searchParams.append("finalizedAfter", formatDateToISO(searchParams.finalizedAfter, "00:00"));
    }

    if (searchParams.finalizedBefore) {
      url.searchParams.append("finalizedBefore", formatDateToISO(searchParams.finalizedBefore, "23:59"));
    }

    fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBills(data);
          setSearchTriggered(true);
          const total = calculateAllBillsTotal(data);
          setTotalSearchedBillsPrice(total);
        } else {
          console.error("Unexpected response format:", data);
          setBills([]);
          setSearchTriggered(false);
        }
      })
      .catch((error) => {
        console.error("Error during search!", error);
        setBills([]);
        setSearchTriggered(false);
      });

    console.log("Search URL:", url.toString());
  };

  return (
    <div>
      

      <div style={{ display: "flex", gap: "10px",flexDirection:"row" }}>
        
        <div className="sales-report-container" style={{flex: 3, }}>
          <h2 style={{ color: "rgb(0, 51, 102)",marginBottom:"10px", }}>Bill History</h2>
          <div className="sales-filter-section">
            <input
              type="number"
              name="id"
              placeholder="Reference Number.."
              className="searchbar"
              value={searchParams.id}
              onChange={handleInputChange}
              min="0"
            />
            <input
              type="text"
              name="customerNumPlate"
              placeholder="Number Plate"
              className="searchbar"
              value={searchParams.customerNumPlate.toUpperCase()}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="finalizedAfter"
              className="date-picker"
              value={searchParams.finalizedAfter}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="finalizedBefore"
              className="date-picker"
              value={searchParams.finalizedBefore}
              onChange={handleInputChange}
            />
            <button className="searchbutton" onClick={handleSearch}>
              Search
            </button>
          </div>

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
                  <th>Vehicle Number</th>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Total Price (Rs)</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "10px" }}
                    >
                      No bills found.
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr key={bill.id}>
                      <td>{bill.id}</td>
                      <td>{bill.customerNumPlate || "-"}</td>
                      <td>{bill.customerName || "-"}</td>
                      <td>{bill.customerTelephone || "-"}</td>
                      <td>{calculateTotal(bill).toFixed(2)}</td>
                      <td>
                        {bill.finalized
                          ? new Date(bill.finalized).toLocaleDateString()
                          : "-"}
                      </td>
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
                          onClick={() =>
                            navigate("show", {
                              state: { billid:bill.id, autoprint: false },
                            })
                          }
                        >
                          See more
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {searchTriggered && (
          <div
            className="sales-report-container"
            style={{ maxHeight: "300px" }}
          >
            <p>
              <strong>Total Bills Price:</strong>
            </p>
            <p>Rs. {totalSearchedBillsPrice.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;

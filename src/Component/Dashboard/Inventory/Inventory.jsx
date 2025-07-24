import "./Inventory.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateToLocalString } from "../../../utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Inventory() {
  const Navigate= useNavigate();
  const [branchFilter, setBranchFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/inventories/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInventory(data);
        } else {
          console.error("Unexpected response format: " + JSON.stringify(data));
          setInventory([]);
        }
      })
      .catch((error) => console.error("Error fetching inventories!", error));
  }, []);

  // Filtered inventory based on search and branch selection
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product.barCode.toString().includes(searchTerm) ||
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm);

    const matchesBranch =
      branchFilter === "All" || item.branch.name === branchFilter;

    return matchesSearch && matchesBranch;
  });

  return (
    <div style={{backgroundColor:"#eff5fd",padding:"20px"}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
          Inventory
        </h2>
        <button
            className="createnewinventory-btn"
            style={{ padding: "10px",  backgroundColor:"#4682b4",
              color:"white"
             }}
             onClick={() => Navigate("new")}
          >
            Create Inventory
          </button>
      </div>
    
    <div className="inventory-container">
      {/* Inventory Header */}

      <div className="inventory-content">
        <div className="part1">
          <div className="filter-section11" style={{display:"flex"}}>
            <input
              type="text"
              placeholder="Search by Code or Name or Reference Id ..."
              className="search-input1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <button className="search-button">Search</button>
            
          </div>

          {/* Table Section */}
          <div
            className="table-section"
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
              className="inventory-table"
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
                  <th>Ref</th>
                  <th>Barcode</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Rem Qnty</th>
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="clickable-row"
                    style={{ backgroundColor: "#e6f2ff" }}
                  >
                    <td>{item.id}</td>
                    <td>{item.product.barCode}</td>
                    <td>{item.product.name}</td>
                    <td>{`Rs. ${item.sellPrice}`}</td>
                    <td>{item.remainingQuantity}</td>
                    <td>{item.branch.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Section */}
        {selectedItem && (
        <div className="form-section-inventory">
          <div className="image-placeholder">Image</div>
          <form className="inventory-form">
            <div className="form-group11">
              <label>Barcode:</label>
              <input
                type="text"
                value={selectedItem?.product.barCode || ""}
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Buy Price:</label>
              <input
                type="text"
                value={selectedItem ? `Rs. ${selectedItem.buyPrice}` : ""}
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Sell Price:</label>
              <input
                type="text"
                value={selectedItem ? `Rs. ${selectedItem.sellPrice}` : ""}
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Added Date:</label>
              <input
                type="text"
                value={
                  selectedItem?.created
                    ? formatDateToLocalString(new Date(selectedItem.created))
                    : ""
                }
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Rem Qty:</label>
              <input
                type="text"
                value={selectedItem?.remainingQuantity || ""}
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Added Qty:</label>
              <input
                type="text"
                value={selectedItem?.buyQuantity || ""}
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Branch:</label>
              <input
                type="text"
                value={selectedItem?.branch.name || ""}
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Category:</label>
              <input
                type="text"
                value={selectedItem?.product.category || ""}
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Supplier Name:</label>
              <input
                type="text"
                value={selectedItem?.supplierName || ""}
                readOnly
              />
            </div>
            <div className="form-group11">
              <label>Supplier Mobile Number:</label>
              <input
                type="text"
                value={selectedItem?.supplierTelephone || ""}
                readOnly
              />
            </div>
          </form>
          
        </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default Inventory;

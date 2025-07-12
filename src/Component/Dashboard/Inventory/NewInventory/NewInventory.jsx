import React, { useState } from "react";
import "./NewInventory.css";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NewInventory = () => {
  const [inventories, setInventories] = useState([
    {
      barcode: "",
      buyPrice: "",
      sellPrice: "",
      quantity: "",
      supplierName: "",
      supplierPhone: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...inventories];
    updated[index][field] = value;
    setInventories(updated);
  };

  const addInventoryRow = () => {
    setInventories([
      ...inventories,
      {
        barcode: "",
        buyPrice: "",
        sellPrice: "",
        quantity: "",
        supplierName: "",
        supplierPhone: "",
      },
    ]);
  };

  const deleteInventoryRow = (index) => {
    const updated = [...inventories];
    updated.splice(index, 1);
    setInventories(updated);
  };

  const cancelInventories = () => {
    setInventories([
      {
        barcode: "",
        buyPrice: "",
        sellPrice: "",
        quantity: "",
        supplierName: "",
        supplierPhone: "",
      },
    ]);
  };

  const saveInventories = async () => {
    const token = localStorage.getItem("access_token");

    try {
      for (const item of inventories) {
        const payload = {
          barCode: parseInt(item.barcode),
          buyPrice: parseFloat(item.buyPrice),
          sellPrice: parseFloat(item.sellPrice),
          supplierName: item.supplierName,
          supplierTelephone: item.supplierPhone,
          buyQuantity: parseFloat(item.quantity),
          branchId: 1,
        };

        await axios.post(`${API_BASE_URL}/inventories/create`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      alert("Inventories saved successfully!");
      cancelInventories();
    } catch (error) {
      console.error("Error saving inventories:", error);
      alert("Failed to save inventories. Check console for more info.");
    }
  };

  return (
    <div>
      <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
          New Inventories
        </h2>
    <div
      className="new-inventory-container"
      style={{
        marginTop: "20px",
        overflowX: "auto",
        borderRadius: "10px",
        border: "1px solid #d0e1f9",
        backgroundColor: "#f4faff",
        boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.1)",
        padding: "0",
        width:"100%"
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
        <thead style={{ backgroundColor: "#cce5ff", textAlign: "left" }}>
          <tr>
            <th>Barcode</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Quantity</th>
            <th>Supplier Name</th>
            <th>Supplier Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((item, index) => (
            <tr key={index} style={{ backgroundColor: "#e6f2ff" }}>
              <td>
                <input
                  className="newinventory-input"
                  type="number"
                  value={item.barcode}
                  onChange={(e) =>
                    handleChange(index, "barcode", e.target.value)
                  }
                  min="0"
                />
              </td>
              <td>
                <div className="input-wrapper">
                  <span className="prefix">Rs.</span>
                  <input
                    className="newinventory-input"
                    type="number"
                    value={item.buyPrice}
                    onChange={(e) =>
                      handleChange(index, "buyPrice", e.target.value)
                    }
                    min="0"
                  />
                </div>
              </td>
              <td>
                <div className="input-wrapper">
                  <span className="prefix">Rs.</span>
                  <input
                    className="newinventory-input"
                    type="number"
                    value={item.sellPrice}
                    onChange={(e) =>
                      handleChange(index, "sellPrice", e.target.value)
                    }
                    min="0"
                  />
                </div>
              </td>
              <td>
                <input
                  className="newinventory-input"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  className="newinventory-input"
                  type="text"
                  value={item.supplierName}
                  onChange={(e) =>
                    handleChange(index, "supplierName", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  className="newinventory-input"
                  type="text"
                  value={item.supplierPhone}
                  onChange={(e) =>
                    handleChange(index, "supplierPhone", e.target.value)
                  }
                />
              </td>
              <td className="delete-cell">
                <DeleteIcon
                  className="delete-icon"
                  onClick={() => deleteInventoryRow(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="inventory-button-group">
        <button onClick={addInventoryRow} className="add-btn3">
          Add Row
        </button>
        <button onClick={saveInventories} className="save-btn3">
          Save
        </button>
        <button onClick={cancelInventories} className="cancel-btn3">
          Cancel
        </button>
      </div>
    </div>
    </div>
  );
};

export default NewInventory;

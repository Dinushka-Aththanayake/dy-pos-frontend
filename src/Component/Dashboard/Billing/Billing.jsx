import React, { useState, useEffect } from "react";
import "./Billing.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { color } from "framer-motion";

function Billing() {
  const [inventory, setInventory] = useState([]);
  const token = localStorage.getItem("access_token");
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerTelephone, setCustomerTelephone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [products, setProducts] = useState(
    Array(1).fill({
      barcode: "",
      name: "",
      unitPrice: 0,
      discount: 0,
      quantity: 0,
    })
  );

  useEffect(() => {
    fetch("http://localhost:3000/inventories/search", {
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInventory([]);
    } else {
      setFilteredInventory(
        inventory.filter(
          (item) =>
            item.product.barCode.toString().includes(searchTerm) ||
            item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, inventory]);

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const existingIndex = products.findIndex(
      (item) => item.barcode === selectedProduct.product.barCode
    );

    if (existingIndex !== -1) {
      // Increase quantity if product already exists
      const updatedProducts = [...products];
      updatedProducts[existingIndex].quantity += 1;
      setProducts(updatedProducts);
    } else {
      // Find first empty row
      const emptyIndex = products.findIndex((item) => item.barcode === "");

      const newProduct = {
        inventoryId: selectedProduct.id,
        barcode: selectedProduct.product.barCode,
        name: selectedProduct.product.name,
        price: Number(selectedProduct.sellPrice),
        discount: 0,
        quantity: 1,
      };

      const updatedProducts = [...products];

      if (emptyIndex !== -1) {
        // Replace first empty row
        updatedProducts[emptyIndex] = newProduct;
      } else {
        // Append if no empty row
        updatedProducts.push(newProduct);
      }

      setProducts(updatedProducts);
    }

    setSelectedProduct(null);
    setSearchTerm("");
  };

  const handleUpdateProduct = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = Number(value);
    setProducts(updatedProducts);
  };

  const handleDelete = (index) => {
  const updatedProducts = [...products];
  updatedProducts.splice(index, 1); // remove the row completely
  setProducts(updatedProducts);
};

  const totalPrice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiscount = products.reduce(
    (sum, item) => sum + item.discount * item.quantity,
    0
  );
  const finalPrice = totalPrice - totalDiscount;

  const handleSave = async () => {
    if (!customerName || !customerTelephone) {
      alert("Please enter customer details");
      return;
    }
    try {
      const billResponse = await fetch("http://localhost:3000/bills/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName,
          customerTelephone,
          branchId: 1,
        }),
      });

      const billData = await billResponse.json();
      if (!billResponse.ok) throw new Error("Failed to create bill");

      const billId = billData.id;

      for (const product of products) {
        await fetch("http://localhost:3000/items/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            billId,
            inventoryId: product.inventoryId,
            quantity: product.quantity,
            unitPrice: product.price - product.discount,
          }),
        });
      }
      alert("Bill saved successfully");
      setProducts([]);
      setCustomerName("");
      setCustomerTelephone("");
    } catch (error) {
      console.error("Error saving bill: ", error);
    }
  };

  return (
    <div className="pos-container">
      <div className="main-container">
        <div className="info-bar">
          <div className="info-bar1">
            <label className="info-labal">Customer Name:</label>
          </div>
          <div className="info-bar1">
            <input
              type="text"
              className="info-input"
              placeholder="Enter Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="info-bar1">
            <label className="info-labal">Mobile Number:</label>
          </div>
          <div className="info-bar1">
            <input
              type="text"
              className="info-input"
              placeholder="Enter Mobile Number"
              value={customerTelephone}
              onChange={(e) => setCustomerTelephone(e.target.value)}
            />
          </div>
        </div>
        <div className="item-table-container">
          <div className="search-bar" style={{ width: "100%" }}>
            <Autocomplete
              options={inventory}
              getOptionLabel={(item) =>
                `${item.product.barCode} - ${item.product.name} - Rs.${item.sellPrice} - ${item.remainingQuantity} - ${item.branch.name} `
              }
              value={selectedProduct}
              onChange={(event, newValue) => setSelectedProduct(newValue)}
              inputValue={searchTerm}
              onInputChange={(event, newInputValue) =>
                setSearchTerm(newInputValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search (Barcode or Name)..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
                />
              )}
            />
            <button className="search-btn" onClick={handleAddProduct}>
              Add Item
            </button>
          </div>
          <div className="pos-table-div">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Name</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={index}>
                    <td>{item.barcode || "-"}</td>
                    <td>{item.name || "-"}</td>
                    <td>
                      Rs.
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleUpdateProduct(
                            index,
                            "UnitPrice",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      {" "}
                      Rs.
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleUpdateProduct(index, "discount", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateProduct(index, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      Rs.
                      {(
                        item.price * item.quantity -
                        item.discount * item.quantity
                      ).toFixed(2)}
                    </td>
                    <td>
                      {item.barcode && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totals">
            <div>Total Item Price: Rs.{totalPrice.toFixed(2)}</div>
            <div>Discount: Rs.{totalDiscount.toFixed(2)}</div>
            <div>
              <strong>Final Item Price: Rs.{finalPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="service-table-container">
          <div className="searchbar-section-service-table">
            <input
              type="text"
              className="searchbar-service-table"
              placeholder="Search Services.."
            />
            <button className="search-btn-service-table">Add Service </button>
          </div>
          <div className="pos-table-div">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Service Code</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Employee</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={index}>
                    <td></td>
                    <td></td>
                    <td>
                      
                      <input
                        type="text"
                        style={{width:"80%",}}
                      />
                    </td>
                    <td>
                      {" "}
                      
                      <input
                        type="text"
                       
                      />
                    </td>
                    <td>
                      Rs. 
                      <input
                        type="number"
                        
                        
                      />
                    </td>
                    
                    <td>
                      {item.barcode && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="totals" style={{ display: "flex", justifyContent: "right" }}>

            
            <div style={{float:"left"}}>
              <strong>Final Service Price: Rs.{finalPrice.toFixed(2)}</strong>
            </div>
          </div>

          <div className="totals" style={{ backgroundColor: "lightpink" }}>

            <div>Total Bill Price: Rs.{totalPrice.toFixed(2)}</div>
            <div>Discount: Rs.{totalDiscount.toFixed(2)}</div>
            <div>
              <strong>Final Bill Price: Rs.{finalPrice.toFixed(2)}</strong>
            </div>
          </div>

        <div className="footer">
          <button className="submit-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn">Cancel</button>
          <button className="hold-btn">Hold</button>
          <button className="print-btn">Print & Save</button>
        </div>
      </div>
    </div>
  );
}

export default Billing;

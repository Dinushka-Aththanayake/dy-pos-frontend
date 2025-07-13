import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Product() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [barCode, setBarCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const filterProduct = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barCode.toString().includes(searchTerm);
    return matchesSearch;
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/products/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Unexpected response format: " + JSON.stringify(data));
          setProducts([]);
        }
      })
      .catch((error) => console.error("Error fetching products!", error));

    fetch(`${API_BASE_URL}/products/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories!", error));

    fetch(`${API_BASE_URL}/products/brands`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((error) => console.error("Error fetching brands!", error));
  }, []);

  const handleConfirm = async (e) => {
    if(!barCode || !name || !category || !brand){
      window.electronAPI.showErrorBox('Missing Fields', 'Fill all fields');
      return;
    }
    e.preventDefault();
    const requestData = { barCode, name, category, brand };
    try {
      const response = await fetch(`${API_BASE_URL}/products/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        window.electronAPI.showMessageBox({
          type: 'info',
          message: 'Product created successfully!'
        });
        setBarCode("");
        setName("");
        setCategory("");
        setBrand("");

        const updatedProducts = await fetch(
          `${API_BASE_URL}/products/search`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json());

        setProducts(updatedProducts);
      } else {
        window.electronAPI.showErrorBox('Create Failed', 'Failed to create product.');
      }
    } catch (error) {
      console.error("Error creating product:", error);

      let msg = error.response?.data?.message;

      if (Array.isArray(msg)) {
        msg = msg.join("\n");
      }

      window.electronAPI.showErrorBox('Error', msg || 'Error creating product. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: "#eff5fd", padding: "20px" }}>
      <h2 style={{ color: "rgb(0, 51, 102)", marginBottom: "10px" }}>
        Products
      </h2>

      <div className="inventory-container" style={{ backgroundColor: "#eff5fd" }}>
        <div className="inventory-content">
          <div className="part1">
            <div className="filter-section" style={{ display: "flex", gap: "15px" }}>
              <input
                type="text"
                placeholder="Search by Code or Name..."
                className="search-input1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 5 }}
              />
              <button className="search-button" style={{ flex: 1 }} >Search</button>
            </div>

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
                className="inventory-table1"
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
                    <th>Barcode</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                  </tr>
                </thead>
                <tbody>
                  {filterProduct.map((item) => (
                    <tr
                      key={item.barCode}
                      style={{ backgroundColor: "#e6f2ff" }}
                    >
                      <td>{item.barCode}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.brand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="form-section-inventory">
            <div className="image-placeholder">Image</div>
            <form className="inventory-form" >
              <div className="form-group2">
                <label>Barcode:</label>
                <TextField
                  variant="outlined"
                  size="small"
                  value={barCode}
                  onChange={(e) => setBarCode(e.target.value)}
                  fullWidth
                  placeholder="Enter Barcode"
                />
              </div>
              <div className="form-group2">
                <label>Name:</label>
                <TextField
                  variant="outlined"
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  placeholder="Enter Name"
                />
              </div>
              <div className="form-group2">
                <Autocomplete
                  freeSolo
                  options={categories}
                  value={category}
                  onChange={(e, newValue) => setCategory(newValue || "")}
                  inputValue={category}
                  onInputChange={(e, newInputValue) => setCategory(newInputValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" variant="outlined" size="small" fullWidth />
                  )}
                />
              </div>
              <div className="form-group2">
                <Autocomplete
                  freeSolo
                  options={brands}
                  value={brand}
                  onChange={(e, newValue) => setBrand(newValue || "")}
                  inputValue={brand}
                  onInputChange={(e, newInputValue) => setBrand(newInputValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Brand" variant="outlined" size="small" fullWidth />
                  )}
                />
              </div>
              <button className="submit-btn" type="submit" onClick={handleConfirm} style={{ marginTop: "15px", float: "right" }}>
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Product() {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [barCode, setBarCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
  }, []);

  const handleConfirm = async (e) => {
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
        alert("Product created successfully!");
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
        alert("Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    }
  };

  

  return (
    <div className="inventory-container">
      <div className="inventory-content">
        <div className="part1">
          <div className="filter-section">
            <input
              type="text"
              placeholder="Search by Code or Name..."
              className="search-input1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button" >
              Search
            </button>
          </div>

          <div className="table-section" style={{
            marginTop: "20px",
            overflowX: "auto",
            borderRadius: "10px",
            border: "1px solid #d0e1f9",
            backgroundColor: "#f4faff",
            boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.1)",
            padding: "0",
          }} >
            <table className="inventory-table1" style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "Arial, sans-serif",
              color: "#003366",
            }} >
              <thead style={{
                backgroundColor: "#cce5ff",
                textAlign: "left",
              }}>
                <tr>
                  <th>Barcode</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                </tr>
              </thead>
              <tbody>
                {filterProduct.map((item) => (
                  <tr key={item.barCode} style={{ backgroundColor: "#e6f2ff" }}>
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
          <form className="inventory-form" onSubmit={handleConfirm}>
            <div className="form-group2">
              <label>Barcode:</label>
              <input
                type="text"
                value={barCode}
                onChange={(e) => setBarCode(e.target.value)}
              />
            </div>
            <div className="form-group2">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group2">
              <label>Category:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="form-group2">
              <label>Brand:</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <button className="submit-btn" type="submit">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Product;

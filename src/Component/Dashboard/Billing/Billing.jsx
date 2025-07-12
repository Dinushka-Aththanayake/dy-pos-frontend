import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Billing.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Billing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobCard, holdbill } = location.state || {};
  const [bill, setBill] = useState(holdbill);
  const [jobcard, setJobcard] = useState(jobCard);
  const token = localStorage.getItem("access_token");
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discount, setDiscount] = useState(bill?.discount || 0);

  const [customerTelephone, setCustomerTelephone] = useState(
    jobcard?.customerTelephone || bill?.customerTelephone || ""
  );
  const [customerNumPlate, setNumberPlate] = useState(
    jobcard?.numPlate || bill?.customerNumPlate || ""
  );
  const [customerName, setCustomerName] = useState(
    jobcard?.customerName || bill?.customerName || ""
  );

  const [products, setProducts] = useState(
    bill?.items?.map((item) => ({
      itemId: item.id,
      inventoryId: item.inventory.id,
      barcode: item.inventory.product.barCode,
      name: item.inventory.product.name,
      price: Number(item.unitPrice),
      discount: Number(item.inventory.sellPrice) - Number(item.unitPrice),
      quantity: item.quantity,
    })) || [
      {
        barcode: "",
        name: "",
        price: 0,
        discount: 0,
        quantity: 0,
      },
    ]
  );

  const [services, setServices] = useState(
    jobCard?.jobs?.map((job) => ({
      id: job.id,
      serviceCode: job.id,
      name: job.title || "",
      employee: job?.employee?.firstName || "",
      price: Number(job.charge || 0),
    })) ||
      bill?.jobCard?.jobs.map((service) => ({
        id: service.id,
        serviceCode: service.id || "",
        name: service.title || "",
        employee: service.employee.firstName || "",
        price: Number(service.charge || 0),
      })) ||
      []
  );

  useEffect(() => {
    fetch(`${API_BASE_URL}/inventories/search?available=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setInventory(data);
        else setInventory([]);
      })
      .catch((err) => console.error("Inventory fetch error:", err));
  }, []);

  const resetForm = () => {
    setCustomerName("");
    setCustomerTelephone("");
    setNumberPlate("");
    setProducts([
      {
        barcode: "",
        name: "",
        price: 0,
        discount: 0,
        quantity: 0,
      },
    ]);
    setServices([]);
    setSearchTerm("");
    setSelectedProduct(null);
    setJobcard(null);
    setBill(null);
    setDiscount(0);
  };

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

    const newProduct = {
      inventoryId: selectedProduct.id,
      barcode: selectedProduct.product.barCode,
      name: selectedProduct.product.name,
      price: Number(selectedProduct.sellPrice),
      discount: 0,
      quantity: 1,
    };

    const updatedProducts = [...products];
    if (existingIndex !== -1) {
      updatedProducts[existingIndex].quantity += 1;
    } else {
      const emptyIndex = products.findIndex((item) => item.barcode === "");
      if (emptyIndex !== -1) {
        updatedProducts[emptyIndex] = newProduct;
      } else {
        updatedProducts.push(newProduct);
      }
    }

    setProducts(updatedProducts);
    setSelectedProduct(null);
    setSearchTerm("");
  };

  const handleUpdateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = Number(value) || 0;
    setProducts(updated);
  };

  const handleDelete = async (index) => {
    const item = products[index];

    // If item has an ID, it exists in DB and should be deleted
    if (item.itemId) {
      try {
        await fetch(`${API_BASE_URL}/items/delete`, {
          method: "POST", // or "DELETE" based on your API
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: item.itemId }),
        });
      } catch (error) {
        console.error("Error deleting item from DB:", error);
        alert("Failed to delete item from database.");
        return; // exit early if delete fails
      }
    }

    // Remove from UI list
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] =
      field === "price" || field === "discount" ? Number(value) || 0 : value;
    setServices(updated);
  };

  const handleDeleteService = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const totalItemPrice = products.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0
  );
  const itemDiscount = products.reduce(
    (sum, i) => sum + (i.discount || 0) * (i.quantity || 0),
    0
  );
  const finalItemPrice = totalItemPrice - itemDiscount;

  const totalServicePrice = services.reduce(
    (sum, s) => sum + (s.price || 0),
    0
  );
  const totalServiceDiscount = services.reduce(
    (sum, s) => sum + (s.discount || 0),
    0
  );
  const finalServicePrice = totalServicePrice - totalServiceDiscount;

  const totalBill = finalItemPrice + finalServicePrice;
  const finalBill = totalBill - parseFloat(discount || 0);

  const handleSave = async () => {
    if (!customerName && (!customerNumPlate || !customerTelephone)) {
      alert("Please enter customer details");
      return;
    }

    try {
      // 1. Create/Update bill
      const billRes = await fetch(`${API_BASE_URL}/bills/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: bill?.id || undefined,
          customerName,
          customerTelephone,
          customerNumPlate,
          jobCardId: jobcard?.id || null,
          branchId: 1,
          discount: parseFloat(discount) || 0,
        }),
      });

      const billData = await billRes.json();
      if (!billRes.ok) throw new Error("Failed to create/update bill");
      const billId = parseInt(billData.id);

      // 2. Upsert items
      for (const product of products) {
        await fetch(`${API_BASE_URL}/items/upsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: product.itemId || undefined,
            billId,
            inventoryId: product.inventoryId,
            quantity: product.quantity,
            unitPrice: product.price - product.discount,
          }),
        });
      }
      const jobCardId = jobcard?.id || bill?.jobCard?.id;
      // 3. Upsert each service/job
      for (const service of services) {
        const job =
          jobcard?.jobs?.find((j) => j.id === service.id) ||
          bill?.jobCard?.jobs?.find((j) => j.id === service.id);
        if (!job) continue;

        await fetch(`${API_BASE_URL}/jobs/upsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobCardId: jobCardId,
            id: job.id,
            title: job.title,
            employeeId: job.employee.id,
            startTime: job.startTime,
            expectedEndTime: job.expectedEndTime,
            endTime: job.endTime,
            charge: service.price, // updated price
          }),
        });
      }

      // 4. Finalize the bill
      const finalizeRes = await fetch(`${API_BASE_URL}/bills/finalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: billId }),
      });

      if (!finalizeRes.ok) throw new Error("Failed to finalize bill");

      // 5. Complete jobcard

      if (jobCardId) {
        await fetch(`${API_BASE_URL}/jobcards/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: jobCardId }),
        });
      }

      alert("Bill saved successfully");
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
      alert(error.message || "An error occurred");
    }
  };

  const handleHold = async () => {
    if (!customerName && (!customerNumPlate || !customerTelephone)) {
      alert("Please enter customer details");
      return;
    }

    try {
      // 1. Create/Update bill
      const billRes = await fetch(`${API_BASE_URL}/bills/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: bill?.id || undefined,
          customerName,
          customerTelephone,
          customerNumPlate,
          jobCardId: jobcard?.id || bill?.jobCard?.id || null,
          branchId: 1,
          discount: discount || "0.00",
        }),
      });

      const billData = await billRes.json();
      if (!billRes.ok) throw new Error("Failed to create/update bill");
      const billId = parseInt(billData.id);

      // 2. Upsert items
      for (const product of products) {
        await fetch(`${API_BASE_URL}/items/upsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: product.itemId || undefined,
            billId,
            inventoryId: product.inventoryId,
            quantity: product.quantity,
            unitPrice: product.price - product.discount,
          }),
        });
      }

      // 3. Upsert each job (without finalizing)
      for (const service of services) {
        const job =
          jobcard?.jobs?.find((j) => j.id === service.id) ||
          bill?.jobCard?.jobs?.find((j) => j.id === service.id);
        if (!job) continue;

        await fetch(`${API_BASE_URL}/jobs/upsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: job.id,
            title: job.title,
            employeeId: job.employeeId,
            startTime: job.startTime,
            expectedEndTime: job.expectedEndTime,
            endTime: job.endTime,
            charge: service.price, // Updated charge
          }),
        });
      }

      alert("Bill held successfully");
      resetForm();
    } catch (error) {
      console.error("Hold error:", error);
      alert(error.message || "An error occurred while holding the bill");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this bill?")) {
      resetForm();
    }
  };

  const handlePrintAndSave = async () => {
    if (!customerName && (!customerNumPlate || !customerTelephone)) {
      alert("Please enter customer details");
      return;
    }
    await handleSave();
    navigate("/history/show", {
      state: {
        bill,
        autoPrint: true, // Set to true to trigger auto-print
      },
    });
  };

  return (
    <div className="pos-container">
      <div className="main-container">
        {/* Customer Info */}
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
            <label className="info-labal">Number Plate:</label>
          </div>
          <div className="info-bar1">
            <input
              type="text"
              className="info-input"
              placeholder="Enter Number Plate"
              value={customerNumPlate}
              onChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
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

        {/* Product Section */}
        <div className="item-table-container">
          <div className="search-bar" style={{ width: "100%" }}>
            <Autocomplete
              options={inventory}
              getOptionLabel={(item) =>
                `${item.product.barCode} - ${item.product.name} - Rs.${item.sellPrice} - ${item.product.brand}`
              }
              value={selectedProduct}
              onChange={(e, newValue) => setSelectedProduct(newValue)}
              inputValue={searchTerm}
              onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search (Barcode or Name)..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (selectedProduct) {
                        handleAddProduct();
                      } else if (filteredInventory.length === 1) {
                        setSelectedProduct(filteredInventory[0]);
                        handleAddProduct(); // Delay to ensure state is updated
                        setSearchTerm("");
                        
                      }
                      e.preventDefault(); // Prevent default Enter behavior
                    }
                  }}
                />
              )}
            />
            <button className="search-btn" onClick={handleAddProduct}>
              Add Item
            </button>
          </div>

          <table className="pos-table">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Name</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, i) => (
                <tr key={i}>
                  <td>{item.barcode}</td>
                  <td>{item.name}</td>
                  <td>
                    Rs.
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleUpdateProduct(i, "price", e.target.value)
                      }
                      min="0"
                    />
                  </td>
                  <td>
                    Rs.
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        handleUpdateProduct(i, "discount", e.target.value)
                      }
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateProduct(i, "quantity", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    Rs.
                    {(
                      (item.price || 0) * (item.quantity || 0) -
                      (item.discount || 0) * (item.quantity || 0)
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals">
            <div>Total Item Price: Rs.{totalItemPrice.toFixed(2)}</div>
            <div>Discount: Rs.{itemDiscount.toFixed(2)}</div>
            <div>
              <strong>Final Item Price: Rs.{finalItemPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Service Section */}
        {services.length > 0 && (
          <div className="service-table-container">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Service Code</th>
                  <th>Name</th>
                  <th>Employee</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, i) => (
                  <tr key={i}>
                    <td>{service.serviceCode}</td>
                    <td>{service.name}</td>
                    <td>{service.employee}</td>
                    <td>
                      Rs.
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) =>
                          handleServiceChange(i, "price", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals">
              <div>Total Service Price: Rs.{totalServicePrice.toFixed(2)}</div>
              <div>Discount: Rs.{totalServiceDiscount.toFixed(2)}</div>
              <div>
                <strong>
                  Final Service Price: Rs.{finalServicePrice.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Final Total */}
        <div className="totals" style={{ backgroundColor: "lightpink" }}>
          <div>Total Bill: Rs.{totalBill.toFixed(2)}</div>
          <div>
            Discount: Rs.
            <input
              type="number"
              className="discount-input"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min="0"
            />
          </div>
          <div>
            <strong>Final Bill: Rs.{finalBill.toFixed(2)}</strong>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <button className="submit-btn" onClick={handleSave}>
            Save
          </button>
          <button className="print-btn-bill" onClick={handlePrintAndSave}>
            Print & Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>

          
          <button className="hold-btn" onClick={handleHold}>
            Hold
          </button>
          <button className="hold-bills-btn" onClick={() => navigate("hold")}>
            Hold Bills
          </button>
        </div>
      </div>
    </div>
  );
}

export default Billing;

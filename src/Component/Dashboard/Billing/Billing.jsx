import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Billing.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility for showing dialogs
const showDialog = async (options) => {
  if (window.electronAPI && window.electronAPI.showMessageBox) {
    await window.electronAPI.showMessageBox(options);
  } else {
    window.alert(options.message || options.title || "");
  }
};

// Utility for showing confirmation dialogs
const showConfirm = async (options) => {
  if (window.electronAPI && window.electronAPI.showMessageBox) {
    const result = await window.electronAPI.showMessageBox({
      type: options.type || "question",
      buttons: options.buttons || ["Yes", "No"],
      title: options.title || "Confirm",
      message: options.message || "",
      defaultId: 0,
      cancelId: 1,
    });
    return result.response === 0;
  } else {
    return window.confirm(options.message || options.title || "Are you sure?");
  }
};

function Billing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobCard, holdbill } = location.state || {};
  // console.log("Job Card:", jobCard);
  // console.log("Hold Bill:", holdbill);
  const [bill, setBill] = useState(holdbill);
  const [jobcard, setJobcard] = useState(jobCard);
  const token = localStorage.getItem("access_token");
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discount, setDiscount] = useState(bill?.discount || 0);
  const jobCardId = jobcard?.id || holdbill?.jobCard?.id;
  const [billId, setBillId] = useState(bill?.id || null);
  // console.log("Job Card ID:", jobCardId);

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
      inventorySellPrice: Number(item.inventory.sellPrice),
      discount: 0,
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
  console.log("Products:", products);

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
  console.log("Services:", services);

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

  const handleAddProduct = (product) => {
    if (!product && !selectedProduct) return;
    const productToAdd = product || selectedProduct;

    const existingIndex = products.findIndex(
      (item) => item.barcode === productToAdd.product.barCode
    );

    const newProduct = {
      inventoryId: productToAdd.id,
      barcode: productToAdd.product.barCode,
      name: productToAdd.product.name,
      price: Number(productToAdd.sellPrice),
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
    const product = updated[index];
    console.log("Updating product:", product, "Field:", field, "Value:", value);
    if (field === "discount") {
      product.discount = Number(value) || 0;
    } else if (field === "price") {
      product.price = Number(value) || 0;
    } else {
      updated[index][field] = Number(value) || 0;
    }
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
        await showDialog({
          type: "error",
          title: "Delete Failed",
          message: "Failed to delete item from bill.",
        });
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
      await showDialog({
        type: "error",
        title: "Missing Fields",
        message: "Please enter customer details",
      });
      return;
    }

    try {
      const jobCardId = jobcard?.id || holdbill?.jobCard?.id || null;
      console.log("Job Card ID:", jobCardId);

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
          jobCardId: jobCardId || null,
          branchId: 1,
          discount: parseFloat(discount) || 0,
        }),
      });

      const billData = await billRes.json();
      if (!billRes.ok) throw new Error("Failed to create/update bill");
      const billId = parseInt(billData.id);
      setBillId(billId); // Update state with new bill ID
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
            unitPrice: product.price-product.discount,
          }),
        });
      }

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

      await showDialog({
        type: "info",
        message: "Bill saved successfully!",
      });
      resetForm();

      return billId; // Return the new bill ID for further use
    } catch (error) {
      console.error("Save error:", error);
      await showDialog({
        type: "error",
        title: "Error",
        message: error.message || "Error saving bill. Please try again.",
      });
    }
  };

  const handleHold = async () => {
    if (!customerName && (!customerNumPlate || !customerTelephone)) {
      await showDialog({
        type: "error",
        title: "Missing Fields",
        message: "Please enter customer details",
      });
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
            unitPrice: product.price-product.discount,
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
            jobCardId: jobCardId,
            id: job.id,
            title: job.title,
            employeeId: job.employee.id,
            startTime: job.startTime,
            expectedEndTime: job.expectedEndTime,
            endTime: job.endTime,
            charge: service.price,
            // Updated charge
          }),
        });
      }

      await showDialog({
        type: "info",
        message: "Bill held successfully!",
      });
      resetForm();
    } catch (error) {
      console.error("Hold error:", error);
      await showDialog({
        type: "error",
        title: "Error",
        message: error.message || "Error holding bill. Please try again.",
      });
    }
  };

  const handleCancel = async () => {
    const confirm = await showConfirm({
      type: "warning",
      title: "Cancel Bill",
      message: "Are you sure you want to cancel this bill?",
      buttons: ["Yes", "No"],
    });
    if (confirm) {
      resetForm();
    }
  };

  const handlePrintAndSave = async () => {
    if (!customerName && (!customerNumPlate || !customerTelephone)) {
      await showDialog({
        type: "error",
        title: "Missing Fields",
        message: "Please enter customer details",
      });
      return;
    }
    const billId = await handleSave();
    console.log("Bill ID for printing:", billId);
    navigate("/history/show", {
      state: {
        billid: billId,
        autoprint: true, // Set to true to trigger auto-print
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
            <input
              type="text"
              className="info-input"
              placeholder="Enter Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="info-bar1">
            <label className="info-labal"> Vehicle Number :</label>
            <input
              type="text"
              className="info-input"
              placeholder="Enter Number Plate"
              value={customerNumPlate}
              onChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
              style={{ marginLeft: "16px" }}
            />
          </div>
          <div className="info-bar1">
            <label className="info-labal">Mobile Number:</label>
            <input
              type="text"
              className="info-input"
              placeholder="Enter Mobile Number"
              value={customerTelephone}
              onChange={(e) => setCustomerTelephone(e.target.value)}
              style={{ marginLeft: "8px" }}
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
                      e.preventDefault(); // Prevent default Enter behavior
                      if (selectedProduct) {
                        handleAddProduct();
                        setSelectedProduct(null);
                      } else if (filteredInventory.length === 1) {
                        handleAddProduct(filteredInventory[0]);
                        setSearchTerm("");
                      }
                    }
                  }}
                  {...params.inputProps}
                />
              )}
              blurOnSelect
              clearOnBlur={false}
            />
            <button className="search-btn" onClick={() => handleAddProduct()}>
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

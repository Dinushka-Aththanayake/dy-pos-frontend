import React, { useState } from "react";
import './Sales.css';

function Sales() {
  const [branch, setBranch] = useState("All");
  const [startDate,setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const data = [
    { id:1, barcode:"20025", name: "Product 1", salesPrice: 100, price: 200, profit:100, branch:"Ganemulla", date:"20232/02/05"},
    {id: 2, barcode:"20026", name: "Product 2", salesPrice: 200, price: 300, profit:100, branch:"Ganemulla", date:"20232/04/05"},
    {id: 3, barcode:"20027", name: "Product 3", salesPrice: 300, price: 400, profit:100, branch:"Kadawatha", date:"20232/03/25"},
    {id: 4, barcode:"20028", name: "Product 4", salesPrice: 400, price: 500, profit:100, branch:"Ganemulla", date:"20232/02/05"},
  ];
  const totalPrice = data.reduce((sum, item) => sum + item.price, 0);
  const totalSalePrice = data.reduce((sum, item) => sum + item.salesPrice, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);

  return(
    <div className="sales-report-container">
      <div className="sales-filter-section">
        <input type="text" placeholder="Search by Barcode..." className="searchbar"  />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-picker" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-picker" />
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="branch-dropdown">
          <option value="All">All</option>
          <option value="Ganemulla">Ganemulla</option>
          <option value="Kadawatha">Kadawaths</option>
        </select>
        <button className="searchbutton">Search</button>

      </div>

      <table className="sales-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Barcode</th>
            <th>Product Name</th>
            <th>Sale Price</th>
            <th>Price</th>
            <th>Profit</th>
            <th>Branch</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.barcode}</td>
              <td>{item.name}</td>
              <td>{item.salesPrice}</td>
              <td>{item.price}</td>
              <td>{item.profit}</td>
              <td>{item.branch}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="summary">
        <p>Total Price: {totalPrice}</p>
        <p>Total Sale Price: {totalSalePrice}</p>
        <p>Total Profit: {totalProfit}</p>
      </div>
      
      <button className="print-button2">Print</button>
    </div>
  )
}

export default Sales;
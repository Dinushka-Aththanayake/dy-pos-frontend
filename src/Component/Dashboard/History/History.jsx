import React from "react";
import "./History.css";

function History() {
  return (
    <div className="history-container">
      <div className="history-content">
        {/* Left Table */}
        <div className="history-table-section">
          <div className="history-filter">
            <input type="text" placeholder="Enter Number Plate..." className="history-input" />
            <button className="history-search-btn">Search</button>
          </div>
          <table className="history-table">
            <thead>
              <tr>
                <th>Number Plate</th>
                <th>Date</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>NB50</td>
                <td>23/10/15</td>
                <td>Kadawatha</td>
              </tr>
              <tr>
                <td>NB50</td>
                <td>23/10/15</td>
                <td>Kadawatha</td>
              </tr>
              <tr>
                <td>NB50</td>
                <td>23/10/15</td>
                <td>Kadawatha</td>
              </tr>
              <tr>
                <td>NB50</td>
                <td>23/10/15</td>
                <td>Kadawatha</td>
              </tr>
              <tr>
                <td>NB50</td>
                <td>23/10/15</td>
                <td>Kadawatha</td>
              </tr>
              <tr>
                <td>NB50</td>
                <td>23/10/15</td>
                <td>Kadawatha</td>
              </tr>
              <tr>
                <td>NB50</td>
                <td>23/10/15</td>
                <td>Kadawatha</td>
              </tr>
              <tr>
                <td>NB50</td>
                <td>23/10/15</td>
                <td>Kadawatha</td>
              </tr>
              
              <tr>
                <td>CD20</td>
                <td>23/10/15</td>
                <td>Ganemulla</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Details */}
        <div className="history-details-section">
          <div className="history-details">
            <p><strong>Number Plate:</strong> NB50</p>
            <p><strong>Date:</strong> 23/10/15</p>
            <p><strong>Branch:</strong> Ganemulla</p>
          </div>
          <div className="history-job-details">
            <table className="job-table-history">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Item</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>Tinted</td>
                  <td>2.50</td>
                  <td>2</td>
                  <td>5.00</td>
                </tr>
                <tr>
                  <td>002</td>
                  <td>Setup</td>
                  <td>10.00</td>
                  <td>3</td>
                  <td>30.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;

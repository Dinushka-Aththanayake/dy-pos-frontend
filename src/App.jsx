import * as React from "react";
import "./App.css";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import TaskIcon from "@mui/icons-material/Task";
import InventoryIcon from "@mui/icons-material/Inventory";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TimelineIcon from "@mui/icons-material/Timeline";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaidIcon from "@mui/icons-material/Paid";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Billing from "./Component/Dashboard/Billing/Billing";
import Appoinment from "./Component/Dashboard/Appoinment/Appoinment";
import Employee from "./Component/Dashboard/Employee/Employee";
import Account from "./Component/Dashboard/Account/Account";
import JobCard from "./Component/Dashboard/JobCard/JobCard";
import History from "./Component/Dashboard/History/History";
import Inventory from "./Component/Dashboard/Inventory/Inventory";
import Payout from "./Component/Dashboard/Payout/Payout";
import Salary from "./Component/Dashboard/Report/Salary/Salary";
import Sales from "./Component/Dashboard/Report/Sales/Sales";
import Product from "./Component/Dashboard/Product/Product";
import { createHashRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router";
import Footer from "./Component/Dashboard/Footer/Footer";
import Login from "./Component/Login/Login";
import NewJobcards from "./Component/Dashboard/JobCard/NewJobcard/NewJobcards";
import NewAppointment from "./Component/Dashboard/Appoinment/NewAppoinment/NewAppoinment";
import SalaryCalculator from "./Component/Dashboard/Report/Salary/SalaryCalculator/SalaryCalculator";
import NewInventory from "./Component/Dashboard/Inventory/NewInventory/NewInventory";
import Services from "./Component/Dashboard/Report/Services/Services";
import ShowBills from "./Component/Dashboard/History/ShowBills/ShowBills";
import HoldBills from "./Component/Dashboard/Billing/HoldBills/HoldBills";
import RegisterUser from "./Component/Dashboard/Account/RegisterUser/RegisterUser";
import ShowSalary from "./Component/Dashboard/Report/Salary/ShowSalary/ShowSalary";

// 🔐 New ProtectedRoute Component
const ProtectedRoute = ({ allowedRoles, children }) => {
  const employeeData = localStorage.getItem("employee");
  const employee = JSON.parse(employeeData);
  const role = employee?.role;
  console.log("logged in user role", role);
  if (!role) return <Login />;
  if (!allowedRoles.includes(role)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.01)",
        }}
      >
        <div
          style={{
            padding: "2rem",

            borderRadius: "8px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "red", marginBottom: "1rem" }}>
            Unauthorized Access
          </h2>
          <p style={{ color: "gray" }}>
            You are logged in as <strong>{employee.role}</strong>
          </p>
        </div>
      </div>
    );
  }
  return children;
};

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  { segment: "billing", title: "Billing", icon: <ShoppingCartIcon /> },
  { segment: "history", title: "Billing History", icon: <HistoryIcon /> },
  { segment: "payout", title: "Payout", icon: <PaidIcon /> },
  { segment: "appoinment", title: "Appoinment", icon: <DashboardIcon /> },
  { segment: "jobcard", title: "Jobcards", icon: <TaskIcon /> },
  { segment: "inventory", title: "Inventory", icon: <InventoryIcon /> },
  { segment: "product", title: "Products", icon: <CategoryIcon /> },
  { kind: "divider" },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      { segment: "sales", title: "Sales", icon: <TimelineIcon /> },
      { segment: "services", title: "Services", icon: <TimelineIcon /> },
      { segment: "salary", title: "Salary", icon: <AttachMoneyIcon /> },
    ],
  },
  {
    segment: "employee",
    title: "Employee",
    icon: <SupervisorAccountIcon />,
    children: [
      { segment: "attendance", title: "Attendance", icon: <DescriptionIcon /> },
      { segment: "account", title: "Account", icon: <AccountCircleIcon /> },
    ],
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: false },
  colorSchemeSelector: "class",
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, xl: 1536 },
  },
});

function AppRoot(props) {
  const { window } = props;
  const demoWindow = window ? window() : undefined;

  return (
    <div>
      <div className="footer" style={{ zIndex: 100, padding: "0" }}>
        <Footer />
      </div>
      <div className="layout">
        <ReactRouterAppProvider
          navigation={NAVIGATION}
          theme={demoTheme}
          window={demoWindow}
          branding={{ title: "Ranawaka Car Audio & All Accessories" }}
        >
          <DashboardLayout>
            <PageContainer slots={{ header: () => null }}>
              <Outlet />
            </PageContainer>
          </DashboardLayout>
        </ReactRouterAppProvider>
      </div>
    </div>
  );
}

// 🌐 Router Setup
export const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "",
    element: <AppRoot />,
    children: [
      {
        path: "billing",
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <Billing />
              </ProtectedRoute>
            ),
          },
          {
            path: "hold",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <HoldBills />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "appoinment",
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <Appoinment />
              </ProtectedRoute>
            ),
          },
          {
            path: "new",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <NewAppointment />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "jobcard",
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <JobCard />
              </ProtectedRoute>
            ),
          },
          {
            path: "new",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <NewJobcards />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "history",
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <History />
              </ProtectedRoute>
            ),
          },
          {
            path: "show",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <ShowBills />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            path: "",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Inventory />
              </ProtectedRoute>
            ),
          },
          {
            path: "new",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <NewInventory />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "payout",
        element: (
          <ProtectedRoute allowedRoles={["admin", "worker"]}>
            <Payout />
          </ProtectedRoute>
        ),
      },
      {
        path: "product",
        element: (
          <ProtectedRoute allowedRoles={["admin", "worker"]}>
            <Product />
          </ProtectedRoute>
        ),
      },
      {
        path: "employee",
        children: [
          {
            path: "account",
            children: [
              {
                path: "",
                element: (
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Account />
                  </ProtectedRoute>
                ),
              },
              {
                path: "new",
                element: (
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <RegisterUser />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: "attendance",
            element: (
              <ProtectedRoute allowedRoles={["admin", "worker"]}>
                <Employee />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "reports",
        children: [
          {
            path: "sales",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Sales />
              </ProtectedRoute>
            ),
          },
          {
            path: "services",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Services />
              </ProtectedRoute>
            ),
          },
          {
            path: "salary",
            children: [
              {
                path: "",
                children: [
                  {
                    path: "",
                    element: (
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Salary />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "show",
                    element: (
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <ShowSalary />
                      </ProtectedRoute>
                    )
                  }
                ],
              },
              {
                path: "calculator",
                element: (
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <SalaryCalculator />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  console.log("App component rendered");
  return <RouterProvider router={router} />;
}

export default App;

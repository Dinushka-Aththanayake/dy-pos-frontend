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
import { Outlet } from "react-router";
import { createBrowserRouter, RouterProvider } from "react-router";
import Footer from "./Component/Dashboard/Footer/Footer";
import Login from "./Component/Login/Login";
import NewJobcards from "./Component/Dashboard/JobCard/NewJobcard/NewJobcards";
import NewAppointment from "./Component/Dashboard/Appoinment/NewAppoinment/NewAppoinment";
import SalaryCalculator from "./Component/Dashboard/Report/Salary/SalaryCalculator/SalaryCalculator";
import NewInventory from "./Component/Dashboard/Inventory/NewInventory/NewInventory";
import Services from "./Component/Dashboard/Report/Services/Services";
import ShowBills from "./Component/Dashboard/History/ShowBills/ShowBills";
import HoldBills from "./Component/Dashboard/Billing/HoldBills/HoldBills";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "billing",
    title: "Billing",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "history",
    title: "Billing History",
    icon: <HistoryIcon />,
  },
  {
    segment: "payout",
    title: "Payout",
    icon: <PaidIcon />,
  },
  {
    segment: "appoinment",
    title: "Appoinment",
    icon: <DashboardIcon />,
  },
  {
    segment: "jobcard",
    title: "Jobcards",
    icon: <TaskIcon />,
  },
  {
    segment: "inventory",
    title: "Inventory",
    icon: <InventoryIcon />,
  },
  {
    segment: "product",
    title: "Products",
    icon: <CategoryIcon />,
  },

  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <TimelineIcon />,
      },
      {
        segment: "services",
        title: "Services",
        icon: <TimelineIcon />,
      },

      {
        segment: "salary",
        title: "Salary",
        icon: <AttachMoneyIcon />,
      },
    ],
  },
  {
    segment: "employee",
    title: "Employee",
    icon: <SupervisorAccountIcon />,
    children: [
      {
        segment: "attendance",
        title: "Attendance",
        icon: <DescriptionIcon />,
      },
      {
        segment: "account",
        title: "Account",
        icon: <AccountCircleIcon />,
      },
    ],
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: false },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function AppRoot(props) {
  const { window } = props;

  // Remove this const when copying and pasting into your project.
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

export const router = createBrowserRouter([
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
            element: <Billing /> 
          },
          {
            path:"hold",
            element: <HoldBills/>
          }],
      },
      {
        path: "appoinment",
        children: [
          {
            path: "",
            element: <Appoinment />,
          },
          {
            path: "new",
            element: <NewAppointment />,
          },
        ],
      },
      {
        path: "jobcard",
        children: [
          {
            path: "",
            element: <JobCard />,
          },
          {
            path: "new",
            element: <NewJobcards />,
          },
        ],
      },
      {
        path: "history",
        children: [
          {
            path: "",
            element: <History />,
          },
          {
            path: "show",
            element: <ShowBills />,
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            path: "",
            element: <Inventory />,
          },
          {
            path: "new",
            element: <NewInventory />,
          },
        ],
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "payout",
        element: <Payout />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "employee",
        children: [
          {
            path: "attendance",
            element: <Employee />,
          },
          {
            path: "account",
            element: <Account />,
          },
        ],
      },
      {
        path: "reports",
        children: [
          {
            path: "sales",
            element: <Sales />,
          },
          {
            path: "services",
            element: <Services />,
          },
          {
            path: "salary",
            children: [
              {
                path: "",
                element: <Salary />,
              },
              {
                path: "calculator",
                element: <SalaryCalculator />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

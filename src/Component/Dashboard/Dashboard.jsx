import * as React from "react";
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
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Billing from "./Billing/Billing";
import Appoinment from "./Appoinment/Appoinment";
import Employee from "./Employee/Employee";
import Account from "./Account/Account";
import JobCard from "./JobCard/JobCard";
import History from "./History/History";
import Inventory from "./Inventory/Inventory";
import Payout from "./Payout/Payout";
import Salary from "./Report/Salary/Salary";
import Sales from "./Report/Sales/Sales";
import Product from "./Product/Product";

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
  colorSchemes: { light: true, dark: true },
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

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);
  return router;
}

const getPageComponent = (pathname) => {
  if (pathname.startsWith("/employee")) {
    const subPath = pathname.split("/")[2]; // Get the sub-segment
    if (subPath === "attendance") return <Employee />;
    if (subPath === "account") return <Account />;
  }

  if (pathname.startsWith("/reports")) {
    const subPath = pathname.split("/")[2]; // Get the sub-segment
    if (subPath === "sales") return <Sales />;
    if (subPath === "salary") return <Salary />;
  }
  switch (pathname) {
    case "/billing":
      return <Billing />;
    case "/appoinment":
      return <Appoinment />;
    case "/jobcard":
      return <JobCard />;
    case "/history":
      return <History />;
    case "/inventory":
      return <Inventory />;
    case "/account":
      return <Account />;
    case "/payout":
      return <Payout />;
    case "/product":
      return <Product />;
    default:
      return <Billing />;
  }
};

export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{ title: "Ranawaka Car Audio & All Accessories" }}
    >
      <DashboardLayout>
        <PageContainer slots={{ header: () => null }}>
          {getPageComponent(router.pathname)}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

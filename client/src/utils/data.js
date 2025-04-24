import { MdDashboard, MdAccountBalanceWallet, MdLogout } from "react-icons/md";
import { FaMoneyBillWave, FaRocket, FaStopwatch } from "react-icons/fa";
  
  export const SIDE_MENU_DATA = [
    {
      id: "01",
      title: "Dashboard",
      icon: MdDashboard,
      path: "/dashboard",
    },
    {
      id: "02",
      title: "Income",
      icon: MdAccountBalanceWallet,
      path: "/income",
    },
    {
      id: "03",
      title: "Expense",
      icon: FaMoneyBillWave,
      path: "/expense",
    },
    {
      id: "04",
      title: "Goals",
      icon: FaRocket,
      path: "/goal",
    },
    {
      id: "05",
      title: "History",
      icon: FaStopwatch,
      path: "/history",
    },
    {
      id: "06",
      title: "Logout",
      icon: MdLogout,
      path: "logout",
    }
  ];
  
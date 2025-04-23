// import {
//     LuLayoutDashboard,
//     LuHandCoins,
//     LuWalletMinimal,
//     LuLogout
// } from "react-icons/lu";

// export const SIDE_MENU_DATA = [
//     {
//         id: "01",
//         title: "Dashboard",
//         icon: LuLayoutDashboard,
//         path: "/dashboard",
//     },

//     {
//         id: "02",
//         title: "Income",
//         icon: LuWalletMinimal,
//         path: "/income",
//     },

//     {
//         id: "03",
//         title: "Expense",
//         icon: LuHandCoins ,
//         path: "/expense",
//     },

//     {
//         id: "06",
//         title: "Logout",
//         icon: LuLogout,
//         path: "logout",
//     }
// ]

import { MdDashboard, MdAccountBalanceWallet, MdLogout } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa"; // ✅ correct icon source
 // or use multiple libs
  
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
      id: "06",
      title: "Logout",
      icon: MdLogout,
      path: "logout",
    }
  ];
  
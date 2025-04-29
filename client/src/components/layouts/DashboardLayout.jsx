// import React, { useContext } from "react";
// import Navbar from "./Navbar";
// import SideMenu from "./SideMenu";
// import { UserContext } from "@/context/userContext";
// import Chatbot from "../Chatbot";

// const DashboardLayout = ({children, activeMenu}) => {
//   const { user } = useContext(UserContext);
//   return (
//     <div className="">
//       <Navbar activeMenu={activeMenu} />

//       {user && (
//         <div className="flex">
//           <div className="max-[1080px]:hidden">
//             <SideMenu activeMenu={activeMenu} />
//           </div>

//           <div className="grow mx-5">
//             {children}
//           </div>

//           <div className="fixed z-50 right-6 bottom-0">
//             <Chatbot />
//            </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardLayout;

import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "@/context/userContext";
import Chatbot from "../Chatbot";

const DashboardLayout = ({children, activeMenu}) => {
  const { user, isLoading } = useContext(UserContext);
  
  // If still checking authentication, show loading state
  if (isLoading) {
    return (
      <div className="">
        <Navbar activeMenu={activeMenu} />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">
            {children}
          </div>

          <div className="fixed z-50 right-6 bottom-0">
            <Chatbot />
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
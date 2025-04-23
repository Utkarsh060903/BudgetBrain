import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "@/context/userContext";
import Chatbot from "../Chatbot";

const DashboardLayout = ({children, activeMenu}) => {
  const { user } = useContext(UserContext);
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

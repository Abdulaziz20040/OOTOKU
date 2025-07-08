// app/DashboardLayout.tsx
import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import LeftSidebar from "../saidbar/LeftSidebar";
import RightSaidbar from "../saidbar/RightSaidbar";
import "../../../app/globals.css";

function DashboardLayout({ children }) {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  return (
    <div className="relative w-full h-screen bg-white pt-2.5 overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar
        isSidebarOpen={isLeftSidebarOpen}
        setIsSidebarOpen={setIsLeftSidebarOpen}
      />

      {/* Right Sidebar */}
      <RightSaidbar isSidebarOpen={isRightSidebarOpen} />

      {/* Asosiy kontent */}
      <div
        className={`transition-all duration-300 ease-in-out h-full
          ${isLeftSidebarOpen ? "ml-[212px]" : "ml-0"}
          ${isRightSidebarOpen ? "mr-[212px]" : "mr-0"}
          pr-2
        `}
      >
        <DashboardHeader
          setIsLeftSidebarOpen={setIsLeftSidebarOpen}
          setIsRightSidebarOpen={setIsRightSidebarOpen}
        />

        <div className="h-[calc(100vh-60px)] overflow-y-scroll custom-scroll px-4 mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

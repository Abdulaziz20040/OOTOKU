import React from "react";

function RightSaidbar({ isSidebarOpen }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[212px] z-30 bg-white 
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{ borderLeft: "1px solid rgba(28, 28, 28, 0.2)" }}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold text-black">Right Sidebar</h2>
        <p className="text-sm text-gray-600">Bu yerda kontent bo‘ladi</p>
      </div>
    </div>
  );
}

export default RightSaidbar;

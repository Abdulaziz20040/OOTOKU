import React from "react";
import { CiStar } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuPanelLeftDashed, LuPanelRightDashed } from "react-icons/lu";
import { MdOutlineHistory, MdOutlineWbSunny } from "react-icons/md";
import DynamicBreadcrumb from "../brendcramp/page";

function DashboardHeader({ setIsLeftSidebarOpen, setIsRightSidebarOpen }) {
  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen((prev) => !prev);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-[60px]  w-full z-10 bg-white py-2 px-4  border-b border-[#1C1C1C1A]">
      <div className="flex items-center justify-between w-full">
        {/* leftsection */}
        <div className="flex items-center gap-2 ">
          <LuPanelLeftDashed
            onClick={toggleLeftSidebar}
            className="text-[17px] cursor-pointer"
          />
          <CiStar className="text-[18px] cursor-pointer" />
          {/* brendcramp */}
          <DynamicBreadcrumb />
        </div>
        {/* right section */}
        <div className="flex items-center gap-2">
          <div className="relative ">
            <IoIosSearch className="absolute top-[4px] left-2 size-[21px] text-[#1C1C1C33]" />
            <input
              type="text"
              placeholder="Qidiruv"
              className="w-[168px] h-[28px] pl-9 bg-[#1C1C1C0D] placeholder:text-[#1C1C1C33] rounded-[8px] placeholder:text-sm outline-none"
            />
          </div>
          <MdOutlineWbSunny className="text-[18px] cursor-pointer" />
          <MdOutlineHistory className="text-[18px] cursor-pointer" />
          <IoNotificationsOutline className="text-[18px] cursor-pointer" />
          <LuPanelRightDashed
            onClick={toggleRightSidebar}
            className="text-[17px] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;

"use client";

import React, { useState, useEffect } from "react";
import "../app/globals.css";
import { MdHome, MdOutlineNewspaper } from "react-icons/md";
import { PiUsersLight } from "react-icons/pi";
import { RiChatAiFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function Sidebar() {
  const router = useRouter(); // useRouter o'zgartirilgan
  const [activeButton, setActiveButton] = useState("tasma");

  const handleClick = (buttonName, path) => {
    setActiveButton(buttonName);
    router.push(path); // navigate(path) o'rnini router.push(path) bilan almashtirdik
  };

  const menuItems = [
    {
      name: "tasma",
      icon: <MdHome className="text-[22px]" />,
      label: "Tasma",
      path: "/",
    },
    {
      name: "news",
      icon: <MdOutlineNewspaper className="text-[22px]" />,
      label: "Yangiliklar",
      path: "/news",
    },
    {
      name: "communities",
      icon: <PiUsersLight className="text-[22px]" />,
      label: "Jamiyatlar",
      path: "/communities",
    },
    {
      name: "chat",
      icon: <RiChatAiFill className="text-[22px]" />,
      label: "Chat",
      path: "/chat",
    },
  ];

  return (
    <div>
      <div>
        <div>
          {menuItems.map((btn) => (
            <motion.button
              key={btn.name}
              onClick={() => handleClick(btn.name, btn.path)}
              className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg text-left text-[16px] transition-all duration-300 menu-button ${
                activeButton === btn.name ? "active" : ""
              }`}
              whileHover={{ scale: 1.05, opacity: 0.9 }}
              whileTap={{ scale: 0.95, y: -2 }}
            >
              {btn.icon}
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

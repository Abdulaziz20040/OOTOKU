"use client";

import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaRegEnvelope,
  FaRegNewspaper,
  FaRegComments,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { IoPersonOutline, IoPeopleOutline } from "react-icons/io5";
import { RiFileList3Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

const getColorFromUsername = (username) => {
  const colors = [
    "#F87171",
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#A78BFA",
    "#F472B6",
    "#38BDF8",
    "#4ADE80",
    "#FB923C",
    "#E879F9",
  ];
  if (!username) return colors[0];

  let sum = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

const LeftSidebar = ({ isSidebarOpen }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [activeMenu, setActiveMenu] = useState("home");
  const router = useRouter();

  useEffect(() => {
    const savedActiveMenu = localStorage.getItem("activeMenu");
    const savedOpenMenus = localStorage.getItem("openMenus");

    if (savedActiveMenu) setActiveMenu(savedActiveMenu);
    if (savedOpenMenus) setOpenMenus(JSON.parse(savedOpenMenus));
  }, []);

  useEffect(() => {
    localStorage.setItem("activeMenu", activeMenu);
    localStorage.setItem("openMenus", JSON.stringify(openMenus));
  }, [activeMenu, openMenus]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    router.push(`/admin/pages/${menu}`);
  };

  const toggleSubMenu = (menu, firstChild) => {
    setOpenMenus((prev) => {
      const isOpen = !prev[menu];
      if (isOpen && firstChild) handleMenuClick(firstChild);
      return { ...prev, [menu]: isOpen };
    });
  };

  const getMenuClass = (menu) =>
    `flex items-center justify-between w-full px-2 py-1 rounded relative 
     hover:bg-gray-100 transition 
     ${
       activeMenu === menu
         ? "bg-gray-200 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-black"
         : ""
     }`;

  const getSubMenuClass = (isOpen) =>
    `overflow-hidden transition-all duration-300 ease-in-out ml-6 text-sm ${
      isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
    }`;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    fetch("https://otaku.up-it.uz/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          name: data.username,
          email: data.email,
          photo: data.photo, // Foydalanuvchi rasm
          background: data.background,
          subscribers: data.followers?.length || 0,
          subscriptions: data.following?.length || 0,
          bio: data.bio,
          posts: data.posts,
        });
      })
      .catch((err) => {
        console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", err);
      });
  }, []);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const bgColor = getColorFromUsername(user?.name);

  const renderSubMenu = (menuKey, items) => (
    <div className={getSubMenuClass(openMenus[menuKey])}>
      {items.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => handleMenuClick(key)}
          className={`block w-full py-1 px-2 text-left rounded 
            hover:bg-gray-100 transition
            ${
              activeMenu === key
                ? "bg-gray-200 font-semibold text-black border-l-2 border-black"
                : ""
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[212px] z-30 bg-white text-black 
        transition-transform duration-300 border-r border-[#1C1C1C1A]
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col gap-6 p-4">
        {/* Profil */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full"
            style={{
              backgroundImage: `url(${
                user?.photo || "default-avatar-url.jpg"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <span className="font-medium">{user?.name || "Foydalanuvchi"}</span>
        </div>

        {/* Bo'limlar */}
        <div>
          <h3 className="mb-2 text-xs text-gray-400">Boshqaruv panellari</h3>

          <button
            onClick={() => handleMenuClick("home")}
            className={getMenuClass("home")}
          >
            <FaHome className="text-[14px] mr-2" />
            Home
          </button>

          {[
            {
              key: "chat",
              icon: <FaRegEnvelope className="text-[14px]" />,
              label: "Chat",
              submenu: [
                { key: "ChatYozishmalar", label: "Yozishmalar" },
                { key: "chat-yangi", label: "Yangi chat" },
              ],
            },
            {
              key: "postlar",
              icon: <FaRegNewspaper className="text-[14px]" />,
              label: "Postlar",
              submenu: [
                { key: "post-yangi", label: "Yangi post" },
                { key: "post-stat", label: "Statistika" },
              ],
            },
            {
              key: "jamiyatlar",
              icon: <FaRegComments className="text-[14px]" />,
              label: "Jamiyatlar",
              submenu: [
                { key: "jamiyatlar-barchasi", label: "Barchasi" },
                { key: "jamiyatlar-yaratish", label: "Yaratish" },
              ],
            },
          ].map((menu) => (
            <div key={menu.key}>
              <button
                onClick={() => toggleSubMenu(menu.key, menu.submenu[0].key)}
                className={getMenuClass(menu.key)}
              >
                <span className="flex items-center gap-2">
                  {menu.icon}
                  {menu.label}
                </span>
                {openMenus[menu.key] ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </button>
              {renderSubMenu(menu.key, menu.submenu)}
            </div>
          ))}
        </div>

        <div>
          <h3 className="mb-2 text-xs text-gray-400">Sahifalar</h3>

          {[
            {
              key: "foydalanuvchilar",
              icon: <IoPersonOutline className="text-[14px]" />,
              label: "Foydalanuvchilar",
              submenu: [
                { key: "foy-umumiy", label: "Umumiy ko‘rinish" },
                { key: "foy-postlar", label: "Postlar" },
                { key: "foy-shikoyat", label: "Shikoyatlar" },
              ],
            },
            {
              key: "hisob",
              icon: <RiFileList3Line className="text-[14px]" />,
              label: "Hisob",
              submenu: [
                { key: "hisob-tolov", label: "To‘lovlar" },
                { key: "hisob-stat", label: "Statistika" },
              ],
            },
            {
              key: "adminlar",
              icon: <IoPeopleOutline className="text-[14px]" />,
              label: "Adminlar",
              submenu: [
                { key: "admin-royxat", label: "Ro‘yxat" },
                { key: "admin-ruxsat", label: "Ruxsatlar" },
              ],
            },
            {
              key: "yordam",
              icon: <RiFileList3Line className="text-[14px]" />,
              label: "Yordam",
              submenu: [
                { key: "yordam-qollab", label: "Qo‘llab-quvvatlash" },
                { key: "yordam-savollar", label: "Savol-javob" },
              ],
            },
          ].map((menu) => (
            <div key={menu.key}>
              <button
                onClick={() => toggleSubMenu(menu.key, menu.submenu[0].key)}
                className={getMenuClass(menu.key)}
              >
                <span className="flex items-center gap-2">
                  {menu.icon}
                  {menu.label}
                </span>
                {openMenus[menu.key] ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </button>
              {renderSubMenu(menu.key, menu.submenu)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;

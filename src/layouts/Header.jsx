import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { IoChevronDownSharp, IoNotificationsOutline } from "react-icons/io5";
import { VscListFilter } from "react-icons/vsc";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  if (!username) return colors[0]; // default rang

  let sum = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [createMenuVisible, setCreateMenuVisible] = useState(false);
  const dropdownRef = useRef();
  const createMenuRef = useRef();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setOpen(false);
    window.location.href = "/auth/login"; // to‘g‘ridan-to‘g‘ri login sahifaga o‘tadi va sahifani yangilaydi
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/login");
    }
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
    if (
      createMenuRef.current &&
      !createMenuRef.current.contains(event.target)
    ) {
      setCreateMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // user info backend

  const [user, setUser] = useState();

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
          photo: data.photo,
        });
      })
      .catch((err) =>
        console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", err)
      );
  }, []);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const bgColor = getColorFromUsername(user?.name);

  return (
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div>
        <Link href="/">
          <img
            src="Otoku.png"
            style={{ width: "80px", height: "23px" }}
            alt="Logo"
          />
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-[580px] ms-[90px]   flex gap-2 text-[#B1B1B1] text-[16px]">
        <CiSearch className="absolute top-[7px] left-3 text-[20px]" />
        <input
          className="w-full h-[35px] bg-white rounded-lg ps-11 outline-none"
          placeholder="Qidirish"
        />
        <button className="bg-white h-30px w-[40px] flex items-center justify-center rounded-lg cursor-pointer">
          <VscListFilter />
        </button>
      </div>

      {/* Profile and Create Menu */}
      <div className="flex items-center gap-4">
        <Link href="/user/profile/notifications">
          <IoNotificationsOutline className="text-[25px] cursor-pointer" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative cursor-pointer" ref={dropdownRef}>
          <div onClick={() => setOpen(!open)}>
            {user ? (
              user.photo ? (
                <img
                  src={user.photo}
                  className="w-[35px] h-[35px] rounded-full"
                  alt="User Avatar"
                />
              ) : (
                <div
                  className="w-[35px] h-[35px] rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase"
                  style={{ backgroundColor: bgColor }}
                >
                  {user.name.charAt(0)}
                </div>
              )
            ) : null}
          </div>

          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute w-[190px] bg-white shadow-lg top-12 rounded-xl border border-gray-200 overflow-hidden backdrop-blur-md bg-opacity-90"
            >
              <Link
                href="/user/profile"
                className="flex items-center gap-4 p-2 transition-all duration-150 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <>
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      className="w-[35px] h-[35px] rounded-full object-cover"
                      alt="User Avatar"
                    />
                  ) : (
                    <div
                      className="w-[35px] h-[35px] rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase"
                      style={{ backgroundColor: bgColor }}
                    >
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </>
                <span>
                  <p className="text-[14px] font-semibold">{user.name}</p>
                  <p className="text-[12px] text-[#B1B1B1]">{user.email}</p>
                </span>
              </Link>
              <div className="px-1">
                <Link
                  href="/user/profile"
                  className="block text-[14px] hover:bg-gray-100 p-2 rounded-md transition-all duration-150"
                  onClick={() => setOpen(false)}
                >
                  Profil
                </Link>
                <Link href="/user/settings">
                  <button
                    className="w-full text-[14px] text-left p-2 rounded-md hover:bg-gray-100 transition-all duration-150"
                    onClick={() => setOpen(false)}
                  >
                    Sozlamalar
                  </button>
                </Link>
              </div>
              <hr className="border-[#B1B1B1]" />
              <div className="px-1">
                <button
                  className="w-full p-2 text-[14px] cursor-pointer"
                  onClick={logout}
                >
                  Chiqish
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Create Post Dropdown */}
        <div className="relative" ref={createMenuRef}>
          <button
            onClick={() => setCreateMenuVisible(!createMenuVisible)}
            className="p-2 w-[140px] h-[34px] rounded-lg bg-[#50D1F9] text-white cursor-pointer text-[15px] flex items-center gap-3"
          >
            <IoMdAdd className="text-[19px]" /> Yaratish
            <IoChevronDownSharp className="text-[19px]" />
          </button>
          {createMenuVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute w-[140px] bg-white shadow-lg top-12 rounded-xl border border-gray-200 overflow-hidden backdrop-blur-md bg-opacity-90"
            >
              {["Tez", "Yangiliklar", "Tanlash", "Ko‘rib chiqish"].map(
                (item, idx) => (
                  <Link href={"/posts/create"} key={idx}>
                    <button
                      className="p-2 text-[14px] text-start w-full cursor-pointer transition-all duration-150 hover:bg-[#50D1F9] hover:text-white"
                      onClick={() => setCreateMenuVisible(false)}
                    >
                      {item}
                    </button>
                  </Link>
                )
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

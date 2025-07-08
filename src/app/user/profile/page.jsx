"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import {
  IoAddSharp,
  IoCheckmarkSharp,
  IoChevronDownOutline,
} from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegCommentDots,
  FaEllipsisH,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const options = ["Yangi", "Mashhur", "Eng zo'ri"];
const tabs = ["Yozuvlar", "Xatcho’plar", "Ko’proq o’qish", "Qoralamalar"];
const buttons = ["Hammasi", "Xabarlar", "Sharhlar", "Yangiliklar"];

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

const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  } catch (_) {
    return false;
  }
};

function Profil() {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Hammasi");
  const [activeContent, setActiveContent] = useState("Hammasi");
  const [activeTab, setActiveTab] = useState("Yozuvlar");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);

  // Get user data
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setIsLoading(false);

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
          background: data.background,
          subscribers: Array.isArray(data.followers)
            ? data.followers.length
            : 0,
          subscriptions: Array.isArray(data.following)
            ? data.following.length
            : 0,
          bio: data.bio,
          posts: data.posts?.data || [], // 🔧 MUHIM: to‘g‘ri array olish
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik:", err);
        setIsLoading(false);
      });
  }, []);

  // Tab memory
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) setActiveTab(savedTab);
  }, []);
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef1.current && !dropdownRef1.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (option) => {
    setSelectedOption(option);
    setMenuOpen(false);
  };

  const bgColor = getColorFromUsername(user?.name);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center text-white bg-black bg-opacity-90">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/spinner.svg"
            alt="loading"
            className="w-12 h-12 animate-spin"
          />
          <p className="text-lg">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-10">
      <div className="bg-white rounded-[20px]">
        <div
          className="relative"
          style={{
            backgroundImage: `url(${
              user.background ||
              "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjg5NC1rdWwtMDZfMS5qcGc.jpg"
            })`,
            width: "100%",
            height: "37vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px 20px 0px 0px",
          }}
        >
          <div className="w-[80px] h-[80px] absolute -bottom-9 left-6 rounded-full bg-white flex items-center justify-center">
            {user?.photo ? (
              <img
                src={user.photo}
                alt="User"
                className="w-[70px] h-[70px] rounded-full object-cover"
              />
            ) : (
              <div
                className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-white font-semibold text-2xl uppercase"
                style={{ backgroundColor: bgColor }}
              >
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <Link href="/user/settings">
            <button className="absolute flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm -bottom-18 right-8">
              <IoMdSettings />
              Sozlamalar
            </button>
          </Link>
        </div>

        <div className="px-5 pb-5 mt-16">
          <h1 className="text-[25px] font-bold">{user.name}</h1>
          <h3 className="mt-1 text-[#B1B1B1]">@{user.email}</h3>
          <p className="mt-1">{user.bio}</p>

          <div className="flex items-center gap-2 mt-6">
            <button>
              <span className="font-semibold mr-2 text-[18px]">
                {user.subscribers}
              </span>
              Obunachi
            </button>
            <button>
              <span className="font-semibold mr-2 text-[18px]">
                {user.subscriptions}
              </span>
              ta Obuna
            </button>
          </div>

          <div className="border-b-[#50D1F9] flex gap-10 text-[16px] font-medium mt-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pb-2 cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-[#50D1F9] text-[#50D1F9]"
                    : "text-[#B1B1B1]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "Yozuvlar" && (
        <div>
          {/* Search and filter */}
          <div className="flex items-center justify-between mt-2">
            <div className="relative w-[740px] flex gap-2 text-[#B1B1B1] text-[16px] mt-2">
              <CiSearch className="absolute top-[10px] left-3 text-[20px]" />
              <input
                className="w-full h-[40px] bg-white rounded-lg ps-11 outline-none"
                placeholder="Qidirish"
              />
            </div>
            <div className="text-[#B1B1B1]">
              <div
                className="relative custom-select-container"
                ref={dropdownRef}
              >
                <button
                  className="flex items-center gap-2 p-2 text-black"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <p>{selectedOption}</p>
                  <IoChevronDownOutline />
                </button>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[37px] z-20 left-0 p-3 w-[140px] bg-white rounded-xl shadow-md"
                  >
                    {options.map((option) => (
                      <button
                        key={option}
                        className="flex items-center justify-between cursor-pointer text-black p-[5px] w-full text-left"
                        onClick={() => selectOption(option)}
                      >
                        {option}
                        {selectedOption === option && (
                          <IoCheckmarkSharp className="text-[#50D1F9]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-4 mt-4">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => setActiveContent(btn)}
                className={`flex items-center gap-2 p-2 w-[100px] h-[35px] rounded-2xl justify-center transition-colors duration-200 ${
                  activeContent === btn
                    ? "bg-[#B6F9FF6E] text-[#50D1F9]"
                    : "bg-white text-black"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Posts list */}
          <div className="mt-4">
            {activeContent === "Hammasi" && (
              <>
                {user.posts.length > 0 ? (
                  user.posts.map((item, index) => {
                    const extractImageUrl = (html) => {
                      const match = html?.match(
                        /<img[^>]+src=["']([^"'>]+)["']/
                      );
                      return match ? match[1] : null;
                    };

                    const getShortText = (html, maxLength = 200) => {
                      const text = html?.replace(/<[^>]*>?/gm, "");
                      return text.length > maxLength
                        ? text.slice(0, maxLength) + "..."
                        : text;
                    };

                    const imageUrl = extractImageUrl(
                      item.caption || item.content
                    );
                    const shortText = getShortText(
                      item.caption || item.content
                    );

                    return (
                      <div
                        key={index}
                        className="w-full h-auto gap-3 p-4 mb-6 bg-white shadow-md rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          {user?.photo ? (
                            <img
                              src={user.photo}
                              alt="User"
                              className="w-[35px] h-[35px] rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-[35px] h-[35px] rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase"
                              style={{
                                backgroundColor: getColorFromUsername(
                                  user.name
                                ),
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="font-semibold text-md">{user.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="mt-4">
                          <Link href={`/posts/${item._id}`}>
                            <h1 className="text-lg font-semibold hover:underline">
                              {item.title}
                            </h1>
                            <p className="mt-2 text-gray-700">{shortText}</p>
                            {imageUrl && (
                              <img
                                className="object-cover w-full h-[350px] mt-4 rounded-xl"
                                src={imageUrl}
                                alt="Post image"
                              />
                            )}
                          </Link>
                        </div>

                        <div className="flex items-center justify-start gap-6 mt-4 text-gray-600">
                          <button className="flex items-center gap-1 cursor-pointer">
                            <FaRegThumbsUp />
                            <p>{item.likes_count || 0}</p>
                          </button>
                          <button className="flex items-center gap-1">
                            <FaRegThumbsDown />
                            <span>{item.dislikes || 0}</span>
                          </button>
                          <button className="flex items-center gap-1">
                            <FaRegCommentDots />
                            <span>
                              {item.comments_count ||
                                item.comments?.length ||
                                0}
                            </span>
                          </button>
                          <button>
                            <FaEllipsisH />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
                    <p className="w-[366px] text-[#ADA6A6] text-center text-[14px]">
                      Agar sizda biror post yoki maqola uchun qiziqarli
                      g‘oyangiz bo‘lsa, uyalmang va darhol yozishni boshlang.
                    </p>
                    <Link href="/createpost">
                      <button className="border-[#50D1F9] text-[#50D1F9] px-4 h-[35px] rounded-xl flex items-center gap-2 cursor-pointer bg-[#B6F9FF6E] mt-4">
                        <IoAddSharp />
                        Post yarating
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {activeTab === "Xatcho’plar" && (
        <div>
          {/* creat post info */}

          <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
            <p className=" w-[366px] text-[#ADA6A6] text-center text-[14px]">
              Xatcho‘plarga istalgan yozuvlarni qo‘shishingiz mumkin, shunda
              ularni yo‘qotib qo‘ymaysiz yoki keyinroq ularga qaytmaysiz.
            </p>
          </div>
        </div>
      )}
      {activeTab === "Ko’proq o’qish" && (
        <div>
          {/* creat post info */}

          <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
            <p className=" w-[70px] text-[#ADA6A6] text-center text-[14px]">
              (ー_ー)ノ Natija yoʻq
            </p>
          </div>
        </div>
      )}
      {activeTab === "Qoralamalar" && (
        <div>
          {/* creat post info */}

          <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
            <p className=" w-[366px] text-[#ADA6A6] text-center text-[14px]">
              Agar sizda biror post yoki maqola uchun qiziqarli g‘oyangiz
              bo‘lsa, uyalmang va darhol yozishni boshlang.
            </p>
            <button className="border-[#50D1F9] text-[#50D1F9] px-4 h-[35px] rounded-xl flex items-center gap-2 cursor-pointer bg-[#B6F9FF6E] mt-4">
              <IoAddSharp />
              Post yarating
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profil;

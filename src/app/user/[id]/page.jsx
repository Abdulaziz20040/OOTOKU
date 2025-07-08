"use client";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import PostCard from "@/components/PostCard";

const tabs = ["Yozuvlar", "Ko’proq o’qish"];
const buttons = ["Hammasi", "Xabarlar", "Sharhlar", "Yangiliklar"];

function UserProfil() {
  const route = useRouter();
  const params = useParams();
  const id = params?.id;

  const dropdownRef = useRef(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    photo: "",
    bio: "",
    background: "",
    followers: 0,
    following: 0,
    posts: [],
  });

  const [activeTab, setActiveTab] = useState("Yozuvlar");
  const [activeContent, setActiveContent] = useState("Hammasi");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // localStorage bilan activeTab
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = localStorage.getItem("activeTab");
      if (storedTab) setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === "undefined" || !id) return;

      const token = localStorage.getItem("accessToken");
      if (!token) {
        route.push("/auth/login");
        return;
      }

      try {
        // 1. USER PROFILI — username orqali
        const userRes = await axios.get(
          `https://otaku.up-it.uz/api/user/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const userData = userRes.data;

        setUser((prev) => ({
          ...prev,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          photo: userData.photo,
          background:
            userData.background ||
            "https://img.freepik.com/free-photo/anime-moon-landscape_23-2151645871.jpg",
          followers: userData.followers?.length || 0,
          following: userData.following?.length || 0,
          bio: userData.bio,
          subscribers: userData.followers?.length || 0,
          subscriptions: userData.following?.length || 0,
        }));

        // 2. POSTLAR — username orqali
        const postRes = await axios.get(
          `https://otaku.up-it.uz/api/post/${userData.username}?limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const postData = postRes.data?.data || [];

        setUser((prev) => ({
          ...prev,
          posts: postData,
        }));

        setIsLoading(false);
      } catch (error) {
        console.error(
          "❌ Ma'lumot olishda xatolik:",
          error?.response?.data || error.message
        );
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Dropdown tashqarisiga bosilsa yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubscribe = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      route.push("/auth/login");
      return;
    }

    try {
      const url = isSubscribed
        ? `https://otaku.up-it.uz/api/user/unfollow/${user.username}`
        : `https://otaku.up-it.uz/api/user/follow/${user.username}`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsSubscribed(!isSubscribed);
      setUser((prev) => ({
        ...prev,
        subscribers: isSubscribed ? prev.subscribers - 1 : prev.subscribers + 1,
      }));
    } catch (error) {
      console.error("❌ Obuna holatini o‘zgartirishda xatolik:", error);
    }
  };

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
              user.background && user.background.startsWith("http")
                ? user.background
                : "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjg5NC1rdWwtMDZfMS5qcGc.jpg"
            })`,
            width: "100%",
            height: "30vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px 20px 0px 0px",
          }}
        >
          <button className="w-[86px] h-[86px] rounded-full flex justify-center items-center ms-6 absolute -bottom-[33px] bg-white">
            <img
              className="w-[80px] h-[80px] rounded-full "
              src={
                user?.photo ||
                "https://i.pinimg.com/736x/52/fe/0f/52fe0fbcc8939e69873f89489994d9e5.jpg"
              }
              alt="Profil rasmi"
            />
          </button>
          <div className="absolute flex items-center gap-4 right-6 -bottom-12">
            <div className="relative" ref={dropdownRef}>
              <BsThreeDots
                className="text-[#B7B1B1] text-[20px] cursor-pointer"
                onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              />
              {isDropdownVisible && (
                <div className="absolute top-6 right-0 w-[150px] bg-white shadow-md rounded-lg">
                  {["Ulashish", "Shikoyat qilish", "Bloklash"].map(
                    (item, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              className={`px-3 py-1 rounded-lg cursor-pointer transition-all duration-300  ${
                isSubscribed
                  ? "bg-blue-200 text-blue-600" // Obunada bo‘lsa — och rang
                  : "bg-blue-400 text-white" // Obuna bo‘lmasa — to‘q rang
              }`}
              onClick={handleSubscribe}
            >
              {isSubscribed ? "Obunani bekor qilish" : "Obuna bo‘ling"}
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 mt-14">
          <h1 className="text-[25px] font-bold">
            {user?.username || "Noma'lum"}
          </h1>
          <h3 className="mt-1 text-[#B1B1B1]">{user?.email || "Noma'lum"}</h3>
          <p className="mt-1">{user?.bio || "Aniq bio mavjud emas"}</p>

          <div className="flex items-center gap-2 mt-6">
            <button>
              <span className="font-semibold text-[18px]">
                {user?.subscribers}
              </span>{" "}
              Obunachi
            </button>
            <button>
              <span className="font-semibold text-[18px]">
                {user?.subscriptions}
              </span>{" "}
              Obuna
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

      <div>
        {activeTab === "Yozuvlar" && (
          <div>
            <div className="flex items-center justify-between mt-2">
              <div className="relative w-[740px] flex gap-2 text-[#B1B1B1] text-[16px] mt-2">
                <CiSearch className="absolute top-[10px] left-3 text-[20px]" />
                <input
                  className="w-full h-[40px] bg-white rounded-lg ps-11 outline-none"
                  placeholder="Qidirish"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {buttons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => setActiveContent(btn)}
                  className={`flex items-center gap-2 p-2 w-[100px] cursor-pointer h-[35px] rounded-2xl justify-center transition-colors duration-200 ${
                    activeContent === btn
                      ? "bg-[#B6F9FF6E] text-[#50D1F9]"
                      : "bg-white text-black"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {activeContent === "Hammasi" && user?.posts?.length > 0 ? (
                user.posts.map((post, index) => (
                  <PostCard key={index} item={post} />
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-[173px] bg-white rounded-xl">
                  <p className="text-[#ADA6A6] text-center text-[14px]">
                    (ー_ー)ノ Hozircha yozuvlar yo‘q
                  </p>
                </div>
              )}

              {activeContent === "Xabarlar" && (
                <p>(ー_ー)ノ Xabarlar topilmadi</p>
              )}
              {activeContent === "Sharhlar" && (
                <p>(ー_ー)ノ Hozircha sharhlar yo‘q</p>
              )}
              {activeContent === "Yangiliklar" && (
                <p>(ー_ー)ノ Yangiliklar mavjud emas</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "Ko’proq o’qish" && (
          <div className="flex flex-col items-center justify-center bg-white w-full h-[173px] mt-4 rounded-xl">
            <p className="text-[#ADA6A6] text-center text-[14px]">
              (ー_ー)ノ Natija yoʻq
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfil;

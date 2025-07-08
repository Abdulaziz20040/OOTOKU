"use client";
import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";

const tabs = ["Mavzular"];

function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState("Mavzular");

  useEffect(() => {
    // Agar brauzerda bo'lsak, localStorage'dan qiymat olish
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("activeTab");
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  const [subscriptions, setSubscriptions] = useState({});

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const toggleSubscription = (id) => {
    setSubscriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="px-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] font-bold">Mavzular</h1>
        <Link href={"/createpost"}>
          <button className="flex items-center gap-2 text-[#50D1F9] text-[17px] cursor-pointer">
            <IoIosAdd className="text-[22px]" />
            <p>Yaratish</p>
          </button>
        </Link>
      </div>
      <p className="text-[#B1B1B1] mt-2 text-[14px] w-[663px]">
        Eng mashhur Otaku jamoalari va foydalanuvchilari haqida umumiy ma'lumot.
        O'zingizga yoqqan narsani toping yoki o'z hamjamiyatingizni yarating.
      </p>
      <div className="border-b-[#50D1F9] flex gap-10 text-[16px] font-medium mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 ${
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
      <div className="mt-4">
        <div className="relative w-full">
          <CiSearch className="absolute text-lg text-[#B1B1B1] left-3 top-3" />
          <input
            type="text"
            placeholder="Qidirish"
            className="w-full py-2 pl-10 pr-4 text-[#B1B1B1] bg-white shadow-sm rounded-xl focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-6">
        {activeTab === "Mavzular" && (
          <div>
            <div className="mt-4 space-y-2">
              {[
                {
                  id: 1,
                  img: "https://i.pinimg.com/736x/b8/8e/fc/b88efca476da8b79e56e1672a9a428da.jpg",
                  name: "Anime",
                  members: 1338,
                },
                {
                  id: 2,
                  img: "https://i.pinimg.com/736x/8a/d8/b6/8ad8b643481ca982c96ed1dc15ee7eb0.jpg",
                  name: "Freeren",
                  members: 417,
                },
                {
                  id: 3,
                  img: "https://i.pinimg.com/736x/93/fe/ff/93feff1da7db1dc07335c1ea20c6f5f1.jpg",
                  name: "Jujutsu Kaysen",
                  members: 412,
                },
                {
                  id: 4,
                  img: "https://i.pinimg.com/736x/b5/fa/5d/b5fa5d5b29cfba14ef58028976288479.jpg",
                  name: "O'yinlar",
                  members: 248,
                },
                {
                  id: 5,
                  img: "https://i.pinimg.com/736x/84/04/ed/8404ed939d215c1d508331b66ce143d5.jpg",
                  name: "Romantika ❤",
                  members: 245,
                },
                {
                  id: 6,
                  img: "https://i.pinimg.com/736x/7a/c8/11/7ac81172c6dbb79640efc45aab1f308f.jpg",
                  name: "Cosplaylar",
                  members: 211,
                },
                {
                  id: 7,
                  img: "https://i.pinimg.com/736x/7a/c8/11/7ac81172c6dbb79640efc45aab1f308f.jpg",
                  name: "Shinomalar",
                  members: 201,
                },
              ].map((community) => (
                <div
                  key={community.id}
                  className="flex items-center justify-between p-3 bg-white shadow-sm rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-medium text-gray-600">
                      {community.id}
                    </span>
                    <img
                      src={community.img}
                      className=" w-[30px] h-[30px] rounded-full"
                    />
                    <span>{community.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">{community.members}</span>
                    <button
                      onClick={() => toggleSubscription(community.id)}
                      className={`px-3 py-1 rounded-lg ${
                        subscriptions[community.id]
                          ? "bg-blue-200 text-blue-600"
                          : "bg-blue-400 text-white"
                      }`}
                    >
                      {subscriptions[community.id]
                        ? "Obuna bo‘ldingiz"
                        : "Obuna bo‘ling"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* {activeTab === "Foydalanuvchilar" && (
          <div>
            <h1 className="text-[24px] font-bold">Foydalanuvchilar</h1>
          </div>
        )}
        {activeTab === "Nazorat" && (
          <div>
            <h1 className="text-[24px] font-bold">Nazorat</h1>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default CommunitiesPage;

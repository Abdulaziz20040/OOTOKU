"use client";

import React, { useEffect, useState } from "react";
import {
  MdGroupAdd,
  MdOutlineWatchLater,
  MdOutlineWhatshot,
} from "react-icons/md";
import { PiRocketLight } from "react-icons/pi";
import Link from "next/link"; // Next.js Link importi
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BsChevronDown, BsChevronUp } from "react-icons/bs"; // down va up iconlar
import { motion } from "framer-motion"; // Motion kutubxonasini import qilish
import { useRouter } from "next/navigation";
import Posts from "./posts/page";

function Home() {
  const router = useRouter();

  // Set the activ state based on localStorage (only on client-side)
  useEffect(() => {
    const savedActiv = localStorage.getItem("activ");
    if (savedActiv) {
      setActiv(savedActiv);
    }
  }, []);
  const handleClick = (buttonName) => {
    setActiv(buttonName);
    localStorage.setItem("activ", buttonName);
  };

  const [activ, setActiv] = useState("ommabop"); // Initial value is set here
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false); // Qo'shimcha postlarni ko'rsatish holati

  useEffect(() => {
    axios
      .get("https://a2e6d09be5184e22.mokky.dev/OTOKU")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Xatolik yuz berdi:", e);
        setLoading(false);
      });
  }, []);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div className="px-10">
      <div className="w-full p-4 bg-white shadow-md rounded-2xl">
        <h1 className="font-semibold">Dolzarb</h1>
        <div className="grid grid-cols-1 gap-5 mt-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, index) => <SkeletonDolzarb key={index} />)
            : data.slice(0, showMore ? data.length : 6).map((item) => (
                <motion.div
                  key={item.id}
                  className="relative w-full h-[150px] cursor-pointer overflow-hidden rounded-md"
                  initial={{ opacity: 0, scale: 0.95 }} // Boshlang'ich holat: opacity 0, scale 0.95
                  animate={{ opacity: 1, scale: 1 }} // Oxirgi holat: opacity 1, scale 1
                  transition={{ duration: 0.5, ease: "easeInOut" }} // Animatsiya va tezlik
                >
                  <Link href={`/details/${item.id}`}>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </Link>
                  <Link href={`/details/${item.id}`}>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-[14px] font-medium">
                      {item.title}
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Yana 4 ta postni ko'rsatish uchun */}
        <div
          className="flex items-center justify-center gap-2 mt-3 cursor-pointer"
          onClick={toggleShowMore}
        >
          {showMore ? (
            <>
              <span className="text-gray-500">Kamroq ko'rsatish</span>
              <BsChevronUp />
            </>
          ) : (
            <>
              <span className="text-gray-500">Ko'proq ko'rsatish</span>
              <BsChevronDown />
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-start gap-8 mt-5">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  width={120}
                  height={35}
                  className="rounded-2xl"
                />
              ))
          : [
              {
                id: "ommabop",
                icon: <MdOutlineWhatshot />,
                label: "Ommabop",
              },
              { id: "Yangi", icon: <MdOutlineWatchLater />, label: "Yangi" },
              { id: "Eng zo'ri", icon: <PiRocketLight />, label: "Eng zo'ri" },
              { id: "Obunachilar", icon: <MdGroupAdd />, label: "Obunalarim" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleClick(btn.id)}
                className={`w-[120px] h-[35px] flex items-center justify-center gap-[6px] text-center rounded-2xl cursor-pointer duration-300 ${
                  activ === btn.id ? "bg-white text-black" : "text-[#B1B1B1]"
                }`}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
      </div>

      <div className="mt-5">
        {activ === "ommabop" && <Posts />}
        {activ === "Yangi" && <div>Yangi</div>}
        {activ === "Eng zo'ri" && <div>Eng zo'ri</div>}
        {activ === "Obunachilar" && <div>Obunalarim</div>}
      </div>
    </div>
  );
}

// Dolzarb bo‘limi uchun Skeleton
function SkeletonDolzarb() {
  return <Skeleton height={150} className="w-full rounded-md" />;
}

export default Home;

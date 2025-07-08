"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoCheckmarkSharp, IoChevronDownOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion"; // <-- Buni qo'shishni unutmang!
import Link from "next/link";
import Posts from "../posts/page";

const options = ["Yangi", "Mashhur", "Eng zo'ri"];

function NewsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const dropdownRef = useRef();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectOption = (option) => {
    setSelectedOption(option);
    setMenuOpen(false);
  };
  const toggleOptionsFilter = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };
  return (
    <div className="px-10 ">
      <div>
        <div className="flex items-center justify-between ">
          <h1 className=" text-[25px] font-bold">Yangiliklar</h1>
          <Link href={"/posts/create"}>
            <button className="flex items-center gap-2 text-[#50D1F9] text-[17px] cursor-pointer">
              <IoIosAdd className="text-[22px]" />
              <p>Yaratish</p>
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="relative w-[740px] flex gap-2 text-[#B1B1B1] text-[16px] mt-2">
            <CiSearch className="absolute top-2 left-3 text-[20px] " />
            <input
              className=" w-full h-[35px] bg-white rounded-lg  ps-11 outline-none"
              placeholder="Qidirish"
            />
          </div>
          <div className="text-[#B1B1B1]">
            <div
              className="relative custom-select-container "
              ref={dropdownRef}
            >
              <button
                className="flex items-center gap-2 p-2 text-blackl"
                onClick={toggleOptionsFilter}
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
                  className="absolute top-[37px] left-[0] p-3 w-[140px] bg-white rounded-xl shadow-md"
                >
                  {options.map((option) => (
                    <button
                      key={option}
                      className="flex items-center justify-between cursor-pointer text-black p-[5px] w-full text-left"
                      onClick={() => selectOption(option)}
                    >
                      {option}{" "}
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

        <div>
          <Posts />
        </div>
      </div>
    </div>
  );
}

export default NewsPage;

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsArrowLeft } from "react-icons/bs";
import { IoChevronDownSharp } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import CustomEditor from "./_CustomEditor";

// ✅ TYPE mapping: Faqat 3 xil formatga cheklangan
const typeMapping = {
  Rasm: "IMAGE",
  Video: "VIDEO",
  Matn: "TEXT",
};

const optionsData = {
  "Post mavzusini tanlang": ["Anime", "Manga", "Review"],
  "Post turi": ["Rasm", "Video", "Matn"],
  "Janrni tanlang": ["Shounen", "Seinen", "Isekai"],
  "Kimlarga ko‘rinadi": ["Hamma", "Do‘stlar", "Faqat men"],
  "Izoh sozlamalari": ["Barchaga ochiq", "Do‘stlarga ochiq", "Yopiq"],
};

const animeList = [
  "Naruto",
  "One Piece",
  "Attack on Titan",
  "Demon Slayer",
  "Jujutsu Kaisen",
];

function CreatePost() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(
    Object.fromEntries(Object.keys(optionsData).map((key) => [key, ""]))
  );
  const [editorContent, setEditorContent] = useState("");
  const [animeSearch, setAnimeSearch] = useState("");
  const [filteredAnime, setFilteredAnime] = useState(animeList);
  const router = useRouter();
  const [title, setTitle] = useState("");

  useEffect(() => {
    setFilteredAnime(
      animeList.filter((anime) =>
        anime.toLowerCase().includes(animeSearch.toLowerCase())
      )
    );
  }, [animeSearch]);

  const handleSelect = (label, option) => {
    setSelectedOptions({ ...selectedOptions, [label]: option });
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("⛔ Tizimga kiring. Token topilmadi.");
      return;
    }

    // ❗ Default type TEXT bo‘ladi agar mappingda yo‘q bo‘lsa
    const selectedType = typeMapping[selectedOptions["Post turi"]] || "TEXT";

    const postData = {
      content: editorContent || "Ma'lumot yo‘q",
      type: selectedType, // ✅ Faqat TEXT | VIDEO | IMAGE
      post_subject:
        selectedOptions["Post mavzusini tanlang"]?.toLowerCase() || "anime",
      genre: selectedOptions["Janrni tanlang"] || "TEXT",
      caption: editorContent || "",
      title: title || animeSearch || "Post sarlavhasi",
      location: "Tashkent, Uzbekistan",
      private: selectedOptions["Kimlarga ko‘rinadi"] !== "Hamma",
      can_comment: selectedOptions["Izoh sozlamalari"] !== "Yopiq",
      show_likes: true,
    };

    try {
      const response = await fetch("https://otaku.up-it.uz/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // ✅ To‘g‘ri formatda
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Post muvaffaqiyatli joylandi!");
        router.push("/");
      } else {
        console.error("❌ Xatolik:", data);
        alert("❌ Xatolik: " + (data.message || "Post yuborilmadi"));
      }
    } catch (error) {
      console.error("❗ Server bilan bog‘lanishda muammo:", error);
      alert("🌐 Internet yoki server muammosi.");
    }
  };

  return (
    <div className="px-10">
      <div
        onClick={() => router.push(-1)}
        className="flex items-center pb-3 space-x-4 cursor-pointer"
      >
        <BsArrowLeft className="text-[20px]" />
        <h1 className="text-2xl font-semibold">Post joylash</h1>
      </div>

      <div className="mt-4">
        <p className="text-[#B1B1B1] text-[14px] mb-2">Nashr qilish</p>

        <div className="relative">
          <div className="flex w-full items-center justify-between cursor-pointer gap-3 h-[50px] rounded-xl px-4 bg-white shadow-md text-[#B1B1B1]">
            <button className="flex items-center gap-3">
              <img
                src="https://i.pinimg.com/736x/bd/90/0d/bd900d77a9bc9fb6f24f593cfe8011b6.jpg"
                alt="user"
                className="w-[33px] h-[33px] rounded-full"
              />
              <p>Mening Profilim</p>
            </button>
            <IoChevronDownSharp />
          </div>
        </div>

        <div className="flex flex-wrap gap-5 mt-6">
          {Object.keys(optionsData).map((label, index) => (
            <div key={index} className="relative w-[191px] dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === label ? null : label);
                }}
                className="flex items-center cursor-pointer justify-between w-full h-[49px] text-[#000] text-[14px] bg-white rounded-[6px] p-2 shadow-md"
              >
                {selectedOptions[label] || label}
                <IoChevronDownSharp />
              </button>
              <AnimatePresence>
                {openDropdown === label && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full bg-white shadow-md rounded-[6px] mt-1"
                  >
                    {optionsData[label].map((option, idx) => (
                      <div
                        key={idx}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelect(label, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <CustomEditor onChange={setEditorContent} onTitleChange={setTitle} />

      <div className="flex items-center gap-4">
        <div className="w-[300px] mt-4 relative">
          <input
            type="text"
            placeholder="Anime nomini qidiring..."
            value={animeSearch}
            onChange={(e) => setAnimeSearch(e.target.value)}
            className="w-full p-3 text-black bg-white rounded-lg shadow-md outline-none px-11"
          />
          <CiSearch className="absolute bottom-[14px] left-3 size-[21px] text-[#B1B1B1]" />
          <AnimatePresence>
            {animeSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full bg-white shadow-md rounded-[6px] mt-1"
              >
                {filteredAnime.length > 0 ? (
                  filteredAnime.map((anime, idx) => (
                    <div
                      key={idx}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => setAnimeSearch(anime)}
                    >
                      {anime}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">Hech narsa topilmadi</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 w-[500px]">
        <button className="w-full p-3 text-black bg-gray-300 rounded-lg cursor-pointer">
          Bekor qilish
        </button>
        <button
          onClick={handleSubmit}
          className="w-full p-3 text-white bg-blue-500 rounded-lg cursor-pointer"
        >
          Saqlash
        </button>
        <button className="w-full p-3 text-white bg-yellow-500 rounded-lg cursor-pointer">
          Keyinroq saqlash
        </button>
      </div>
    </div>
  );
}

export default CreatePost;

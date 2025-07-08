"use client";
import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import Acaunt from "./acaunt/page";
import Pricacy from "./privacy/page";
import Notifications from "./notifacions/page";
import Blacklist from "./blacklist/page";
import ImageCropper from "../../../components/ImageCropper"; // 🔧 Cropper komponentini to'g'ri yo'ldan import qilish zarur
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = ["Hammasi", "Faqat obunachilar", "Faqat o’zim"];

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

function Settings() {
  const [activeTab, setActiveTab] = useState("Profil");
  const [isOn, setIsOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [settings, setSettings] = useState({
    fikrJavoblar: true,
    sharhBaholari: false,
    yangiIzohlar: true,
    yangiObunachilar: false,
  });

  const dropdownRef = useRef();
  const backgroundInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageForCrop, setImageForCrop] = useState(null); // Rasmni kesishga tayyorlash
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const photoInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageForCrop(imageURL);
      console.log("Opening crop modal with image:", imageURL); // Debug line
      setCropModalOpen(true);
    }
  };

  useEffect(() => {
    console.log("Crop modal state:", cropModalOpen); // Debug line
  }, [cropModalOpen]);

  const handleCropComplete = (croppedImgUrl) => {
    setPhotoPreview(croppedImgUrl); // Kesilgan rasmni preview qilish
    setPhotoFile(croppedImgUrl); // Kesilgan rasmni saqlash uchun
    setCropModalOpen(false); // Modalni yopish
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (option) => {
    setSelectedOption(option);
    setMenuOpen(false);
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await fetch("https://otaku.up-it.uz/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setUser({
          username: data.username,
          email: data.email,
          photo: data.photo,
          background:
            data.background ||
            "https://img.freepik.com/free-photo/anime-moon-landscape_23-2151645871.jpg",
          subscribers: data.followers?.length || 0,
          subscriptions: data.following?.length || 0,
          bio: data.bio || "",
          posts: data.posts || [],
          link: data.link || "",
        });
      } catch (err) {
        console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", err);
      }
    };

    fetchUser();
  }, []);

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("files", imageFile);

    const response = await fetch("https://otaku.up-it.uz/api/upload/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Upload failed: ${err}`);
    }

    const data = await response.json();
    return "https://otaku.up-it.uz" + data.files[0].path;
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !user) return alert("Token yoki foydalanuvchi topilmadi");

    try {
      const photoUrl = photoFile ? await uploadImage(photoFile) : user.photo;
      const backgroundUrl = backgroundFile
        ? await uploadImage(backgroundFile)
        : user.background;

      const updatedUser = {
        username: user.username,
        bio: user.bio,
        link: user.link || "",
        photo: photoUrl,
        background: backgroundUrl,
      };

      const res = await fetch("https://otaku.up-it.uz/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Xatolik");

      toast.success("Muvaffaqiyatli saqlandi!");

      setUser((prev) => ({ ...prev, ...updatedUser }));
      setPhotoPreview(null);
      setBackgroundPreview(null);
      setPhotoFile(null);
      setBackgroundFile(null);
    } catch (err) {
      console.error("Xatolik:", err);
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div className="px-10">
      <div className="bg-white rounded-[20px] p-4">
        <div className="flex items-center pb-3 space-x-4">
          <Link href="/user/profile">
            <BsArrowLeft className="text-[20px]" />
          </Link>
          <h1 className="text-2xl font-semibold">Sozlamalar</h1>
        </div>

        <div className="flex mt-4 space-x-6">
          {[
            "Profil",
            "Hisob",
            "Maxfiylik",
            "Bildirishnomalar",
            "Qora ro‘yxat",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-semibold cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-[#50D1F9] text-[#50D1F9]"
                  : "text-[#B1B1B1]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === "Profil" && user && (
            <div>
              {/* Cover and Profile Images */}
              <div className="relative w-full h-[250px]">
                <div className="relative w-full h-[250px]">
                  <div
                    className="relative"
                    style={{
                      backgroundImage: `url(${
                        backgroundPreview ||
                        (user?.background?.startsWith("http")
                          ? user.background
                          : "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjg5NC1rdWwtMDZfMS5qcGc.jpg")
                      })`,
                      width: "100%",
                      height: "200px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "20px 20px 0px 0px",
                    }}
                  ></div>
                  <button onClick={() => backgroundInputRef.current?.click()}>
                    <img
                      src="/addBacgroundimg.png"
                      className="w-[50px] h-[50px] absolute top-[33%] right-[50%]"
                      alt="Add Background"
                    />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={backgroundInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setBackgroundPreview(URL.createObjectURL(file));
                        setBackgroundFile(file);
                      }
                    }}
                    hidden
                  />
                </div>

                {cropModalOpen && imageForCrop && (
                  <ImageCropper
                    image={imageForCrop}
                    onComplete={handleCropComplete}
                    onCancel={() => setCropModalOpen(false)}
                  />
                )}

                <button onClick={() => backgroundInputRef.current?.click()}>
                  <img
                    src="/addBacgroundimg.png"
                    className="w-[50px] h-[50px] absolute top-[33%] right-[50%]"
                    alt="Add Background"
                  />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={backgroundInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBackgroundPreview(URL.createObjectURL(file));
                      setBackgroundFile(file);
                    }
                  }}
                  hidden
                />
                <div className="absolute bottom-4 left-6 w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center">
                  <button onClick={() => photoInputRef.current?.click()}>
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        className="w-[70px] h-[70px] rounded-full"
                      />
                    ) : user?.photo ? (
                      <img
                        src={user.photo}
                        className="w-[70px] h-[70px] rounded-full"
                      />
                    ) : (
                      <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={photoInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoPreview(URL.createObjectURL(file));
                        setPhotoFile(file);
                      }
                    }}
                    hidden
                  />
                </div>
              </div>

              {cropModalOpen && (
                <ImageCropper
                  imageSrc={imageForCrop}
                  onClose={() => setCropModalOpen(false)}
                  onCropComplete={handleCropComplete}
                />
              )}

              {/* Inputs */}
              <div className="w-full">
                <div className="w-[70%]">
                  <div>
                    <label className="block mb-1 text-[#B1B1B1]">
                      Ism va familiya
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-[#DEDEDE] rounded-md outline-none"
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block mb-1 text-[#B1B1B1]">
                      Men haqimda
                    </label>
                    <textarea
                      className="w-full p-2 border border-[#DEDEDE] rounded-md outline-none"
                      value={user.bio}
                      onChange={(e) =>
                        setUser({ ...user, bio: e.target.value })
                      }
                      placeholder="O‘z san‘atingizni baham ko‘ring, muhokama qiling..."
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block mb-1 text-[#B1B1B1]">Havola</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-[#DEDEDE] rounded-md outline-none"
                      value={user.link}
                      onChange={(e) =>
                        setUser({ ...user, link: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  className="mt-6 px-6 py-2 bg-[#50D1F9] text-white rounded-lg hover:bg-[#3bc0e9]"
                  onClick={handleSave}
                >
                  Saqlash
                </button>
              </div>
            </div>
          )}
          {activeTab === "Hisob" && <Acaunt />}
          {activeTab === "Maxfiylik" && (
            <Pricacy
              menuOpe={menuOpen}
              selectedOption={selectedOption}
              toggleOptionsFilter={() => setMenuOpen((prev) => !prev)}
              options={options}
              selectOption={selectOption}
              dropdownRef={dropdownRef}
              setIsOn={setIsOn}
              isOn={isOn}
            />
          )}
          {activeTab === "Bildirishnomalar" && (
            <Notifications settings={settings} toggleSetting={toggleSetting} />
          )}
          {activeTab === "Qora ro‘yxat" && <Blacklist />}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={photoInputRef}
        onChange={handlePhotoChange}
        hidden
      />
      {cropModalOpen && (
        <ImageCropper
          imageSrc={imageForCrop}
          onClose={() => setCropModalOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Settings;

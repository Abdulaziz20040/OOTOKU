"use client";

import React, { useEffect, useState } from "react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"; // ToastContainer ni to'g'ri import qilish

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 🔐 Tizimga kirgan foydalanuvchini tekshirish
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      window.location.href = "/"; // Foydalanuvchi tizimga kirgan bo‘lsa, bosh sahifaga
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toastOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeButton: true,
    className: "custom-toast",
  };

  // Xato xabarini ko'rsatish uchun yordamchi funksiya
  const showToast = (message) => {
    toast.error(message, toastOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Forma yuborilishining oldini olish

    const { full_name, username, email, password, confirmPassword } = formData;

    // Barcha maydonlar to'ldirilganligini tekshirish
    if (!full_name || !username || !email || !password || !confirmPassword) {
      showToast("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    // Full name va username kamida 3 ta harfdan iborat bo'lishi kerak
    if (full_name.length < 3) {
      showToast("Ism kamida 3 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (username.length < 3) {
      showToast(
        "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak."
      );
      return;
    }

    // Parolni tasdiqlash
    if (password !== confirmPassword) {
      showToast("Parollar mos emas!");
      return;
    }

    // Parolning minimal uzunligini tekshirish
    if (password.length < 8) {
      showToast("Parol kamida 8 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    // Email formatini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Iltimos, to'g'ri email manzilini kiriting.");
      return;
    }

    try {
      const res = await axios.post("https://otaku.up-it.uz/api/auth/register", {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        photo: "",
        bio: "",
      });

      // Tokenlarni saqlash
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", res.data?.user.username);

      toast.success(
        "Sizning hisobingiz muvaffaqiyatli yaratildi!",
        toastOptions
      );
      window.location.href = "/login"; // Ro'yxatdan o'tgandan keyin login sahifasiga yo'naltirish
    } catch (error) {
      console.error("Xatolik:", error.response?.data || error.message);

      if (error.response) {
        // Xatoliklar uchun alohida holatlar
        const errorMessage =
          error.response.status === 409
            ? "Bunday foydalanuvchi ro'yxatdan o'tgan!"
            : error.response.status === 400
            ? "Kirish ma'lumotlari noto'g'ri. Iltimos, tekshirib ko'ring."
            : "Ro'yxatdan o'tishda xatolik yuz berdi. Qaytadan urinib ko'ring.";

        showToast(errorMessage);
      } else if (error.request) {
        showToast(
          "Server bilan ulanishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
        );
      } else {
        showToast(
          "Ro'yxatdan o'tishda xatolik yuz berdi. Qaytadan urinib ko'ring."
        );
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden sm:px-0">
      <div
        className="absolute inset-0 bg-black opacity-90"
        style={{
          backgroundImage: `url("/Auth_bacground.jpg")`,
          backgroundSize: "170% 150%",
          backgroundPosition: "center",
        }}
      ></div>
      <div
        className="relative z-10 w-full p-8 shadow-xl max-w-96 rounded-2xl"
        style={{
          backdropFilter: "blur(17.8px)",
          boxShadow: "0px 4px 4px 0px #00000040",
          border: "2.13px solid",
          borderImageSource:
            "linear-gradient(135.59deg, rgba(88, 130, 193, 0.49) 1.28%, rgba(88, 130, 193, 0.11) 96.26%)",
          background: "#5882C147",
        }}
      >
        <h2 className="mb-4 text-2xl font-semibold text-center text-white">
          Ro‘yxatdan o‘tish
        </h2>

        <form onSubmit={handleSubmit}>
          {" "}
          {/* Form elementi qo‘shildi */}
          {[
            {
              name: "full_name",
              label: "Ismingizni kiriting",
              type: "text",
              placeholder: "Ismingiz",
            },
            {
              name: "username",
              label: "Foydalanuvchi nomi",
              type: "text",
              placeholder: "Foydalanuvchi nomi",
            },
            {
              name: "email",
              label: "Email manzilingiz",
              type: "email",
              placeholder: "username@gmail.com",
            },
            {
              name: "password",
              label: "Parol",
              type: "password",
              placeholder: "Parol",
            },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="mb-4">
              <label className="block text-gray-300">{label}</label>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 mt-1 text-black bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          ))}
          <div className="relative mb-4">
            <label className="block text-gray-300">Parolni tasdiqlang</label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Parolni tasdiqlang"
              className="w-full px-4 py-2 mt-1 text-black bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              className="absolute text-gray-400 cursor-pointer top-10 right-3 text-[15px]"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-gradient-to-r from-[#004080] via-[#0059b3] to-[#0073e6] rounded-md hover:opacity-90"
          >
            Tizimga kirish
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">Yoki davom eting</div>

        <div className="flex justify-center space-x-4">
          <button className="text-[21px] bg-white cursor-pointer w-[72px] h-[35px] rounded-[7.11px] flex items-center justify-center">
            <FcGoogle />
          </button>
          <button className="text-[21px] text-gray-500 bg-white cursor-pointer w-[72px] h-[35px] rounded-[7.11px] flex items-center justify-center">
            <FaApple />
          </button>
          <button className="text-[21px] text-blue-600 bg-white cursor-pointer w-[72px] h-[35px] rounded-[7.11px] flex items-center justify-center">
            <FaFacebook />
          </button>
        </div>

        <div className="mt-4 text-center text-gray-400">
          Hisobingiz bormi?{" "}
          <Link href="/auth/login">
            <span className="text-blue-400 cursor-pointer">Tizimga kirish</span>
          </Link>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeButton
        className="custom-toast-container"
        style={{
          zIndex: 9999,
        }}
      />
    </div>
  );
}

export default Register;

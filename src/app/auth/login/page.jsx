"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FaApple, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 🔐 Tizimga kirgan foydalanuvchini tekshirish
  // test
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/"); // Foydalanuvchi tizimga kirgan bo‘lsa, bosh sahifaga
    }
  }, [router]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        className: "custom-toast",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://otaku.up-it.uz/api/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const user = response.data?.user;

      // 👉 Tokenlarni va foydalanuvchi ma'lumotlarini saqlash
      localStorage.setItem("accessToken", response.data?.accessToken);
      localStorage.setItem("refreshToken", response.data?.refreshToken);
      localStorage.setItem("user", user?.username);
      localStorage.setItem("userId", user?.id || user?._id); // 🔥 YANGI QATOR

      toast.success("Muvaffaqiyatli tizimga kirdingiz!", {
        position: "top-center",
      });

      router.push("/"); // Bosh sahifaga o'tish
    } catch (error) {
      console.error("Login xatoligi:", error);

      const errorMessage =
        error.response?.data?.message || "Login yoki parol noto‘g‘ri!";

      toast.error(`Xatolik: ${errorMessage}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-black opacity-90"
        style={{
          backgroundImage: `url("/Auth_bacground.jpg")`,
          backgroundSize: "170% 150%",
          backgroundPosition: "center",
        }}
      ></div>

      <div
        className="relative z-10 p-8 shadow-xl rounded-2xl w-96"
        style={{
          backdropFilter: "blur(17.8px)",
          background: "#5882C147",
        }}
      >
        <h2 className="mb-4 text-2xl font-semibold text-center text-white">
          Tizimga kirish
        </h2>

        <div className="mb-4">
          <label className="block text-gray-300">Username (yoki email)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            placeholder="username yoki email"
            className="w-full px-4 py-2 mt-1 text-black bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="relative mb-4">
          <label className="block text-gray-300">Parolni kiriting</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            placeholder="Parol"
            className="w-full px-4 py-2 mt-1 text-black bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-10 right-3 text-gray-400 text-[15px]"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="mb-4 text-sm text-blue-400 cursor-pointer text-start">
          Parolni unutdingizmi?
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 font-semibold text-white bg-gradient-to-r from-[#004080] via-[#0059b3] to-[#0073e6] rounded-md hover:opacity-90"
        >
          Kirish
        </button>

        <div className="my-4 text-center text-gray-400">Yoki davom eting</div>

        <div className="flex justify-center space-x-4">
          <button className="text-[21px] bg-white w-[72px] h-[35px] rounded-[7.11px] flex items-center justify-center">
            <FcGoogle />
          </button>
          <button className="text-[21px] text-gray-500 bg-white w-[72px] h-[35px] rounded-[7.11px] flex items-center justify-center">
            <FaApple />
          </button>
          <button className="text-[21px] text-blue-600 bg-white w-[72px] h-[35px] rounded-[7.11px] flex items-center justify-center">
            <FaFacebook />
          </button>
        </div>

        <div className="mt-4 text-center text-gray-400">
          Hisobingiz yo‘qmi?{" "}
          <Link href="/auth/register">
            <span className="text-blue-400">Ro‘yxatdan o‘tish</span>
          </Link>
        </div>
      </div>

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

export default Login;

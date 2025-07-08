"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Routerni bu yerda olamiz

  const handleLogin = (e) => {
    e.preventDefault(); // Formning standart xatti-harakatlarini to‘xtatamiz

    // Agar email yoki parol bo‘sh bo‘lsa, loginni bajarish
    if (email === "" || password === "") {
      router.push("/admin/dashboard"); // Dashboardga o‘tish
    } else {
      router.push("/admin/dashboard"); // Dashboardga o‘tish
    }
  };

  return (
    <div className="relative flex min-h-screen">
      {/* O‘ng: Rasm qismi */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Auth_bacground.jpg"
          alt="Login Image"
          fill
          className="object-cover"
        />
        {/* Gradient chap tomondan o‘ngga yoyiladi */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141c2f] via-[#111828cc] to-transparent" />
      </div>

      {/* Chap: Login forma */}
      <div className="relative z-10 flex items-center justify-center w-full p-8 text-white bg-transparent md:w-1/2">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
          <div>
            <h2 className="mb-2 text-3xl font-bold">
              Welcome back<span className="text-blue-500">.</span>
            </h2>
            <p className="text-sm text-gray-400">
              Please login to your account
            </p>
          </div>

          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 text-white placeholder-gray-300 transition-all rounded-lg shadow-md bg-white/10 focus:outline-none focus:bg-white/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 text-white placeholder-gray-300 transition-all rounded-lg shadow-md bg-white/10 focus:outline-none focus:bg-white/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 font-medium text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

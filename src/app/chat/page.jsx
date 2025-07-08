"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ✅ Xabarlarni olish
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "https://otaku.up-it.uz/api/chat/messages/usmonjon"
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Xabarlarni olishda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ✅ Xabar yuborish
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      await axios.post("https://otaku.up-it.uz/api/chat/message", {
        text,
        username: "usmonjon", // agar kerak bo‘lsa sozlab olamiz
      });

      setText("");
      fetchMessages(); // yuborilgach qayta yuklaymiz
    } catch (err) {
      console.error("Xabar yuborishda xatolik:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#fdf6ff] via-[#f0eaff] to-[#e5d7ff]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shadow bg-white/70 backdrop-blur">
        <h1 className="text-xl font-semibold text-purple-600">🌸 Otaku Chat</h1>
        <span className="flex items-center gap-2 px-3 py-1 text-sm text-purple-600 bg-purple-100 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          14 foydalanuvchi online
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scroll">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-300 rounded-full" />
            <div className="max-w-md px-4 py-2 shadow bg-white/80 backdrop-blur-sm rounded-xl">
              <p className="text-sm text-gray-700">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="px-4 py-3 border-t bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Xabaringizni yozing..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 text-sm text-black bg-white border border-purple-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-300"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 text-sm font-semibold text-white transition bg-purple-500 rounded-full hover:bg-purple-600"
          >
            Yuborish
          </button>
        </div>
      </div>
    </div>
  );
}

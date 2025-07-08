"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const timeOptions = ["Kun", "Hafta", "Oy", "Yil"];

const userData = [
  { name: "Yanvar", current: 12, previous: 10 },
  { name: "Fevral", current: 16, previous: 9 },
  { name: "Mart", current: 20, previous: 12 },
  { name: "Aprel", current: 14, previous: 18 },
  { name: "May", current: 18, previous: 24 },
  { name: "Iyun", current: 25, previous: 20 },
];

const trafficData = [
  { name: "Yanvar", traffic: 21 },
  { name: "Fevral", traffic: 23 },
  { name: "Mart", traffic: 22 },
  { name: "Aprel", traffic: 27 },
  { name: "May", traffic: 14 },
  { name: "Iyun", traffic: 22 },
];

const salesData = [
  { name: "Otaku Basic", value: 300.56 },
  { name: "Otaku Plus", value: 135.18 },
  { name: "Otaku Pro", value: 154.02 },
  { name: "Otaku Premium", value: 48.96 },
];

const COLORS = ["#8884d8", "#82ca9d", "#8dd1e1", "#a4de6c"];

const topics = [
  { name: "Dildora", percent: 75 },
  { name: "Iroda", percent: 65 },
  { name: "Ikrom", percent: 60 },
  { name: "Murod", percent: 55 },
  { name: "Lobar", percent: 45 },
  { name: "Diyor", percent: 35 },
  { name: "Ulug", percent: 30 },
  { name: "Sardor", percent: 25 },
];

const DashboardCharts = () => {
  const [selectedTime, setSelectedTime] = useState("Kun");
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header with dropdown */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          >
            {selectedTime}
          </button>

          <div
            className={`absolute z-10 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg transform transition-all duration-200 ease-out origin-top-left ${
              showOptions
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {timeOptions
              .filter((option) => option !== selectedTime)
              .map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSelectedTime(option);
                    setShowOptions(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  {option}
                </div>
              ))}
          </div>
        </div>

        <h1 className="text-lg font-semibold text-gray-700">
          {selectedTime}lik Statistikalar
        </h1>
      </div>

      {/* Statistik kartalar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[
          { title: "Ko’rishlar", value: "721K", percent: "+11.01%" },
          { title: "Tashriflar", value: "367K", percent: "-0.03%" },
          {
            title: "Yangi foydalanuvchilar",
            value: "1,156",
            percent: "+15.03%",
          },
          { title: "Faol foydalanuvchilar", value: "239K", percent: "+6.08%" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-4 bg-[#E3F5FF] shadow rounded-2xl"
          >
            <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
            <p className="text-2xl font-bold">{item.value}</p>
            <p
              className={`text-sm ${
                item.percent.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.percent}
            </p>
          </div>
        ))}
      </div>

      {/* Grafik va faol mavzular */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="p-6 bg-[#F7F9FB] shadow rounded-2xl md:col-span-2 xl:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Jami foydalanuvchilar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#8884d8"
                name="Joriy"
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#000"
                strokeDasharray="5 5"
                name="Oldingi"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-[#F7F9FB] shadow rounded-2xl">
          <h3 className="mb-4 text-lg font-semibold">Faol mavzular</h3>
          <div className="space-y-3">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="group"
                onMouseEnter={() => setHoveredTopic(topic)}
                onMouseLeave={() => setHoveredTopic(null)}
              >
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{topic.name}</p>
                  {hoveredTopic?.name === topic.name && (
                    <span className="text-xs text-gray-500">
                      {topic.percent}%
                    </span>
                  )}
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 transition-all duration-300 rounded-full"
                    style={{
                      backgroundColor: COLORS[i % COLORS.length],
                      width: `${topic.percent}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Tashriflar bo’yicha trafik */}
        <div className="p-6 bg-[#F7F9FB] shadow md:col-span-2 xl:col-span-2 rounded-2xl">
          <h3 className="mb-4 text-lg font-semibold">
            Tashriflar bo’yicha trafik
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="traffic" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Jami savdo */}
        <div className="p-6 bg-[#F7F9FB] shadow rounded-2xl">
          <h3 className="mb-4 text-lg font-semibold">Jami savdo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {salesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 text-[18px] font-medium text-start">
            {salesData.map((entry, index) => (
              <div key={index} className="mb-2">
                <strong>{entry.name}:</strong> ${entry.value.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;

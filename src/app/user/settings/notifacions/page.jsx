import React from "react";

function Notifications({ settings, toggleSetting }) {
  return (
    <div>
      {" "}
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Bildirishnoma sozlamalari
        </h2>
        <div className="space-y-3">
          {[
            { key: "fikrJavoblar", label: "Fikrlarimga javoblar" },
            { key: "sharhBaholari", label: "Sharh baholari" },
            { key: "yangiIzohlar", label: "Xabarlarga yangi izohlar" },
            { key: "yangiObunachilar", label: "Yangi obunachilar" },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 bg-white rounded-lg shadow"
            >
              <span>{label}</span>
              <button
                onClick={() => toggleSetting(key)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                  settings[key] ? "bg-[#50D1F9]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                    settings[key] ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;

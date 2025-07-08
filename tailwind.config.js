// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        "move-right": "moveRight 30s linear infinite", // Yangi animatsiya
      },
      keyframes: {
        moveRight: {
          "0%": { transform: "translateX(-100%)" }, // Chapdan boshlaydi
          "100%": { transform: "translateX(100%)" }, // O‘ngga qarab siljiydi
        },
      },
    },
  },
};

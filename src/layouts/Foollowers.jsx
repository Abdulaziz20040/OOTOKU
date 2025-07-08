"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dinamik import: faqat clientda yuklanadi
const ContentLoader = dynamic(() => import("react-content-loader"), {
  ssr: false,
});

function Followers() {
  const [loading, setLoading] = useState(true);
  const followers = [
    {
      name: "Anime",
      img: "https://i.pinimg.com/736x/74/18/3b/74183b15ad77b23879693ee598e7c829.jpg",
    },
    {
      name: "Freeren",
      img: "https://i.pinimg.com/736x/8b/67/7e/8b677e0898d2f049210f1bbc8d1a4251.jpg",
    },
    {
      name: "Rasmlar",
      img: "https://i.pinimg.com/736x/20/a8/0a/20a80aa30195b014e4d13346d8223bb8.jpg",
    },
    {
      name: "Sanoat",
      img: "https://i.pinimg.com/736x/20/34/19/2034192b19a8a7a6b2b90994c2122c87.jpg",
    },
    {
      name: "Yaponiya",
      img: "https://i.pinimg.com/736x/52/fe/0f/52fe0fbcc8939e69873f89489994d9e5.jpg",
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-[180px]">
      <h1 className="font-bold text-[20px]">Obunalarim</h1>
      <div className="mt-4">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, index) => <SkeletonFollower key={index} />)
          : followers.map((follower, index) => (
              <button key={index} className="flex items-center gap-4 mt-3">
                <img
                  src={follower.img}
                  alt={follower.name}
                  className="w-[35px] h-[35px] rounded-full"
                />
                <p>{follower.name}</p>
              </button>
            ))}
      </div>
    </div>
  );
}

function SkeletonFollower() {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={40}
      viewBox="0 0 180 40"
      backgroundColor="#e0e0e0"
      foregroundColor="#d6d6d6"
      uniqueKey="skeleton-follower"
    >
      <circle cx="20" cy="20" r="18" />
      <rect x="50" y="10" rx="4" ry="4" width="100" height="16" />
    </ContentLoader>
  );
}

export default Followers;

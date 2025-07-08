"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaThumbsDown,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaRegCommentDots,
  FaEllipsisH,
} from "react-icons/fa";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
import { AiFillLike } from "react-icons/ai";

function Posts({ userOnly, usernameFilter }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://otaku.up-it.uz/api/post?limit=100", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const postsArray = res.data?.data || [];

        const transformedData = postsArray
          .map((item) => ({
            id: item._id,
            ownerId: item.owner?._id,
            username: item.owner?.username || "Noma'lum",
            fullName: item.owner?.fullName || "Noma'lum",
            user_img: item.owner?.photo
              ? item.owner.photo.startsWith("http")
                ? item.owner.photo
                : `https://otaku.up-it.uz${item.owner.photo}`
              : null,
            title: item.title,
            caption: item.caption || "",
            content: item.content || "",
            comments: item.comments || [],
            likes_count: item.likes?.length || 0,
            dislikes: item.dislikes || 0,
            date: new Date(item.createdAt).toLocaleDateString("uz-UZ", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          }))
          .filter((post) =>
            userOnly && usernameFilter ? post.username === usernameFilter : true
          );

        setData(transformedData);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Postlarni olishda xatolik:", e);
        setLoading(false);
      });
  }, [userOnly, usernameFilter]);

  return (
    <div className="mt-3 space-y-4">
      {loading
        ? Array(3)
            .fill(0)
            .map((_, index) => <SkeletonPost key={index} />)
        : data.map((item) => <PostCard key={item.id} item={item} />)}
    </div>
  );
}

function SkeletonPost() {
  return (
    <div className="w-full h-auto gap-3 p-4 bg-white shadow-md rounded-2xl">
      <div className="flex items-center gap-3">
        <Skeleton circle width={30} height={30} />
        <Skeleton width={100} height={16} />
        <Skeleton width={60} height={14} />
      </div>
      <div className="mt-4">
        <Skeleton width="75%" height={24} />
        <Skeleton width="100%" height={16} count={2} />
        <Skeleton width="100%" height={250} className="mt-4" />
      </div>
      <div className="flex items-center justify-start gap-6 mt-4">
        <Skeleton width={40} height={16} />
        <Skeleton width={40} height={16} />
        <Skeleton width={40} height={16} />
        <Skeleton width={40} height={16} />
      </div>
    </div>
  );
}

function PostCard({ item }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes_count);

  const extractImageUrl = (html) => {
    const match = html?.match(/<img[^>]+src=["']([^"'>]+)["']/);
    return match ? match[1] : null;
  };

  const getShortText = (html, maxLength = 200) => {
    const text = html?.replace(/<[^>]*>?/gm, "");
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const imageUrl = extractImageUrl(item.content);
  const shortText = getShortText(item.caption || item.content);

  const myUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const goToProfile = () => {
    if (myUserId && myUserId === item.ownerId) {
      router.push("/user/profile");
    } else {
      router.push(`/user/${item.username}`);
    }
  };

  // 🔥 Like bosish funksiyasi
  const handleLike = async () => {
    try {
      await axios.post(
        `https://otaku.up-it.uz/api/post/${item.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // UI ni yangilash
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Like bosishda xatolik:", error);
    }
  };

  return (
    <div className="w-full h-auto gap-3 p-4 bg-white shadow-md rounded-2xl">
      <div className="flex items-center gap-3">
        {item.user_img ? (
          <img
            onClick={goToProfile}
            src={item.user_img}
            alt="Foydalanuvchi rasmi"
            className="w-[30px] h-[30px] rounded-full object-cover cursor-pointer"
          />
        ) : (
          <div
            onClick={goToProfile}
            className="w-[35px] h-[35px] rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase cursor-pointer"
            style={{ backgroundColor: "#4caf50" }}
          >
            {item.fullName?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <p
          className="font-semibold cursor-pointer text-md hover:underline"
          onClick={goToProfile}
        >
          {item.username || "Noma'lum"}
        </p>
        <p className="text-sm text-gray-500">{item.date}</p>
      </div>

      <div className="mt-4">
        <Link href={`/posts/${item.id}`}>
          <h1 className="text-lg font-semibold">{item.title}</h1>
          <p className="mt-2">{shortText}</p>
          {imageUrl && (
            <img
              className="object-cover w-full h-[350px] mt-4 rounded-xl"
              src={imageUrl}
              alt="Post content"
            />
          )}
        </Link>
      </div>

      <div className="flex items-center justify-start gap-6 mt-4 text-gray-600">
        <button
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleLike}
        >
          {liked ? <AiFillLike /> : <FaRegThumbsUp />}
          <p>{likeCount}</p>
        </button>
        <button className="flex items-center gap-1">
          <FaRegThumbsDown />
          <span>{item.dislikes}</span>
        </button>
        <button className="flex items-center gap-1">
          <FaRegCommentDots />
          <span>{Array.isArray(item.comments) ? item.comments.length : 0}</span>
        </button>
        <button>
          <FaEllipsisH />
        </button>
      </div>
    </div>
  );
}

export default Posts;

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  FaHeart,
  FaThumbsDown,
  FaRegCommentDots,
  FaShare,
  FaEllipsisH,
  FaPaperPlane,
  FaRegBookmark,
  FaFlag,
} from "react-icons/fa";
import {
  Avatar,
  Dropdown,
  Menu,
  Input,
  Select,
  Spin,
  Button,
  message,
} from "antd";

export default function PostDetails() {
  const { id: postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [selectedSort, setSelectedSort] = useState("best");

  let username = null;
  if (typeof window !== "undefined") {
    try {
      username = JSON.parse(localStorage.getItem("user"))?.username;
    } catch {
      username = localStorage.getItem("user");
    }
  }

  const moreMenu = (
    <Menu>
      <Menu.Item icon={<FaRegBookmark />}>Saqlash</Menu.Item>
      <Menu.Item icon={<FaFlag />}>Shikoyat qilish</Menu.Item>
      <Menu.Item icon={<FaShare />}>Ulashish</Menu.Item>
    </Menu>
  );

  const fetchPost = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !username || !postId) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `https://otaku.up-it.uz/api/post/${username}/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPost(res.data.data);
      setComments(res.data.data.comments || []);
    } catch (err) {
      message.error("Postni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [username, postId]);

  if (loading) {
    return (
      <div className="mt-20 text-center">
        <Spin size="large" tip="Yuklanmoqda..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl p-4 mx-auto mt-6 rounded-xl">
      {/* Post header */}
      <div className="p-4 mb-4 bg-white shadow-md rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={post.owner?.photo} size={40} />
          <div>
            <p className="font-semibold">{post.owner?.username}</p>
            <p className="text-xs text-gray-500">5 soat oldin</p>
          </div>
        </div>

        <h2 className="mb-1 text-lg font-bold">{post.title}</h2>
        <p className="mb-3 text-sm text-gray-600">{post.location}</p>

        {post.type === "TEXT" && (
          <div
            className="mb-4 prose-sm prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
        {post.type === "IMAGE" && (
          <img
            src={post.caption}
            alt="post"
            className="rounded-md w-full max-h-[500px] object-cover mb-3"
          />
        )}

        {/* Reactions bar */}
        <div className="flex items-center gap-5 mt-3 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1 cursor-pointer">
            <FaHeart /> {post.likes_count || 0}
          </span>
          <span className="flex items-center gap-1 cursor-pointer">
            <FaThumbsDown /> 0
          </span>
          <span className="flex items-center gap-1 cursor-pointer">
            <FaRegCommentDots /> {post.comments_count || 0}
          </span>
          <span className="flex items-center gap-1 cursor-pointer">
            <FaShare />
          </span>
          <Dropdown
            overlay={moreMenu}
            placement="bottomRight"
            trigger={["click"]}
          >
            <span className="ml-auto cursor-pointer">
              <FaEllipsisH />
            </span>
          </Dropdown>
        </div>
      </div>
      {/* Comment input */}
      <div className="flex gap-2 p-2 mb-4 h-[140px] bg-white rounded-md shadow-md">
        <Avatar size="large" src={post.owner?.photo} />
        <div className="flex-1">
          <p className="text-sm font-semibold">{post.owner?.username}</p>
          <Input.TextArea
            placeholder="Fikr yozing"
            autoSize
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            bordered={false}
            className="bg-transparent h-[140px] rounded-[10px]"
          />
        </div>
        <Button
          type="text"
          icon={<FaPaperPlane />}
          className="mt-6 text-gray-500"
        >
          Yuborish
        </Button>
      </div>

      {/* Comment sorting */}
      <div className="mb-2">
        <Select
          defaultValue="best"
          value={selectedSort}
          onChange={(v) => setSelectedSort(v)}
          className="text-sm"
          size="small"
          style={{ width: 180 }}
          options={[
            { label: "Eng yaxshisi birinchi", value: "best" },
            { label: "Eng so‘nggisi birinchi", value: "latest" },
          ]}
        />
      </div>

      {/* Comments */}
      {comments.map((cmt, idx) => (
        <div key={idx} className="flex items-start gap-2 py-3">
          <Avatar size="small" src={cmt.photo || "/user.png"} />
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {cmt.username || "John doe"}
            </p>
            <p className="text-sm text-gray-700">{cmt.text || "Salom"}</p>
            <p className="text-xs text-gray-400">Bugun soat 17:09</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaHeart size={14} /> 2
              </span>
              <span className="flex items-center gap-1">
                <FaThumbsDown size={14} /> 0
              </span>
              <span className="text-sm font-medium cursor-pointer">Javob</span>
              <FaEllipsisH className="ml-auto cursor-pointer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

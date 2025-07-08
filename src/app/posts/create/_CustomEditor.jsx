"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Quote,
  Palette,
  Table,
  Heading,
} from "lucide-react";
import "../../../app/globals.css";

const CustomEditor = ({ onChange, onTitleChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const editorRef = useRef(null);
  const menuRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("Ma'lumot kiriting...");

  useEffect(() => {
    const savedTitle = localStorage.getItem("postTitle");
    const savedContent = localStorage.getItem("editorContent");
    if (savedTitle) setTitle(savedTitle);
    if (savedContent) setContent(savedContent);
  }, []);

  useEffect(() => {
    localStorage.setItem("postTitle", title);
    onTitleChange && onTitleChange(title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem("editorContent", content);
    onChange && onChange(content);
  }, [content]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const clearEditor = () => {
    setContent("Ma'lumot kiriting...");
    localStorage.removeItem("editorContent");
  };

  const formatText = (command, value = null) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
      editorRef.current.focus();
      setContent(editorRef.current.innerHTML);
      setTimeout(() => {
        const elements = editorRef.current.querySelectorAll(
          "p, blockquote, h1, h2, h3, h4, h5, h6, img, table"
        );
        elements.forEach((el) => (el.style.marginBottom = "10px"));
      }, 100);
    }
    setShowMenu(false);
    setShowHeadingMenu(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("https://otaku.up-it.uz/api/upload/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.files || !result.files[0]?.path) {
        throw new Error(result.message || "Rasm yuklashda xatolik");
      }

      const imageUrl = "https://otaku.up-it.uz" + result.files[0].path;

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.className = "h-auto max-w-full mt-2";
      imgElement.alt = "Uploaded image";
      imgElement.style.paddingBottom = "10px";

      if (editorRef.current) {
        editorRef.current.appendChild(imgElement);
        setContent(editorRef.current.innerHTML);
      }

      setShowMenu(false);
      setShowHeadingMenu(false);
    } catch (error) {
      console.error("❌ Rasm yuklashda xatolik:", error.message);
      alert("Rasm yuklanmadi: " + error.message);
    }
  };

  const handleInput = (e) => {
    setContent(e.currentTarget.innerHTML);
  };

  const handleFocus = () => {
    if (!editorRef.current) return;
    if (editorRef.current.innerText === "Ma'lumot kiriting...") {
      editorRef.current.innerText = "";
    }
    editorRef.current.style.borderRadius = "8px";
  };

  const handleBlur = () => {
    if (!editorRef.current.innerText.trim()) {
      editorRef.current.innerText = "Ma'lumot kiriting...";
    }
    editorRef.current.style.backgroundColor = "transparent";
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest(".menu-toggle")
      ) {
        setShowMenu(false);
        setShowHeadingMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mt-6">
      <textarea
        value={title}
        onChange={handleTitleChange}
        placeholder="Sarlavha kiriting"
        className="w-full p-2 mt-4 text-2xl font-semibold rounded outline-none"
      />

      <div className="relative flex items-start w-full gap-2 mt-4">
        <button
          className="z-20 p-2 text-white bg-blue-600 rounded-full shadow-md absolute left-[-28px] bottom-[12px] menu-toggle cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <Plus size={20} />
        </button>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          className="w-full min-h-[120px] border border-gray-300 p-3 focus:outline-none text-lg font-sans overflow-y-auto rounded-md bg-white"
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          Ma'lumot kiriting...
        </div>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute z-30 w-52 bg-white rounded-md shadow-lg top-[100%] left-0 mt-2 p-2 grid grid-cols-1 gap-2 max-h-64 overflow-y-auto cursor-pointer"
          >
            <button onClick={() => formatText("bold")} className="menu-btn">
              <Bold size={16} /> Qalin
            </button>
            <button onClick={() => formatText("italic")} className="menu-btn">
              <Italic size={16} /> Egik
            </button>
            <button
              onClick={() => formatText("underline")}
              className="menu-btn"
            >
              <Underline size={16} /> Tag chiz
            </button>
            <button
              onClick={() => formatText("strikeThrough")}
              className="menu-btn"
            >
              <Strikethrough size={16} /> O‘chirilgan
            </button>
            <button
              onClick={() => formatText("justifyLeft")}
              className="menu-btn"
            >
              <AlignLeft size={16} /> Chapga
            </button>
            <button
              onClick={() => formatText("justifyCenter")}
              className="menu-btn"
            >
              <AlignCenter size={16} /> Markazga
            </button>
            <button
              onClick={() => formatText("justifyRight")}
              className="menu-btn"
            >
              <AlignRight size={16} /> O‘ngga
            </button>
            <button
              onClick={() => formatText("formatBlock", "blockquote")}
              className="menu-btn"
            >
              <Quote size={16} /> Iqtibos
            </button>
            <button
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="menu-btn"
            >
              <Heading size={16} /> Sarlavha
            </button>

            {showHeadingMenu && (
              <div className="flex flex-wrap gap-2 pl-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => formatText("formatBlock", `h${i + 1}`)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    H{i + 1}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                const url = prompt("URL kiriting");
                if (url) formatText("createLink", url);
              }}
              className="menu-btn"
            >
              <Link size={16} /> Link
            </button>
            <label className="relative cursor-pointer menu-btn">
              <Palette size={16} /> Rang
              <input
                type="color"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => formatText("foreColor", e.target.value)}
              />
            </label>
            <label className="cursor-pointer menu-btn">
              <Image size={16} /> Rasm
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <button
              onClick={() =>
                formatText(
                  "insertHTML",
                  "<table border='1' style='width:100%; text-align:center;'><tr><th>#</th><th>Header 1</th><th>Header 2</th></tr><tr><td>1.</td><td>Cell 1</td><td>Cell 2</td></tr><tr><td>2.</td><td>Cell 3</td><td>Cell 4</td></tr></table>"
                )
              }
              className="menu-btn"
            >
              <Table size={16} /> Jadval
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          className="w-[100px] py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Ko'rish
        </button>
        <button
          className="w-[100px] py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600"
          onClick={clearEditor}
        >
          🗑 Tozalash
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-w-full">
            <h2 className="mb-2 text-xl font-bold">{title}</h2>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <button
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
              onClick={() => setShowModal(false)}
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomEditor;

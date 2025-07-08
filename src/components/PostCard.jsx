"use client";
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegCommentDots,
  FaEllipsisH,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ MUHIM QO‘SHIMCHA

function PostCard({ item }) {
  const router = useRouter();

  const extractImageUrl = (html) => {
    if (typeof html !== "string") return null;
    const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/);
    return match ? match[1] : null;
  };

  const getShortText = (html, maxLength = 200) => {
    const text = html.replace(/<[^>]*>?/gm, "");
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const imageUrl = extractImageUrl(item.content);
  const shortText = getShortText(item.caption || item.content);

  return (
    <div className="w-full h-auto gap-3 p-4 mb-6 bg-white shadow-md rounded-2xl">
      <div className="flex items-center gap-3">
        {item.owner?.photo ? (
          <img
            onClick={() => router.push(`/user/${item.owner?.username}`)}
            src={item.owner.photo}
            alt="Foydalanuvchi rasmi"
            className="w-[30px] h-[30px] rounded-full object-cover cursor-pointer"
          />
        ) : (
          <div
            className="w-[35px] h-[35px] rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase"
            style={{ backgroundColor: "#4caf50" }}
          >
            {item.owner?.fullName?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <p
          className="font-semibold cursor-pointer text-md hover:underline"
          onClick={() => router.push(`/user/${item.owner?.username}`)}
        >
          {item.owner?.username || "Noma'lum"}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-4">
        <Link href={`/posts/${item._id}`}>
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
        <button className="flex items-center gap-1 cursor-pointer">
          <FaRegThumbsUp />
          <p>{item.likes_count}</p>
        </button>
        <button className="flex items-center gap-1">
          <FaRegThumbsDown />
          <span>{item.dislikes || 0}</span>
        </button>
        <button className="flex items-center gap-1">
          <FaRegCommentDots />
          <span>{item.comments?.length || 0}</span>
        </button>
        <button>
          <FaEllipsisH />
        </button>
      </div>
    </div>
  );
}

export default PostCard;

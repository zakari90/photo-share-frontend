import { useContext, useEffect, useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import instance from "../config/axios";
import { API_URL, GET_MY_POSTS } from "../config/urls";
import AuthContext from "../context/auth-context";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import type { LikeStatus, PostProps } from "./home";


export default function MyPostsPage() {
  const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
  const [posts, setPosts] = useState<PostProps[] | null>(null);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({});
  const [loading, setLoading] = useState<boolean>(true);

  const auth = useContext(AuthContext);
  const isLoggedIn = Boolean(auth?.token);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [isLoggedIn]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await instance.get(GET_MY_POSTS, {
        headers: { Authorization: auth.token },
      });
      setPosts(res.data);

      if (isLoggedIn) {
        for (const post of res.data) {
          fetchLikeStatus(post._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLikeStatus(postId: string) {
    try {
      const res = await instance.get(`/posts/${postId}/like-count`, {
        headers: { Authorization: auth.token },
      });
      setLikeStatus((prev) => ({
        ...prev,
        [postId]: {
          count: res.data.likes,
          userLiked: res.data.userLiked,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch like status", error);
    }
  }

  async function handleLike(postId: string) {
    try {
      await instance.put(`/posts/${postId}/like`, null, {
        headers: { Authorization: auth.token },
      });
      fetchLikeStatus(postId);
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  }

  function handleEdit(post: PostProps) {
    setSelectedPost(post);
    setEditTitle(post.title || "");
    setEditDescription(post.description || "");
  }

  async function handleDelete(postId: string) {
    try {
      await instance.delete(`/posts/${postId}/delete`, {
        headers: { Authorization: auth.token },
      });
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }

  function handleCancel() {
    setSelectedPost(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function handleSave() {
    try {
      await instance.put(
        `/posts/${selectedPost?._id}/update`,
        {
          title: editTitle,
          description: editDescription,
        },
        {
          headers: { Authorization: auth.token },
        }
      );

      handleCancel();
      fetchPosts();
    } catch (error) {
      console.error("Failed to update post", error);
    }
  }

  return (
    <>
      {loading && (
        <p className="text-center text-white text-lg mt-10">Loading posts...</p>
      )}

     <div className="relative grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0 m-4">
  {posts ? (
    posts.map((post) => (
      <div
        key={post._id}
        className="relative rounded-xl group w-full h-64 overflow-hidden bg-amber-300 cursor-pointer"
      >
        <BiEdit
          className="absolute top-4 left-2 text-blue-500 text-2xl cursor-pointer z-10"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(post);
          }}
        />

        <MdDelete
          className="absolute top-4 right-2 text-red-500 text-2xl cursor-pointer z-10"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(post._id);
          }}
        />

        <img
          src={API_URL + post.imageUrl}
          alt={post.description || "Photo"}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        {isLoggedIn && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleLike(post._id);
            }}
            className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-full px-3 py-1 flex items-center gap-1 text-white cursor-pointer hover:scale-110 transition-transform z-10"
          >
            <BsHeartFill
              className={`text-lg ${
                likeStatus[post._id]?.userLiked
                  ? "text-blue-500"
                  : "text-gray-400"
              }`}
            />
            <span className="text-sm">
              {likeStatus[post._id]?.count ?? 0}
            </span>
          </div>
        )}
      </div>
    ))
  ) : (
    <p className="text-center text-white text-lg mt-10">
      No posts available.
    </p>
  )}
</div>

{selectedPost && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-auto p-4"
    onClick={handleCancel}
  >
    <div
      className="relative w-full max-w-xl bg-transparent"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={API_URL + selectedPost.imageUrl}
        alt={selectedPost.description || "Full image"}
        className="w-full max-h-[50vh] rounded-md object-contain mx-auto"
      />

      <div className="text-white mt-4 text-center overflow-auto max-h-[30vh]">
        <input
          type="text"
          className="bg-black text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <textarea
          className="bg-black text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </div>

      <div className="mt-4 flex justify-between w-1/2 m-auto">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={handleCancel}
        className="absolute top-2 right-2 text-white text-2xl font-bold"
      >
        ✕
      </button>
    </div>
  </div>
)}

    </>
  );
}

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
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useContext(AuthContext);
  const isLoggedIn = Boolean(auth?.token);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [isLoggedIn]);

  useEffect(() => {
    if (newImage) {
      const previewUrl = URL.createObjectURL(newImage);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  }, [newImage]);

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
    const currentStatus = likeStatus[postId]?.userLiked;

    try {
      await instance.put(`/posts/${postId}/like`, null, {
        headers: { Authorization: auth.token },
      });

      setLikeStatus((prev) => ({
        ...prev,
        [postId]: {
          count: prev[postId]?.count + (currentStatus ? -1 : 1),
          userLiked: !currentStatus,
        },
      }));
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  }

  function handleEdit(post: PostProps) {
    setSelectedPost(post);
    setEditTitle(post.title || "");
    setEditDescription(post.description || "");
    setNewImage(null);
    setErrorMessage("");
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
    setNewImage(null);
    setImagePreview(null);
    setErrorMessage(""); 
  }

  async function handleSave() {
    if (editTitle==="") {
      setErrorMessage("Title cannot be empty.");
      return;
    }
    if (editDescription==="") {
      setErrorMessage(" description cannot be empty.");
      return;
    }

    try {      
      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);

        const uploadRes = await instance.put(`/posts/${selectedPost?._id}/update-post-image`, 
          formData, {
          headers: {
            "Authorization": auth.token,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(uploadRes);
      }

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
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 rounded-full text-blue-500"></div>
        </div>
      )}

      <div className="relative grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 m-4">
        {posts ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="relative rounded-xl group w-full h-64 overflow-hidden bg-blue-100 cursor-pointer"
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

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={post.description || "Photo"}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <img
                  src={API_URL + post.imageUrl}
                  alt={post.description || "Photo"}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              )}

              {isLoggedIn && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post._id);
                  }}
                  className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-full px-3 py-1 flex items-center gap-1 text-white cursor-pointer hover:scale-110 transition-transform z-10"
                >
                  <BsHeartFill
                    className={`text-lg ${likeStatus[post._id]?.userLiked ? "text-blue-500" : "text-gray-400"}`}
                  />
                  <span className="text-sm">
                    {likeStatus[post._id]?.count ?? 0}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-white text-lg mt-10">No posts available.</p>
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
              src={imagePreview|| API_URL + selectedPost.imageUrl}
              alt={selectedPost.description || "Full image"}
              className="w-full max-h-[50vh] rounded-md object-contain mx-auto"
            />

            <div className="text-white mt-4 text-center overflow-auto max-h-[30vh]">
              <input
                type="text"
                className="bg-black text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                className="bg-black text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
              />
              <input
                type="file"
                accept="image/*"
                className="bg-black text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
            )}

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
          </div>
        </div>
      )}
    </>
  );
}

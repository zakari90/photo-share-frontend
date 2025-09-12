import { useContext, useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsHeartFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import instance from "../config/axios";
import { API_URL, GET_MY_POSTS } from "../config/urls";
import AuthContext from "../context/auth-context";
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
<div role="status" className="flex justify-center items-center mt-10">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
      )}

      <div className="relative grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 m-4">
        {posts && posts.length === 0 ?
  (
      <div className="col-span-full">
        <img 
        src="/no-post.png" 
        alt="No posts" className="mx-auto mt-10 w-32 opacity-50" />

      <p className="text-center text-lg mt-10">No posts to show.</p>

      </div>
  ) : (
          posts?.map((post) => (
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
        ) }
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

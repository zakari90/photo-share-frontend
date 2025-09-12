import { useContext, useEffect, useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import instance from "../config/axios";
import { API_URL, GET_ALL_POSTS } from "../config/urls";
import AuthContext from "../context/auth-context";
import { Commet } from "react-loading-indicators";

export type PostProps = {
  _id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  creator: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type LikeStatus = {
  [postId: string]: {
    count: number;
    userLiked: boolean;
  };
};

export default function HomePage() {
  const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
  const [posts, setPosts] = useState<PostProps[] | null>(null);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({});
  const [loading, setLoading] = useState<boolean>(true);

  const auth = useContext(AuthContext);
  const isLoggedIn = Boolean(auth?.token);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await instance.get(GET_ALL_POSTS);
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

    fetchPosts();
  }, [isLoggedIn]);


  async function fetchLikeStatus(postId: string) {
    try {
      const res = await instance.get(`/posts/${postId}/like-count`,
                {headers: { Authorization: auth.token }}

      );
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
      await instance.put(`/posts/${postId}/like`,null,
        {headers: { Authorization: auth.token }}
      );
      fetchLikeStatus(postId);
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  }

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-96">
<Commet color="#89acf3" size="medium" text="" textColor="" />        </div>
)}

 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 m-4">
  {posts ? (
    posts.map((post) => (
      <div
        key={post._id}
        className="cursor-pointer group relative w-full h-full"
        onClick={() => setSelectedPost(post)}
      >
        <div className="relative w-full h-64 overflow-hidden rounded-xl bg-blue-100">
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
              className="absolute bottom-4 left-4 bg-black bg-opacity-60 rounded-full px-3 py-1 flex items-center gap-1 text-white cursor-pointer hover:scale-110 transition-transform"
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
      </div>
    ))
  ) : (
    <div>
      {loading ? null : 
      (
      <div className="col-span-full">
        <img 
        src="/no-post.png" 
        alt="No posts" className="mx-auto mt-10 w-32 opacity-50" />

      <p className="text-center text-lg mt-10">No posts available.</p>

      </div>
      
      
      )}

    </div>
  )}
</div>

{selectedPost && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-auto p-4"
    onClick={() => setSelectedPost(null)}
  >
    <div
      className="relative max-w-xl w-full bg-transparent"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={API_URL + selectedPost.imageUrl}
        alt={selectedPost.description || "Full image"}
        className="w-full max-h-[80vh] rounded-md object-contain mx-auto"
      />

      <div className="text-white mt-4 text-center overflow-auto max-h-[20vh]">
        {selectedPost.title && (
          <p className="text-lg font-semibold">{selectedPost.title}</p>
        )}
        {selectedPost.description && (
          <p className="text-sm mt-1">{selectedPost.description}</p>
        )}
        {selectedPost.creator?.username && (
          <p className="text-xs text-gray-400 mt-2">
            by {selectedPost.creator.username}
          </p>
        )}
      </div>

    </div>
  </div>
)}

    </>
  );
}

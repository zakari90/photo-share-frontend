import { useContext, useEffect, useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import instance from "../config/axios";
import { API_URL, GET_ALL_POSTS } from "../config/urls";
import AuthContext from "../context/auth-context";

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
<div role="status" className="flex justify-center items-center mt-10">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
)}

 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 m-4">
  {posts && posts.length === 0 ?
  (
      <div className="col-span-full">
        <img 
        src="/no-post.png" 
        alt="No posts" className="mx-auto mt-10 w-32 opacity-50" />

      <p className="text-center text-lg mt-10">No posts to show.</p>

      </div>
  )
  : (
    posts?.map((post) => (
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
  ) }
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

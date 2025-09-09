import { useEffect, useState } from "react";
import instance from "../config/axios";
import { GET_ALL_POSTS } from "../config/urls";

export type ImageProps={
  id:string;
  url:string;
  description?:string;
  userId:string;
  createdAt:Date;
  updatedAt:Date;
  likes?:[]
}

const images: ImageProps[]=[
  {
    id:"1",
    url:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description:"A beautiful sunrise",
    userId:"user1",
    createdAt:new Date(),
    updatedAt:new Date(),
  },
  {
    id:"2",
    url:"https://images.unsplash.com/photo-1500534623283-312aade485b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description:"Mountain landscape",
    userId:"user2",
    createdAt:new Date(),
    updatedAt:new Date(),
  },
  {
    id:"3",
    url:"https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description:"City skyline at night",
    userId:"user3",
    createdAt:new Date(),
    updatedAt:new Date(),
  }
]
export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [posts, setPosts] = useState<any[] | null>(null);
  
useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await instance.get(GET_ALL_POSTS);
        setPosts(res.data);  // assuming res.data is an array of posts
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    }

    fetchPosts();
  }, []);

  console.log(posts[0]._id);
  console.log(posts[0].creator.username);
  console.log(posts[0].description);
  console.log(posts[0].imageUrl);
  console.log(posts[0].title);
  
  return (
<>
<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0 m-4 ">
  {images.map((image) => (
    <div
      key={image.id}
      className="cursor-pointer"
      onClick={() => setSelectedImage(image)}
    >
      <img
        src={image.url}
        alt={image.description || "Photo"}
        className="w-full h-auto transition-transform duration-200 hover:scale-105"
      />
    </div>
  ))}
</div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full px-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.description || "Full image"}
              className="w-full h-auto rounded-md object-contain"
            />
            {selectedImage.description && (
              <p className="text-white mt-4 text-center">
                {selectedImage.description}
              </p>
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}

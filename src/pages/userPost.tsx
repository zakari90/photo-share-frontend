import { useState } from "react";

export type ImageProps={
  id:string;
  title?:string;
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
    title:"title",
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
export default function UserPage() {
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  return (
<>
<div className="grid grid-cols-2 md:grid-cols-4 gap-0">
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
          className="fixed inset-0  m-auto bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <div className="relative max-w-4xl w-full px-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.description || "Full image"}
              className="w-full h-auto rounded-md object-contain"
            />
            <div className="md:w-1/2 m-auto">

            {selectedImage.description && (
              <>
              <input type="text"
                      className="text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={selectedImage.title}/>
                              <textarea 
                      className="text-white mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={selectedImage.description}
                      /> 
              </>
            )}
            <div className="m-auto mt-2 flex justify-between w-1/2">

            <button
              onClick={() => setSelectedImage(null)}
          className="m-auto bg-red-500 text-white px-4 py-2 rounded-md w-fit"
            >
              save
            </button>
            <button
              onClick={() => setSelectedImage(null)}
          className="m-auto bg-blue-500 text-white px-4 py-2 rounded-md w-fit"
            >
              cancel
            </button>
            </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

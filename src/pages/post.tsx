import React, { useState } from 'react'

function NewPost() {
      const [isPending, setIsPending] = useState(false);
      const [fileName, setFileName] = useState('No file selected');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : 'No file selected');
  };
  return (
    <div className="bg-white flex flex-col gap-4 p-8 rounded-lg shadow-md w-96">
        <h1 className=''>New Post</h1>
        <input type="text"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder='Title' />
        <textarea 
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder='Description'
        /> 

    <div className=" flex flex-col items-start space-y-2">
      <label
        htmlFor="file-upload"
        className="m-auto cursor-pointer inline-block bg-yellow-200 text-black px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 491.601 491.601" xml:space="preserve">
<g>
	<path d="M463.1,175.45c-14-14.3-31.5-24-50.7-28.1c-4.9-37.4-22.1-71.9-49.4-98.6c-31.7-30.9-73.6-48-117.9-48s-86.2,17-117.9,48
		c-27.4,26.8-44.6,61.4-49.5,98.9c-44.8,10.4-77.7,50.4-77.7,98c0,55.5,45.1,100.6,100.6,100.6h124.8v124.2
		c0,10.7,9.7,20.4,20.4,20.4c10.7,0,20.4-8.6,20.4-20.4v-124.2H391c55.5,0,100.6-45.1,100.6-100.6
		C491.7,219.25,481.5,194.25,463.1,175.45z M391.1,305.25H266.3v-81.6l27.9,26.7c8.6,7.5,21.5,7.5,29-1.1s7.5-21.5-1.1-29
		l-62.2-60.2c-13.5-10.4-23.6-3.2-27.9,0l-62.3,60.1c-8.6,7.5-8.6,20.4-1.1,29s20.4,8.6,29,1.1l27.9-26.7v81.6H100.7
		c-32.9,0-59.6-26.7-59.6-59.6c0-31.9,24.9-58.1,56.8-59.5c10.7-0.5,19.3-9.2,19.5-20c1.8-69.8,57.9-124.4,127.7-124.4
		s125.9,54.6,127.7,124.4c0.3,10.9,9,19.7,19.9,20c32.5,0.9,57.9,27.1,57.9,59.6C450.7,278.45,423.9,305.25,391.1,305.25z"/>
</g>
</svg>
        {/* Upload File */}
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <p className="m-auto text-sm text-gray-600">{fileName}</p>
    </div>
   <button
          disabled={isPending}
          type="submit"
          className="m-auto bg-blue-500 text-white px-4 py-2 rounded-md w-fit"
        >
          {isPending ? "Loading..." : "submit"}
        </button>    
        </div>
  )
}

export default NewPost
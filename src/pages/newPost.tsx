import { useState, useContext } from 'react';
import { BiUpload } from 'react-icons/bi';
import instance from '../config/axios';
import AuthContext from '../context/auth-context';
import { CREATE_POST } from '../config/urls';

function NewPost() {
  const [isPending, setIsPending] = useState(false);
  const [fileName, setFileName] = useState('No file selected');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const auth = useContext(AuthContext);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setPreviewImage(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setFileName('No file selected');
      setPreviewImage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !file) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', file); // 'image' must match your backend field name

      const response = await instance.post(CREATE_POST, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: auth.token,
        },
      });

      console.log('Upload successful:', response.data);
      alert('Post uploaded successfully!');

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setFileName('No file selected');
      setPreviewImage('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload post.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blue-50 m-auto flex flex-col gap-4 p-8 rounded-lg shadow-md w-full max-w-md mt-8"
    >
      <h1 className="text-2xl text-center font-bold text-blue-600">New Post</h1>

      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Title"
        required
      />

      {/* Description Textarea */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Description"
        rows={4}
        required
      />

      {/* File Upload */}
      <div className="flex flex-col items-center gap-2">
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center gap-2 bg-yellow-200 text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition"
        >
          <BiUpload className="text-xl" />
          Upload Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          required
        />
        <p className="text-sm text-gray-600">{fileName}</p>

        {/* Image Preview */}
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md mt-2 border border-gray-300"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        disabled={isPending || !file}
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-md w-fit mx-auto hover:bg-blue-600 transition disabled:opacity-50"
      >
        {isPending ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
}

export default NewPost;

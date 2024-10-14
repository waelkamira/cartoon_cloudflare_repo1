'use client';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { inputsContext } from './Context';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';

export default function UploadingAndDisplayingImage({ img }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { dispatch, imageError } = useContext(inputsContext);

  useEffect(() => {
    handleUpload();
  }, [selectedFile]);
  // Handle file input change
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/uploadImageToImgur', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setUploadedImage(data?.data?.link);
        dispatch({ type: 'IMAGE', payload: data?.data?.link });
      } else {
        console.error('Error uploading image:', data.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="relative flex justify-center items-center w-full h-72 sm:h-96 text-center border rounded-lg">
      <div className="absolute top-0 left-0 flex flex-col justify-center items-center text-white z-50 w-full">
        <input type="file" id="file-upload" onChange={onFileChange} />
        <input
          type="file"
          id="file-upload"
          onChange={onFileChange}
          className="flex justify-center items-center w-96 h-72 sm:h-96 border-2 text-center border-one rounded-lg placeholder:text-white "
        />
        {imageError?.imageError && (
          <h1 className=" text-one text-2xl text-center my-2 w-full animate-bounce font-bold mt-8">
            {imageError?.message}
          </h1>
        )}
      </div>
      <div className="absolute top-0 mx-auto w-full h-72 sm:h-96 border-2 border-one rounded-lg overflow-hidden z-20 ">
        <div class="absolute top-0 left-0 custom-file-upload w-full h-full">
          <div className="flex flex-col justify-center items-center size-full ">
            <label
              for="file-upload"
              class="absolute top-0 size-full cursor-pointer"
            ></label>
            <MdOutlineAddPhotoAlternate className="text-one text-3xl" />
            <h1 className="text-white text-sm sm:text-xl"> أضف صورة </h1>
          </div>
        </div>

        {img && !uploadedImage && (
          <div className="w-full h-72 sm:h-96 border rounded-lg">
            <Image
              priority
              src={img}
              alt="Uploaded"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        {uploadedImage && (
          <div className="relative w-full h-72 sm:h-96">
            <Image
              priority
              src={uploadedImage}
              alt="Uploaded"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

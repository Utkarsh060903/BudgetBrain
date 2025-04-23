import React, { useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
          <FaUserCircle className="text-4xl text-blue-700" />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-blue-700 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
          >
            <IoMdCloudUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={previewUrl}
            alt="profile photo"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={handleRemoveImage}
          >
            <MdDelete />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
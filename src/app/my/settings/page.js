"use client";
import BASE_URL from "@/app/config";
import { updateUser } from "@/redux/user/userReducer";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
      setImagePreview(currentUser.image);
    }
  }, [currentUser]);

  const handleImageClick = () => {
    if (isEdit) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const id = currentUser._id;
  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (imageFile) data.append("image", imageFile);

      // console.log("Submitting:", Object.fromEntries(data));

      const res = await axios.put(`${BASE_URL}/api/user/${id}`, data);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateUser(res.data.user))
      }
      setIsEdit(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        {!isEdit ? (
          <button
            onClick={() => setIsEdit(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Image Section */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src={imagePreview}
            alt="profile"
            onClick={handleImageClick}
            className={`w-28 h-28 rounded-full object-cover border 
              ${isEdit ? "cursor-pointer hover:opacity-80" : ""}`}
          />

          {isEdit && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Click image to change
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Name</label>
          {isEdit ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          ) : (
            <p className="text-lg font-medium">{currentUser.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          {isEdit ? (
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          ) : (
            <p className="text-lg font-medium">{currentUser.email}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-500">Role</label>
          <p className="text-lg font-medium capitalize">
            {currentUser.role}
          </p>
        </div>
           {/* Last Login */}
        <div>
          <label className="text-sm text-gray-500">Last Login</label>
          <p className="text-lg font-medium">
            {new Date(currentUser.lastLogin).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


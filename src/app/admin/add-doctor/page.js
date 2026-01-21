"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    fee: "",
    details: "",
    password: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const image = e.target.files[0];
    if(image){
        setPreview(URL.createObjectURL(image));
        setImage(image);
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // append text fields
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("specialty", form.specialty);
    formData.append("experience", form.experience);
    formData.append("fee", form.fee);
    formData.append("details", form.details);
    formData.append('password', form.password)

    // append image
    formData.append("image", image);

    const res = await axios.post(
      "https://jhc-backend-main.vercel.app/api/doctor/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setForm({
       name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    fee: "",
    details: "",
    password: ""
    })
    toast.success("Doctor added successfully");
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Failed to add doctor"
    );
  }
};

  return (
    <div className="flex bg-blue-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar title="Add Doctor" />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">Doctor Information</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium mb-1">Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>

              {/* Fee */}
              <div>
                <label className="block text-sm font-medium mb-1">Consultation Fee</label>
                <input
                  type="number"
                  name="fee"
                  value={form.fee}
                  onChange={handleChange}
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>

              {/* Image */}
              <div >
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              {/* Passowrd */}
              <div >
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Details</label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="input border-2 border-gray-300 p-2 rounded-md w-full"
                />
              </div>
{preview && (
  <img src={preview} className="h-24 mt-2 rounded-lg" />
)}
              {/* Submit */}
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

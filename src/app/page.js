"use client";
import Link from "next/link";
import { useState } from "react";
import './globals.css'
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/redux/user/userReducer";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { socket } from "./socket";
export default function Home() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const router = useRouter();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://jhc-backend-main.vercel.app/api/user/login', form);
      localStorage.setItem('token', res.data.token);
      if (res.data.success) {
        socket.auth = {
    token: res.data.token,
  };
  socket.connect();
        dispatch(signInSuccess(res.data.user));
        toast.success('Login successfully');
        const role = res.data.user.role;

       if (role === "admin") {
          router.push("/admin/dashboard");
        } else if (role === "patient") {
          router.push("/my/dashboard");
        } else if (role === "doctor") {
          router.push("/doctor/dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  const adminLogin = () => {
    setForm({email: 'jhonsmith@gmail.com', password: 'jhonsmith'});
  }
  const userLogin = () => {
    setForm({email: 'egs31322@gmail.com', password: 'egs31322'});
  }
  const docotrLogin = () => {
    setForm({email: 'dr.demetriuswright@gmail.com', password: 'dr.demetriuswright'});
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4ff]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-[#1e293b] mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
        <div className="mt-4 flex justify-between">
          <button onClick={adminLogin} className="bg-black px-4 p-2 rounded-full cursor-pointer text-white hover:bg-gray-800 transition duration-300">
            Admin Login
          </button>
          <button onClick={userLogin} className="border-[1px] border-black text-black px-4 p-2 rounded-full cursor-pointer hover:bg-black hover:text-white transition duration-300">
            User Login
          </button>
          <button onClick={docotrLogin} className="bg-black px-4 p-2 rounded-full cursor-pointer text-white hover:bg-gray-800 transition duration-300">
            Doctor Login
          </button>
        </div>
      </div>
    </div>
  );
}

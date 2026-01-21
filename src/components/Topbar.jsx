"use client";
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Topbar({title}) {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className="flex justify-between items-center p-4 bg-white">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center space-x-4">
        <FaBell className="text-gray-500 text-lg" />
        <div className="flex items-center space-x-3">
          <img
            src={currentUser?.image}
            alt="user"
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import BASE_URL from "@/app/config";
import axios from "axios";
import { useState } from "react";
import { FaSearch, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

//   name: [
//     "Elizabeth Polson",
//     "John David",
//     "Krishtav Rajan",
//     "Sumanth Tinson",
//     "EG Subramani",
//     "Ranjan Maari",
//     "Philiplie Gopal",
//   ][i % 7],
//   age: [32, 28, 24, 26, 77, 77, 55][i % 7],
//   gender: ["Female", "Male", "Male", "Male", "Male", "Male", "Male"][i % 7],
//   blood: ["B+ve", "B+ve", "AB-ve", "O+ve", "AB+ve", "O+ve", "O-ve"][i % 7],
//   phone: "+91 12345 67890",
//   email: [
//     "elsabethpolson@hotmail.com",
//     "davidjohn22@gmail.com",
//     "krishnarajan23@gmail.com",
//     "tintintin@gmail.com",
//     "egs31322@gmail.com",
//     "ranjanmaari@yahoo.com",
//     "gopal22@gmail.com",
//   ][i % 7],
// }));

export default function PatientTable({allPatients, onDeletePatient }) {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(allPatients.length / perPage);
  const start = (currentPage - 1) * perPage;
  const currentPatients = allPatients.slice(start, start + perPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePageClick = (n) => setCurrentPage(n);

  const deletePatient = async(id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/patient/${id}`);
      if (res.data.success) {
        toast.success('patient removed');
        onDeletePatient(id);
      }
    } catch (error) {
      toast.error(error.response.data.message || 'error deleting user');
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Patient Info</h2>
        </div>
        <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          + New Patient
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <button className="border-b-2 border-blue-500 text-blue-600 pb-2 px-1 text-sm font-medium">
          All Patients
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-6">
        <div className="flex items-center bg-gray-100 px-3 rounded-lg w-64">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none py-2 text-sm w-full"
          />
        </div>

        <button className="flex items-center border border-gray-300 px-3 py-2 rounded-lg text-sm text-gray-600 hover:border-blue-400">
          <FaCalendarAlt className="mr-2 text-blue-500" /> Filter by Date
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3">Patient Name</th>
              <th className="pb-3">Age</th>
              <th className="pb-3">Gender</th>
              <th className="pb-3">Blood Group</th>
              <th className="pb-3">Phone Number</th>
              <th className="pb-3">Email ID</th>
              <th className="pb-3">User Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((p, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 flex items-center space-x-2">
                  <img
                    src={p?.user?.image}
                    alt="avatar"
                    className="rounded-full"
                    width={30}
                  />
                  <span>{p?.user?.name}</span>
                </td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.bloodGroup}</td>
                <td>{p.phone}</td>
                <td>{p?.user?.email}</td>
                <td className="flex items-center space-x-3">
                  <button className="bg-blue-100 text-blue-500 p-1.5 rounded-md hover:bg-blue-200">
                    ⓘ
                  </button>
                  <button onClick={() => deletePatient(p._id)} className="bg-red-100 text-red-500 p-1.5 rounded-md hover:bg-red-200">
                    <FaTimes size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 space-x-3 text-sm text-gray-500">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-blue-500"
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageClick(i + 1)}
            className={`px-2 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "hover:text-blue-500"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-blue-500"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

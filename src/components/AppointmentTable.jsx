import BASE_URL from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


export default function AppointmentTable({appointments}) {
  const [list, setList] = useState([]);
  const {currentUser} = useSelector((state) => state.user);
    useEffect(() => {
      setList(appointments);
    }, [appointments]);

  const handleChangeStatus = async(value, id) => {
    setList((prev) => prev.map((a => a._id === id ? {...a, status: value} : a)));
    const token = localStorage.getItem('token');
    const update = await axios.patch(`${BASE_URL}/api/appointment/${id}/status`, {status: value}, {
      headers: {
        Authorization:`Bearer ${token}`
      }
    });
    if (update.data.success) {
      toast.success('Appoitnemnt Updated')
    }
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-6">
          <button className="border-b-2 border-blue-500 text-blue-600 pb-1 font-medium">New Appointments</button>
          <button className="text-gray-500 hover:text-blue-500 transition">Completed Appointments</button>
        </div>

        <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          + New Appointment
        </button>
      </div>

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

      <table className="w-full text-sm text-gray-600">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-3">Time</th>
            <th className="pb-3">Date</th>
            <th className="pb-3">Patient Name</th>
            <th className="pb-3">Patient Age</th>
            <th className="pb-3">Doctor</th>
            <th className="pb-3">Status</th>
            {currentUser.role !== 'patient' && <th className="pb-3">User Action</th>}
            
          </tr>
        </thead>
        <tbody>
          {list?.map((a, i) => (
            <tr key={i} className="border-b hover:bg-gray-50 transition">
              <td className="py-3">{a.time}</td>
              <td>{new Date(a.date).toLocaleDateString()}</td>
              <td className="flex items-center space-x-2 my-1">
                <img src={a?.patient?.image} alt="avatar" width={40} className="rounded-full" />
                <span>{a.patient.name}</span>
              </td>
              <td>{a?.patientProfile?.age || 'N/A'}</td>
              <td>{a.doctor.user.name}</td>
              <td>
                {
                  currentUser.role === 'patient' ? (
                    a.status
                  ) : (
                    <select
                      value={a.status || "pending"}
                      onChange={(e) => handleChangeStatus(e.target.value, a._id)}
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="cancelled">cancelled</option>
                  <option value="completed">completed</option>
                </select>
                  )
                }
                
              </td>
              {currentUser.role !== 'patient' && <td>
                <button className="text-blue-500 hover:underline mr-3">Reschedule</button>
                <button className="bg-red-100 text-red-500 p-1.5 rounded-md hover:bg-red-200">
                  <FaTimes size={12} />
                </button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end items-center mt-6 space-x-3 text-sm text-gray-500">
        <button>Previous</button>
        <div className="bg-blue-500 text-white px-2 py-1 rounded-md">1</div>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>Next</button>
      </div>
    </div>
  );
}

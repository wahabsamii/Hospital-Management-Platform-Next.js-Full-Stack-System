import BASE_URL from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function DoctorAppointmentTable({ appointments }) {
  const [list, setList] = useState([]);
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
      <h2 className="text-lg font-semibold mb-4">My Appointments</h2>

      <table className="w-full text-sm text-gray-600">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-3">Time</th>
            <th className="pb-3">Date</th>
            <th className="pb-3">Patient</th>
            <th className="pb-3">Age</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Payment</th>
            <th className="pb-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {list?.map((a) => (
            <tr key={a._id} className="border-b hover:bg-gray-50">
              <td className="py-3">{a.time}</td>

              <td>{new Date(a.date).toLocaleDateString()}</td>

              <td className="flex items-center gap-2">
                <img
                  src={a.patient?.image}
                  alt="patient"
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {a.patient?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {a.patient?.email}
                  </p>
                </div>
              </td>

              <td>{a.patientProfile?.age}</td>

              <td>
                <select
                      value={a.status || "pending"}
                      onChange={(e) => handleChangeStatus(e.target.value, a._id)}
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="cancelled">cancelled</option>
                  <option value="completed">completed</option>
                </select>
              </td>

              <td>
                {
                  a.paymentStatus
                }
              </td>

              <td>
                <button className="bg-red-100 text-red-500 p-1.5 rounded-md hover:bg-red-200">
                  <FaTimes size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

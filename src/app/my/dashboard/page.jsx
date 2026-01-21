"use client";

import { IoCalendar } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { GiProfit, GiTestTubes } from "react-icons/gi";
import { FaDollarSign } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "@/app/config";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";

export default function Page() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false)
  const pending = appointments.filter((a) => a.status === 'pending');
  const approved = appointments.filter((a) => a.status === 'approved');
  const totalSpent = appointments.reduce((acc, item) => acc + item.fee, 0);
  const token = localStorage.getItem('token');

  const getAllApp = async() => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/appointment/my`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setAppointments(res.data.appointments);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  };

  useEffect(() => {
    getAllApp();
  }, []);

  if (loading) {
    return(
      <div className="min-h-[80vh] flex justify-center items-center">
        <TailSpin color="blue"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-6">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Appointments"
            value={appointments.length}
            icon={<IoCalendar size={22} />}
            color="bg-blue-100 text-blue-600"
          />

          <DashboardCard
            title="Approved Appointments"
            value={approved.length}
            icon={<FaRegUser size={22} />}
            color="bg-green-100 text-green-600"
          />

          <DashboardCard
            title="Pending Appointments"
            value={pending.length}
            icon={<GiProfit size={22} />}
            color="bg-yellow-100 text-yellow-600"
          />

          <DashboardCard
            title="Total Spent"
            value={`$ ${totalSpent}`}
            icon={<FaDollarSign size={22} />}
            color="bg-purple-100 text-purple-600"
          />
        </div>

      </div>
    </div>
  );
}

/* SMALL COMPONENTS */

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

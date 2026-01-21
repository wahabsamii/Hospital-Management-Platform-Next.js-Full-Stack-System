"use client";

import { IoCalendar } from "react-icons/io5";
import { FaRegUser, FaDollarSign} from "react-icons/fa";
import { GiProfit } from "react-icons/gi";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "@/app/config";
import { TailSpin } from "react-loader-spinner";

export default function Page() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState([])
  const docId = currentUser?.profile?._id;
  const [appointments, setAppointments] = useState([]);
  // TEMP data (replace with real Redux/API data)
  const totalEarn = appointments.reduce((acc, item) => acc + item.fee, 0);
  const todaysAppointments = [];
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');

   const getAllApp = async() => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/appointment/doctor`, {id: docId});
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
    <div className="min-h-screen p-6">
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
            title="Today’s Appointments"
            value={todaysAppointments.length}
            icon={<FaRegUser size={22} />}
            color="bg-green-100 text-green-600"
          />

          <DashboardCard
            title="Pending Appointments"
            value={pendingAppointments.length}
            icon={<GiProfit size={22} />}
            color="bg-yellow-100 text-yellow-600"
          />

          <DashboardCard
            title="Total Earning"
            value={`$ ${totalEarn}`}
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

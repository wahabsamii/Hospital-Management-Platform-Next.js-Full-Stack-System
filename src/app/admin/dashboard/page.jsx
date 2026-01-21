"use client";

import { IoCalendar } from "react-icons/io5";
import { FaDollarSign, FaRegUser } from "react-icons/fa";
import { GiProfit, GiTestTubes } from "react-icons/gi";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/app/config";
import { TailSpin } from "react-loader-spinner";


export default function DashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [latestApt, setLatestApt] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalEarn = appointments.reduce((acc, item) => acc + item.fee, 0);
  const fetchAll = useCallback(async () => {
    setLoading(true)
    const res = await axios.get(`${BASE_URL}/api/appointment/`);
    setAppointments(res.data.appointments);

    const response = await axios.get(`${BASE_URL}/api/appointment/latest?limit=3`);
    setLatestApt(response.data.appointments);
    setLoading(false);
  }, []);


  useEffect(() => {
    fetchAll();
  }, []);

  const today = new Date().toDateString();

  const todaysAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === today
  );

  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  );

  if (loading) {
    return(
      <div className="min-h-[80vh] flex justify-center items-center">
        <TailSpin color="blue"/>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

        <div className="space-y-6">

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DashboardCard
              title="Total Appointments"
              value={appointments.length}
              icon={<IoCalendar />}
              color="bg-blue-100 text-blue-600"
            />
            <DashboardCard
              title="Today’s Appointments"
              value={todaysAppointments.length}
              icon={<FaRegUser />}
              color="bg-green-100 text-green-600"
            />
            <DashboardCard
              title="Pending Appointment"
              value={pendingAppointments.length || "4"}
              icon={<GiProfit />}
              color="bg-yellow-100 text-yellow-600"
            />
            <DashboardCard
              title="Total Earning"
              value={`$ ${totalEarn}`}
              icon={<FaDollarSign />}
              color="bg-purple-100 text-purple-600"
            />
          </div>

          {/* MIDDLE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* TODAY'S APPOINTMENTS */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Latest Appointments</h3>
              <table className="w-full text-sm text-gray-600">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3">Time</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Patient Name</th>
                          <th className="pb-3">Patient Age</th>
                          <th className="pb-3">Doctor</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestApt?.map((a, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50 transition">
                            <td className="py-3">{a.time}</td>
                            <td>{new Date(a.date).toLocaleDateString()}</td>
                            <td className="flex items-center space-x-2 my-1">
                              <img src={a?.patient?.image} alt="avatar" width={40} className="rounded-full" />
                              <span>{a.patient.name}</span>
                            </td>
                            <td>{a?.patientProfile?.age}</td>
                            <td>{a.doctor?.user?.name}</td>
                            <td>{a.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <ActionButton text="New Appointment" />
                <ActionButton text="Add Patient" />
                <ActionButton text="Add Lab Test" />
                <ActionButton text="Pharmacy" />
              </div>
            </div>
          </div>

      </div>
    </div>
  );
}

/* SMALL COMPONENTS */

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({ text }) {
  return (
    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition">
      {text}
    </button>
  );
}

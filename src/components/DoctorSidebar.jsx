"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaCalendarCheck,
  FaUserInjured,
  FaPrescriptionBottleAlt,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaUserMd,
  FaUserCog,
} from "react-icons/fa";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "@/redux/user/userReducer";
import { socket } from "@/app/socket";

export default function DoctorSidebar() {
  const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();
    const Logout = () => {
      socket.disconnect();
      dispatch(signOutSuccess());
      localStorage.removeItem('user'); // if using redux-persist
      localStorage.removeItem('token');
      router.replace('/');
    }

  const menu = [
    { name: "Dashboard", icon: <MdOutlineDashboardCustomize />, path: "/doctor/dashboard" },
    { name: "Appointments", icon: <LuCalendarDays />, path: "/doctor/appointments" },
    { name: "My Patients", icon: <FaUserInjured />, path: "/doctor/patients" },
    { name: "Messages", icon: <FaEnvelope />, path: "/doctor/messages" },
    { name: "Settings", icon: <FaUserCog />, path: "/doctor/settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen flex flex-col justify-between border-r border-gray-200">
      {/* Header */}
      <div>
        <div className="p-6 flex items-center space-x-2 border-b">
          <div className="bg-blue-500 text-white p-2 rounded-md">
            <FaUserMd size={22} />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Doctor Panel</h1>
        </div>

        {/* Menu */}
        <nav className="mt-6">
          {menu.map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={i}
                href={item.path}
                className={`flex items-center space-x-3 px-6 py-3 transition
                  ${
                    isActive
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-6 border-t">
        <div
          onClick={() => Logout()}
          className="flex items-center space-x-3 text-gray-600 cursor-pointer hover:text-red-500"
        >
          <FaSignOutAlt size={18} />
          <span className="text-sm font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
}

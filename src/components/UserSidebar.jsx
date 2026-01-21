"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUserMd,
  FaUsers,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaPills,
  FaGraduationCap,
  FaCalendarCheck,
  FaHome,
  FaUserCog,
} from "react-icons/fa";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "@/redux/user/userReducer";

export default function UserSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const Logout = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem('persist:root'); // if using redux-persist
    localStorage.removeItem('token');
    router.replace('/');
  }

  const menu = [
    { name: "Dashboard", icon: <MdOutlineDashboardCustomize />, path: "/my/dashboard" },
    { name: "Appointments", icon: <LuCalendarDays />, path: "/my/appointments" },
    { name: "Book Appointment", icon: <LuCalendarDays />, path: "/my/book-appointment" },
    { name: "Doctors", icon: <FaUserMd />, path: "/my/doctors" },
    { name: "Messages", icon: <FaEnvelope />, path: "/my/messages" },
    { name: "Settings", icon: <FaUserCog />, path: "/my/settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen flex flex-col justify-between border-r border-gray-200">
      {/* Logo / Header */}
      <div>
        <div className="p-6 flex items-center space-x-2 border-b border-gray-100">
          <div className="bg-blue-500 text-white p-2 rounded-md">
            <FaUserMd size={24} />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">JHC Clinic</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {menu.map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={i}
                href={item.path}
                className={`flex items-center space-x-3 px-6 py-3 cursor-pointer hover:bg-blue-50 transition ${
                  isActive
                    ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                    : "text-gray-700"
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
      <div className="p-6 border-t border-gray-100">
        <div onClick={() => Logout()} className="flex items-center space-x-3 text-gray-600 cursor-pointer hover:text-red-500 transition">
          <FaSignOutAlt size={18} />
          <span className="text-sm font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
}

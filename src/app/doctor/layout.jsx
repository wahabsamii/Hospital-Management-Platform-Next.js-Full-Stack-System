import DoctorSidebar from "@/components/DoctorSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Topbar from "@/components/Topbar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute role={'doctor'}>
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Topbar title={'Doctor - Dashboard'}/>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}

import ProtectedRoute from "@/components/ProtectedRoute";
import Topbar from "@/components/Topbar";
import UserSidebar from "@/components/UserSidebar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute role={'patient'}>
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Topbar title={'Patient - Dashboard'}/>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
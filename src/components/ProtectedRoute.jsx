"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, role }) {
  const {currentUser} = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // No user? redirect to home
    if (!currentUser) {
      router.push("/");
    } 
    // Role mismatch? redirect to home
    else if (role && currentUser.role !== role) {
      router.push("/");
    }
  }, [currentUser, router, role]);

  // Show loading while checking
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return (
    <>
      {currentUser && (!role || currentUser.role === role) ? children : null}
    </>
  );
}

import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function AppLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen p-5">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">
          Welcome, {user?.name}
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* 🔥 PAGE CONTENT */}
      <Outlet />
    </div>
  );
}

export default AppLayout;
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("token");
    console.log("Token removed, petugas logged out."); // Debugging (Opsional)

    // Redirect ke halaman login
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-md">
      <h1 className="text-xl text-black font-bold">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-700 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;

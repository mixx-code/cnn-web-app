// components/Sidebar.tsx
"use client"; // Add this to mark this component as client-side

import React, { FC } from "react";
import Link from "next/link"; // Import Link from next/link
import { useRouter } from "next/navigation"; // Correct import for useRouter in the app directory

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Logika untuk logout pengguna, seperti menghapus token atau session
    localStorage.removeItem("token"); // Misalnya jika menggunakan localStorage untuk menyimpan token
    router.push("/login"); // Redirect ke halaman login setelah logout
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "block" : "hidden"
      } lg:block w-full lg:w-64 bg-gray-800 text-white p-6 transition-all duration-300`}
    >
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/dashboard" className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/users" className="hover:text-gray-400">
              Users
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/predictions" className="hover:text-gray-400">
              Predictions
            </Link>
          </li>
          <li>
            <Link href="/dashboard/images" className="hover:text-gray-400">
              Images
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

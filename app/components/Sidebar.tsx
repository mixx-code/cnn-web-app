/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Sidebar.tsx
"use client"; // Add this to mark this component as client-side

import React, { FC } from "react";
import Link from "next/link"; // Import Link from next/link
import { useRouter } from "next/navigation"; // Correct import for useRouter in the app directory
import Image from "next/image";

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
      } lg:block w-full lg:w-72 bg-gray-800 text-white p-6 transition-all duration-300`}
    >
      <div className="flex items-center space-x-4 lg:w-72 my-2">
        <Image src="/assets/img/logo.png" alt="logo" width={45} height={45} />
        <h2 className="text-xl font-semibold">Dashboard Admin</h2>
      </div>

      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/dashboard" className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/dashboard/prediksi-hama"
              className="hover:text-gray-400"
            >
              prediksi hama
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/admin" className="hover:text-gray-400">
              Tabel Admin
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/petugas" className="hover:text-gray-400">
              Tabel Petugas
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/predictions" className="hover:text-gray-400">
              Tabel Hasil Prediksi
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/gambar-hama" className="hover:text-gray-400">
              Tabel Gambar Hama
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/Laporan" className="hover:text-gray-400">
              Tabel Laporan Hasil Prediksi
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

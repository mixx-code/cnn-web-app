/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { FC } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import Image from "next/image";
import Swal from "sweetalert2"; // Import SweetAlert2



interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const pathname = usePathname(); // Use usePathname to get current path
  const router = useRouter();
  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin logout?",
      text: "Anda akan keluar dari sesi saat ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, logout!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token"); // Hapus token atau session
        router.push("/login"); // Redirect ke halaman login
        Swal.fire("Berhasil!", "Anda telah logout.", "success");
      }
    });
  };

  // Helper function to check if the current path matches the link
  const isActive = (path: string) => pathname === path;

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

      <nav className="bg">
        <ul>
          <li className="mb-4">
            <Link
              href="/dashboard"
              className={`${
                isActive("/dashboard")
                  ? "relative bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-gray-300"
              } py-2 px-4 rounded-md transition-all duration-200`}
            >
              Dashboard
              {isActive("/dashboard") && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
              )}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/dashboard/prediksi-hama"
              className={`${
                isActive("/dashboard/prediksi-hama")
                  ? "relative bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-gray-300"
              } py-2 px-4 rounded-md transition-all duration-200`}
            >
              Prediksi Hama
              {isActive("/dashboard/prediksi-hama") && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
              )}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/dashboard/admin"
              className={`${
                isActive("/dashboard/admin")
                  ? "relative bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-gray-300"
              } py-2 px-4 rounded-md transition-all duration-200`}
            >
              Tabel Admin
              {isActive("/dashboard/admin") && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
              )}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/dashboard/petugas"
              className={`${
                isActive("/dashboard/petugas")
                  ? "relative bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-gray-300"
              } py-2 px-4 rounded-md transition-all duration-200`}
            >
              Tabel Petugas
              {isActive("/dashboard/petugas") && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
              )}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/dashboard/predictions"
              className={`${
                isActive("/dashboard/predictions")
                  ? "relative bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-gray-300"
              } py-2 px-4 rounded-md transition-all duration-200`}
            >
              Tabel Hasil Prediksi
              {isActive("/dashboard/predictions") && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
              )}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/dashboard/gambar-hama"
              className={`${
                isActive("/dashboard/gambar-hama")
                  ? "relative bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-gray-300"
              } py-2 px-4 rounded-md transition-all duration-200`}
            >
              Tabel Gambar Hama
              {isActive("/dashboard/gambar-hama") && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
              )}
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/dashboard/Laporan"
              className={`${
                isActive("/dashboard/Laporan")
                  ? "relative bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-gray-300"
              } py-2 px-4 rounded-md transition-all duration-200`}
            >
              Tabel Laporan Hasil Prediksi
              {isActive("/dashboard/Laporan") && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
              )}
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

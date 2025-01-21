/* eslint-disable @typescript-eslint/no-unused-vars */
// components/Sidebar.tsx
"use client"; // Add this to mark this component as client-side

import React, { FC } from "react";
import Link from "next/link"; 
import { usePathname, useRouter } from "next/navigation"; 
import Image from "next/image";
import Swal from "sweetalert2"; 

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarPetugas: FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
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
       <h2 className="text-xl font-semibold">Dashboard Petugas</h2>
     </div>

     <nav className="bg">
       <ul>
         <li className="mb-4">
           <Link
             href="/dashboard-petugas"
             className={`${
               isActive("/dashboard-petugas")
                 ? "relative bg-blue-600 text-white"
                 : "hover:bg-gray-700 hover:text-gray-300"
             } py-2 px-4 rounded-md transition-all duration-200`}
           >
             Dashboard
             {isActive("/dashboard-petugas") && (
               <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
             )}
           </Link>
         </li>
         <li className="mb-4">
           <Link
             href="/dashboard-petugas/prediksi-hama"
             className={`${
               isActive("/dashboard-petugas/prediksi-hama")
                 ? "relative bg-blue-600 text-white"
                 : "hover:bg-gray-700 hover:text-gray-300"
             } py-2 px-4 rounded-md transition-all duration-200`}
           >
             Prediksi Hama
             {isActive("/dashboard-petugas/prediksi-hama") && (
               <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
             )}
           </Link>
         </li>
         <li className="mb-4">
           <Link
             href="/dashboard-petugas/predictions"
             className={`${
               isActive("/dashboard-petugas/predictions")
                 ? "relative bg-blue-600 text-white"
                 : "hover:bg-gray-700 hover:text-gray-300"
             } py-2 px-4 rounded-md transition-all duration-200`}
           >
             Tabel Hasil Prediksi
             {isActive("/dashboard-petugas/predictions") && (
               <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
             )}
           </Link>
         </li>
         <li className="mb-4">
           <Link
             href="/dashboard-petugas/gambar-hama"
             className={`${
               isActive("/dashboard-petugas/gambar-hama")
                 ? "relative bg-blue-600 text-white"
                 : "hover:bg-gray-700 hover:text-gray-300"
             } py-2 px-4 rounded-md transition-all duration-200`}
           >
             Tabel Gambar Hama
             {isActive("/dashboard-petugas/gambar-hama") && (
               <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] h-1 bg-blue-400 rounded-full"></span>
             )}
           </Link>
         </li>
         <li className="mb-4">
           <Link
             href="/dashboard-petugas/Laporan"
             className={`${
               isActive("/dashboard-petugas/Laporan")
                 ? "relative bg-blue-600 text-white"
                 : "hover:bg-gray-700 hover:text-gray-300"
             } py-2 px-4 rounded-md transition-all duration-200`}
           >
             Tabel Laporan Hasil Prediksi
             {isActive("/dashboard-petugas/Laporan") && (
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

export default SidebarPetugas;

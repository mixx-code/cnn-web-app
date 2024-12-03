// app/dashboard/layout.tsx
"use client";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import { decodeJWT } from "../../utils/decodeToken";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // State untuk memeriksa apakah proses selesai
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found. Redirecting to login.");
        router.push("/login");
        return;
      }

      try {
        const decoded = decodeJWT(token);

        if (!decoded) {
          console.log("Invalid token. Redirecting to login.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token has expired. Redirecting to login.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        // Cek role `is_admin` dan arahkan ke dashboard yang sesuai
        if (decoded.is_admin) {
          console.log("Redirecting to admin dashboard.");
        } else {
          console.log("Redirecting to user dashboard.");
        }
      } catch (error) {
        console.error("Error handling token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsLoading(false); // Selesai memeriksa token
      }
    };

    checkToken();
  }, [router]);

  if (isLoading) {
    return <div></div>; // Indikator loading atau elemen kosong
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Navbar Hamburger Button */}
      <button
        className="lg:hidden absolute top-5 right-5 bg-gray-800 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <FaTimes size={24} /> // Close icon
        ) : (
          <FaBars size={24} /> // Hamburger icon
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 p-8 pt-20 lg:pt-8 bg-gray-100">
        {children} {/* Konten yang akan diganti sesuai route */}
      </div>
    </div>
  );
};

export default DashboardLayout;
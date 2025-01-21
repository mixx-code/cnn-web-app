"use client";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import { decodeJWT } from "../../utils/decodeToken";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token has expired. Redirecting to login.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (decoded.is_admin === false) {
          console.log(
            "Petugas is not an admin. Redirecting to petugas dashboard."
          );
          router.push("/dashboard-petugas"); // Redirect to a non-admin petugas page or dashboard
          return;
        } else {
          console.log("Admin access granted.");
        }
      } catch (error) {
        console.error("Error handling token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`lg:w-72 w-full bg-gray-800 text-white lg:fixed lg:h-screen ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

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
      <div className="flex-1 p-8 pt-20 lg:pt-8 lg:ml-72 bg-gray-100">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
          </div>
        ) : (
          children // Show children after loading is done
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;

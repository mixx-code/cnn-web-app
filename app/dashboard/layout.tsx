// app/dashboard/layout.tsx
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
        setIsLoading(false);
      }
    };

    checkToken();
  }, [router]);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`lg:w-64 w-full bg-gray-800 text-white lg:fixed lg:h-screen ${
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
      <div className="flex-1 p-8 pt-20 lg:pt-8 lg:ml-64 bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

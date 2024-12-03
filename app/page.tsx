"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeJWT } from "../utils/decodeToken";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("====================================");
    console.log(token);
    console.log("====================================");

    if (!token) {
      // Jika token tidak ada, arahkan ke halaman login
      console.log("No token found. Redirecting to login.");
      router.push("/login");
      return;
    }

    try {
      // Verifikasi dan dekode token
      const decoded = decodeJWT(token);
      console.log("====================================");
      console.log(decoded);
      console.log("====================================");
      if (!decoded) {
        console.log("Invalid token. Redirecting to login.");
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      // Periksa apakah token sudah kedaluwarsa
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
        router.push("/dashboard");
      } else {
        console.log("Redirecting to user dashboard.");
        router.push("/dashboard-user");
      }
    } catch (error) {
      console.error("Error handling token:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default RootLayout;

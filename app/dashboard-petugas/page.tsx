"use client";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaRegImage } from "react-icons/fa";
import Card from "../components/Card"; // Import Card component
import { decodeJWT } from "@/utils/decodeToken";
import { useRouter } from "next/navigation";

interface SummaryType {
  total_gambar_hama: number;
  total_hasil_prediksi: number;
  total_laporan_hasil_prediksi: number;
  total_petugas: number;
  total_admin: number;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<SummaryType | null>(null); // Update state type to handle null
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");
      const decoded = token ? decodeJWT(token) : null;

      if (!token || !decoded) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}get-total-summary`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch Summary");
          return;
        }

        const data = await response.json();

        console.log("API Response Data:", data);

        // Menyimpan data summary ke state
        if (data?.data) {
          setSummary(data.data);
        } else {
          setSummary(null);
        }
      } catch (error) {
        console.error("Error fetching Summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card Hasil Prediksi */}
      <Card
        icon={<FaClipboardList className="text-green-500" size={40} />}
        title="Tabel Hasil Prediksi"
        description="Jumlah Hasil Prediksi"
        value={summary?.total_hasil_prediksi.toString() || "0"} // Menggunakan data dari API
        link="/dashboard-petugas/predictions"
      />
      {/* Card gambar hama */}
      <Card
        icon={<FaRegImage className="text-green-500" size={40} />}
        title="Tabel Gambar Hama"
        description="Jumlah Hasil Prediksi"
        value={summary?.total_gambar_hama.toString() || "0"} // Menggunakan data dari API
        link="/dashboard-petugas/gambar-hama"
      />
      {/* Card Laporan Hasil Prediksi */}
      <Card
        icon={<FaClipboardList className="text-green-500" size={40} />}
        title="Tabel Laporan Hasil Prediksi"
        description="Jumlah Laporan Hasil Prediksi"
        value={summary?.total_laporan_hasil_prediksi.toString() || "0"} // Menggunakan data dari API
        link="/dashboard-petugas/Laporan"
      />
    </div>
  );
};

export default Dashboard;

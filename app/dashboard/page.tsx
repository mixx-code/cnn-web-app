"use client";
import React, { useEffect, useState } from "react";
import { FaUserAlt, FaRegImage, FaClipboardList } from "react-icons/fa";
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
    return <div>Loading...</div>; // Tampilkan loading saat data sedang diambil
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card Petugas */}
      <Card
        icon={<FaUserAlt className="text-blue-500" size={40} />}
        title="Admin"
        description="Jumlah Petugas"
        value={summary?.total_admin.toString() || "0"} // Menggunakan data dari API
        link="/dashboard/admin"
      />
      <Card
        icon={<FaUserAlt className="text-blue-500" size={40} />}
        title="Petugas"
        description="Jumlah Petugas"
        value={summary?.total_petugas.toString() || "0"} // Menggunakan data dari API
        link="/dashboard/petugas"
      />

      {/* Card Hasil Prediksi */}
      <Card
        icon={<FaClipboardList className="text-green-500" size={40} />}
        title="Hasil Prediksi"
        description="Jumlah Hasil Prediksi"
        value={summary?.total_hasil_prediksi.toString() || "0"} // Menggunakan data dari API
        link="/dashboard/predictions"
      />

      {/* Card Gambar Hama */}
      <Card
        icon={<FaRegImage className="text-yellow-500" size={40} />}
        title="Gambar Hama"
        description="Jumlah Gambar Hama"
        value={summary?.total_gambar_hama.toString() || "0"} // Menggunakan data dari API
        link="/dashboard/images"
      />
      {/* Card Laporan Hasil Prediksi */}
      <Card
        icon={<FaClipboardList className="text-green-500" size={40} />}
        title="Laporan Hasil Prediksi"
        description="Jumlah Laporan Hasil Prediksi"
        value={summary?.total_laporan_hasil_prediksi.toString() || "0"} // Menggunakan data dari API
        link="/dashboard/Laporan"
      />
    </div>
  );
};

export default Dashboard;

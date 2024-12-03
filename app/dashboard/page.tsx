"use client";
import React from "react";
import { FaUserAlt, FaRegImage, FaClipboardList } from "react-icons/fa";
import Card from "../components/Card"; // Import Card component
const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card Data User */}
      <Card
        icon={<FaUserAlt className="text-blue-500" size={40} />}
        title="Data Users"
        description="Total Users"
        value="120"
        link="/dashboard/users"
      />

      {/* Card Data Hasil Prediksi Hama */}
      <Card
        icon={<FaClipboardList className="text-green-500" size={40} />}
        title="Hama Predictions"
        description="Total Predictions"
        value="350"
        link="/dashboard/predictions"
      />

      {/* Card Gambar Hama */}
      <Card
        icon={<FaRegImage className="text-yellow-500" size={40} />}
        title="Images of Pests"
        description="Total Images"
        value="150"
        link="/dashboard/images"
      />
    </div>
  );
};

export default Dashboard;

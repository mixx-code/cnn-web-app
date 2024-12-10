"use client";

import React from "react";
import Header from "../components/Header";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />
      <main className="pt-10 px-6 lg:px-20">{children}</main>
    </div>
  );
};

export default DashboardLayout;

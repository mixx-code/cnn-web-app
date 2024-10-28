import React from "react";

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center bg-gray-200 p-4 rounded-md">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <button className="bg-gray-400 text-white px-4 py-2 rounded-md">
        Login
      </button>
    </div>
  );
};

export default Header;

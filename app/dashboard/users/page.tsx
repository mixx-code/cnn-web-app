// app/dashboard/users/page.tsx
"use client";
import React, { useState } from "react";
import Modal from "../../components/Modal"; // Import modal
import UserForm from "../../components/UserForm"; // Import form

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">User List</h2>
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      {/* Tabel data pengguna */}
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b bg-blue-600">
            <th className="py-2 px-4 text-left text-white">ID</th>
            <th className="py-2 px-4 text-left text-white">Name</th>
            <th className="py-2 px-4 text-left text-white">Email</th>
            <th className="py-2 px-4 text-left text-white">Role</th>
          </tr>
        </thead>
        <tbody>
          {/* Contoh data */}
          <tr className="border-b hover:bg-gray-50">
            <td className="py-2 px-4 text-black">1</td>
            <td className="py-2 px-4 text-black">John Doe</td>
            <td className="py-2 px-4 text-black">john@example.com</td>
            <td className="py-2 px-4 text-black">Admin</td>
          </tr>
        </tbody>
      </table>

      {/* Modal Form Add User */}
      <Modal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        title="Add New User"
      >
        <UserForm />
      </Modal>
    </div>
  );
};

export default Users;

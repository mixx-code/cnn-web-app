/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

interface Admin {
  admin_id: number;
  name: string;
  username: string;
  password: string;
}

interface ModalEditAdminProps {
  admin: Admin | null;
  onClose: () => void;
}

const ModalEditAdmin: React.FC<ModalEditAdminProps> = ({ admin, onClose }) => {
  const [adminId, setAdminId] = useState(admin?.admin_id || "");
  const [name, setName] = useState(admin?.name || "");
  const [username, setUsername] = useState(admin?.username || "");
  const [password, setPassword] = useState(admin?.password || "");

  const handleEdit = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}edit-admin/${adminId}`;

    const updateAdmin = {
      name,
      username,
      password,
    };

    // Misalkan token diambil dari localStorage atau state
    const token = localStorage.getItem("token"); // Pastikan mengganti dengan cara pengambilan token sesuai dengan aplikasi Anda

    try {
      const response = await fetch(apiUrl, {
        method: "PUT", // Menggunakan metode HTTP PUT untuk mengedit data
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token ke header
        },
        body: JSON.stringify(updateAdmin),
      });

      if (!response.ok) {
        throw new Error(`Failed to update admin: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("admin updated successfully:", result);
      // Optionally close the modal after successful submission
      alert("berhasil tambah admin");
      window.location.reload(); // This will reload the page

      onClose(); // Menutup modal setelah data berhasil disimpan
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Edit Admin</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
            onClick={onClose} // Close modal without saving
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleEdit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditAdmin;

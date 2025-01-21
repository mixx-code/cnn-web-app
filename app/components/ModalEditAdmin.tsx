/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Swal from "sweetalert2";

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
    const token = localStorage.getItem("token");

    const updateAdmin = { name, username, password };

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan mengedit data admin ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, edit!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateAdmin),
          });

          if (!response.ok) {
            throw new Error(`Gagal memperbarui admin: ${response.statusText}`);
          }

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Admin berhasil diperbarui.",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });

          onClose();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat memperbarui admin.",
          });
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Edit Admin</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-500 text-white rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleEdit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditAdmin;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

interface Petugas {
  petugas_id: number;
  name: string;
  username: string;
  password: string;
}

interface ModalEditPetugasProps {
  petugas: Petugas | null;
  onClose: () => void;
}

const ModalEditPetugas: React.FC<ModalEditPetugasProps> = ({
  petugas,
  onClose,
}) => {
  const [id, setId] = useState(petugas?.petugas_id || "");
  const [name, setName] = useState(petugas?.name || "");
  const [username, setUsername] = useState(petugas?.username || "");
  const [password, setPassword] = useState(petugas?.password || "");

  const handleEdit = async () => {
    const apiUrl = `http://127.0.0.1:5001/edit-petugas/${id}`;

    const updatedUser = {
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
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`Failed to update petugas: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("petugas updated successfully:", result);
      // Optionally close the modal after successful submission
      alert("berhasil tambah petugas");
      window.location.reload(); // This will reload the page

      onClose(); // Menutup modal setelah data berhasil disimpan
    } catch (error) {
      console.error("Error updating petugas:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Edit Petugas</h2>
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

export default ModalEditPetugas;

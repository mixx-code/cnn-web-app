/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Swal from "sweetalert2";

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
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}edit-petugas/${id}`;
    const token = localStorage.getItem("token");
  
    const updatePetugas = { name, username, password };
  
    // Trigger confirmation dialog using SweetAlert2
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan mengedit data petugas ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, edit!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Making the API call to update petugas
          const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatePetugas),
          });
  
          if (!response.ok) {
            throw new Error(`Gagal memperbarui petugas: ${response.statusText}`);
          }
  
          // Success message using SweetAlert2
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Petugas berhasil diperbarui.",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload(); // Reload page after update
          });
  
          onClose(); // Close the modal after successful update
        } catch (error) {
          // Error message in case of failure
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat memperbarui petugas.",
          });
        }
      }
    });
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

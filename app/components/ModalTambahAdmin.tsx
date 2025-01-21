/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Swal from "sweetalert2";

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  title: string;
}

const ModalTambahAdmin: React.FC<ModalProps> = ({
  isOpen,
  toggleModal,
  title,
}) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, username, password }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: "Admin berhasil ditambahkan.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          toggleModal(); // Tutup modal setelah notifikasi selesai
          window.location.reload(); // Reload halaman
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menambahkan admin.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan jaringan atau server.",
        icon: "error",
      });
    }
  };

  // Membatasi panjang password hingga 8 karakter
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    if (newPassword.length <= 8) {
      setPassword(newPassword);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Username</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {password.length > 8 && (
              <p className="text-red-500 text-sm">
                Password tidak boleh lebih dari 8 karakter.
              </p>
            )}
          </div>
        </form>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={toggleModal}
            className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahAdmin;

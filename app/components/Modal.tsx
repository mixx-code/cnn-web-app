import React, { useState } from "react";
import Swal from "sweetalert2";

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, toggleModal, title }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    // Ambil token dari localStorage atau sumber lainnya
    const token = localStorage.getItem("token"); // Misalnya token disimpan di localStorage

    try {
      const response = await fetch("/api/petugas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Menambahkan token ke header Authorization
        },
        body: JSON.stringify({
          name,
          username,
          password,
        }),
      });

      if (response.ok) {
        console.log("petugas added successfully");
        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Petugas added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // This will reload the page
          toggleModal();
        });
      } else {
        console.error("Failed to save petugas");
        // Show error alert
        Swal.fire({
          title: "Error!",
          text: "Failed to add petugas. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error saving petugas:", error);
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "An error occurred while saving petugas. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Limit the password length to 8 characters
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
              onChange={handlePasswordChange} // Use the new handler
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {password.length > 8 && (
              <p className="text-red-500 text-sm">
                Password cannot exceed 8 characters.
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
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave} // Trigger form submission here
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

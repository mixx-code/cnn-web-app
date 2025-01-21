/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal"; // Import modal
import Link from "next/link";
import { decodeJWT } from "@/utils/decodeToken";
import { useRouter } from "next/navigation";
import ModalEditPetugas from "../../components/ModalEditPetugas";
import Swal from "sweetalert2";

interface Petugas {
  petugas_id: number;
  name: string;
  username: string;
  password: string;
  tanggal: string;
}

const Petugas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditPetugasOpen, setIsModalEditPetugasOpen] =
    useState<boolean>(false);
  const [PetugasToEdit, setPetugasToEdit] = useState<Petugas | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cursor, setCursor] = useState<number | null>(null); // Cursor state for pagination
  const [hasMore, setHasMore] = useState(true); // State to check if there's more data
  const [history, setHistory] = useState<Petugas[]>([]);
  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const fetchHistory = async (newCursor: number | null = null) => {
    const token = localStorage.getItem("token");
    const decoded = token ? decodeJWT(token) : null;

    if (!token || !decoded) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}get-all-petugas?cursor=${
          newCursor || ""
        }&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch history");
        return;
      }

      const data = await response.json();
      console.log("data : ", data);

      if (data?.data && Array.isArray(data.data)) {
        const formattedHistory = data.data.map((item: any) => ({
          petugas_id: item.petugas_id,
          name: item.name,
          username: item.username,
          password: item.password,
          tanggal: item.tanggal,
        }));

        setHistory((prev) => {
          const uniqueItems = formattedHistory.filter(
            (newItem: any) =>
              !prev.some((oldItem) => oldItem.petugas_id === newItem.petugas_id)
          );
          return [...prev, ...uniqueItems];
        });

        setCursor(data.next_cursor);
        setHasMore(Boolean(data.next_cursor)); // Check if there's more data
        console.log("hasmore: ", Boolean(data.next_cursor));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const loadMore = () => {
    if (cursor) {
      fetchHistory(cursor);
    }
  };

  const handleEdit = (petugasId: number) => {
    console.log("Edit petugas with ID:", petugasId);

    const petugas = history.find((petugas) => petugas.petugas_id === petugasId);
    console.log("id petugas: ", petugas);
    setPetugasToEdit(petugas || null);
    setIsModalEditPetugasOpen(true);
  };

  const handleDelete = async (petugasId: number): Promise<void> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}delete-petugas/${petugasId}`;
  
    // Tampilkan konfirmasi sebelum menghapus
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data petugas akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            throw new Error(`Gagal menghapus user: ${response.statusText}`);
          }
  
          const result = await response.json();
          console.log("User deleted successfully:", result);
  
          // Tampilkan alert sukses dan reload halaman setelah animasi selesai
          Swal.fire({
            title: "Terhapus!",
            text: "Petugas telah dihapus.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload(); // Reload setelah alert selesai
          });
        } catch (error) {
          console.error("Error deleting user:", error);
  
          // Tampilkan alert error jika terjadi kesalahan
          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat menghapus petugas.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalEditPetugasOpen(false);
    setPetugasToEdit(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 lg:px-20">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <span>
            <Link href="/dashboard">
              <span className="inline-flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg mb-6 hover:bg-blue-600 transition duration-300 cursor-pointer">
                <span className="mr-2">&larr;</span> Kembali
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-black mb-6">
              Tabel Petugas
            </h1>
          </span>
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add Petugas
          </button>
        </div>

        {/* Table for displaying users */}
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm">
              <th className="border border-gray-300 p-3">No</th>
              <th className="border border-gray-300 p-3">ID Petugas</th>
              <th className="border border-gray-300 p-3">Username</th>
              <th className="border border-gray-300 p-3">Password</th>
              <th className="border border-gray-300 p-3">Name</th>
              <th className="border border-gray-300 p-3">Tanggal</th>
              <th className="border border-gray-300 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td className="py-2 px-4 text-black text-center" colSpan={7}>
                  No users found.
                </td>
              </tr>
            ) : (
              history.map((user, index) => (
                <tr
                  key={user.petugas_id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } hover:bg-blue-100 transition duration-300`}
                >
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.petugas_id}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.password}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.name}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {new Date(user.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                      onClick={() => handleEdit(user.petugas_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(user.petugas_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-2 border-blue-500 rounded-full animate-spin"></div>
              ) : (
                "Muat Lebih Banyak"
              )}
            </button>
          </div>
        )}
        {/* Modal Form Add Petugas */}
        <Modal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          title="Add New Petugas"
        />

        {isModalEditPetugasOpen && PetugasToEdit && (
          <ModalEditPetugas
            petugas={PetugasToEdit}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default Petugas;

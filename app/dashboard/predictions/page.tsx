/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJWT } from "@/utils/decodeToken";
import Link from "next/link";
import Image from "next/image";

interface PredictionHistory {
  prediksi_id: number;
  petugas_id: number;
  imageBase64: string;
  predictedClass: string;
  predictionPercentage: string;
  tanggal: string;
}

const token = localStorage.getItem("token");
console.log("ini token :", token);
const decoded = token ? decodeJWT(token) : null;
console.log("ini decoded token :", decoded);

const Predictions: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingBuatLaporan, setLoadingBuatLaporan] = useState(false); // Menambahkan state loading
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [cursor, setCursor] = useState<number | null>(null); // Cursor state for pagination
  const [hasMore, setHasMore] = useState(true); // State to check if there's more data
  const router = useRouter();

  const ITEMS_PER_PAGE = 10; // Number of items to fetch per page

  const fetchHistory = async (newCursor: number | null = null) => {
    const token = localStorage.getItem("token");
    console.log("ini token :", token);
    const decoded = token ? decodeJWT(token) : null;
    console.log("ini decoded token :", decoded);
    if (!token || !decoded) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/list_predictions?cursor=${
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
      console.log("data: ", data);

      if (data?.data && Array.isArray(data.data)) {
        const formattedHistory = data.data.map((item: any) => ({
          prediksi_id: item.prediksi_id,
          petugas_id: item.petugas_id,
          imageBase64: item.image_base64,
          predictedClass: item.prediction_result,
          predictionPercentage: item.prediction_percentage,
          tanggal: item.tanggal,
        }));

        setHistory((prev) => {
          const uniqueItems = formattedHistory.filter(
            (newItem: any) =>
              !prev.some(
                (oldItem) => oldItem.prediksi_id === newItem.prediksi_id
              )
          );
          return [...prev, ...uniqueItems];
        });

        setCursor(data.next_cursor);
        setHasMore(Boolean(data.next_cursor)); // Check if there's more data
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

  // Function to load more data
  const loadMore = () => {
    if (cursor) {
      fetchHistory(cursor);
    }
  };

  // Function to open the modal with the clicked image
  const openModal = (image: string) => {
    setModalImage(image);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalImage(null);
  };

  //handle buat laporan
  const handleBuatLaporan = async (prediksi_id: number) => {
    const token = localStorage.getItem("token");
    console.log("ini token :", token);
    // const decoded = token ? decodeJWT(token) : null;
    // console.log("ini decoded token :", decoded);
    // Menampilkan alert terlebih dahulu
    const confirmProceed = window.confirm(
      "Apakah Anda yakin ingin membuat laporan?"
    );

    if (!confirmProceed) {
      return; // Jika pengguna membatalkan, keluar dari fungsi
    }

    // Set loading menjadi true dan tampilkan modal
    setLoadingBuatLaporan(true);
    setShowModal(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/buat-laporan-hasil-prediksi-by-id?prediksi_id=${prediksi_id}`,
        {
          method: "Post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mendapatkan laporan");
      }

      const data = await response.json(); // Jika butuh data dari response

      // Alihkan ke halaman dashboard/Laporan setelah API sukses
      router.push("/dashboard/Laporan");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      // Set loading menjadi false dan sembunyikan modal setelah proses selesai
      setLoadingBuatLaporan(false);
      setShowModal(false);
    }
  };

  const handleDelete = async (prediksiId: number): Promise<void> => {
    const apiUrl = `http://127.0.0.1:5001/delete-hasil-prediksi/${prediksiId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE", // Menggunakan metode HTTP DELETE untuk menghapus data
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Menambahkan token jika diperlukan
          "Content-Type": "application/json", // Tambahkan jika server memerlukan content type
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete hasil prediksi: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("hasil prediksi deleted successfully:", result);
      window.location.reload(); // This will reload the page

      // Tindakan tambahan setelah penghapusan berhasil
      alert("hasil prediksi berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting hasil prediksi:", error);
      alert("Terjadi kesalahan saat menghapus hasil prediksi.");
    }
  };

  // Spinner Component
  const Spinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  if (isLoading && history.length === 0) {
    return <Spinner />;
  }

  if (!isLoading && history.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Tidak ada riwayat prediksi.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 lg:px-20">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Back to Dashboard Button */}
        <Link href="/dashboard">
          <span className="inline-flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg mb-6 hover:bg-blue-600 transition duration-300 cursor-pointer">
            <span className="mr-2">&larr;</span> Kembali
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-black mb-6">Hasil Prediksi</h1>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm">
              <th className="border border-gray-300 p-3">#</th>
              <th className="border border-gray-300 p-3">ID Prediksi</th>
              <th className="border border-gray-300 p-3">ID Petugas</th>
              <th className="border border-gray-300 p-3">Gambar</th>
              <th className="border border-gray-300 p-3">Hama</th>
              <th className="border border-gray-300 p-3">Presentase</th>
              <th className="border border-gray-300 p-3">Tanggal Prediksi</th>
              <th className="border border-gray-300 p-3">action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr
                key={item.prediksi_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-blue-100 transition duration-300`}
              >
                <td className="border border-gray-300 p-3 text-center text-black">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-3 text-center text-black">
                  {item.prediksi_id}
                </td>
                <td className="border border-gray-300 p-3 text-center text-black">
                  {item.petugas_id}
                </td>
                <td
                  className="border border-gray-300 p-3 text-center cursor-pointer"
                  onClick={() => openModal(item.imageBase64)}
                >
                  <Image
                    src={item.imageBase64}
                    alt="Predicted Pest"
                    className="object-cover mx-auto"
                    width={64}
                    height={64}
                  />
                </td>
                <td className="border border-gray-300 p-3 capitalize text-black">
                  {item.predictedClass.replace(/_/g, " ")}
                </td>
                <td className="border border-gray-300 p-3 text-center text-black">
                  {item.predictionPercentage || "N/A"}
                </td>
                <td className="border border-gray-300 p-3 text-center text-black">
                  {new Date(item.tanggal).toLocaleDateString("id-ID")}
                </td>
                <td className="border border-gray-300 p-3 text-center text-black">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                    onClick={() => handleBuatLaporan(item.prediksi_id)}
                  >
                    Buat Laporan
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(item.prediksi_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
      </div>
      {/* Modal Loading */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mr-4"></div>
            <span className="text-lg text-black">Membuat Laporan...</span>
          </div>
        </div>
      )}

      {/* Modal for full-size image */}
      {modalImage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              className="absolute -top-5 -right-5 p-3 w-12 text-white bg-red-500 rounded-full"
              onClick={closeModal}
            >
              X
            </button>
            <div className="relative w-full h-auto max-h-[80vh]">
              <Image
                src={modalImage}
                alt="Full size"
                className="w-full max-h-[80vh] object-contain"
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>

            {/* <Image
              src={modalImage}
              alt="Full size"
              className="max-w-full max-h-[80vh] mb-4"
              width={100%}
            /> */}
            {/* Centered Download Button */}
            <div className="flex justify-center mt-4">
              <a
                href={modalImage}
                download="predicted_pest_image.jpg" // You can change the filename as needed
                className="bg-blue-500 text-white py-2 px-4 rounded-lg text-center"
              >
                Download Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predictions;

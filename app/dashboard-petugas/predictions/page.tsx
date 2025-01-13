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
  gambar_id: number;
  predictedClass: string;
  predictionPercentage: string;
  allProbabilities: Record<string, number>;
  tanggal: string;
}

const Predictions: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingBuatLaporan, setLoadingBuatLaporan] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [modalProbabilities, setModalProbabilities] = useState<Record<
    string,
    number
  > | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

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
        `${process.env.NEXT_PUBLIC_API_URL}list_predictions?cursor=${
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

      if (data?.data && Array.isArray(data.data)) {
        const formattedHistory = data.data.map((item: any) => ({
          prediksi_id: item.prediksi_id,
          gambar_id: item.gambar_id,
          predictedClass: item.prediction_result,
          predictionPercentage: item.prediction_percentage,
          tanggal: item.tanggal,
          allProbabilities: item.all_probabilities,
        }));

        setHistory((prev) => [
          ...prev,
          ...formattedHistory.filter(
            (newItem: any) =>
              !prev.some(
                (oldItem) => oldItem.prediksi_id === newItem.prediksi_id
              )
          ),
        ]);
        setCursor(data.next_cursor);
        setHasMore(Boolean(data.next_cursor));
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

  const openModal = (image: string) => {
    setModalImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalImage(null);
    setShowModal(false);
  };

  const handleBuatLaporan = async (prediksi_id: number) => {
    const token = localStorage.getItem("token");
    const confirmProceed = window.confirm(
      "Apakah Anda yakin ingin membuat laporan?"
    );

    if (!confirmProceed) {
      return;
    }

    setLoadingBuatLaporan(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}buat-laporan-hasil-prediksi-by-id?prediksi_id=${prediksi_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal membuat laporan");
      }

      router.push("/dashboard-petugas/Laporan");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setLoadingBuatLaporan(false);
    }
  };

  const openProbabilitiesModal = (probabilities: Record<string, number>) => {
    setModalProbabilities(probabilities);
  };

  const closeProbabilitiesModal = () => {
    setModalProbabilities(null);
  };

  const Spinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
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
        <h1 className="text-2xl font-bold text-black mb-6">
          Tabel Hasil Prediksi
        </h1>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm">
              <th className="border border-gray-300 p-3">No</th>
              <th className="border border-gray-300 p-3">ID Prediksi</th>
              <th className="border border-gray-300 p-3">ID Gambar</th>
              <th className="border border-gray-300 p-3">prediction Result</th>
              <th className="border border-gray-300 p-3">
                Prediction Percentage
              </th>
              <th className="border border-gray-300 p-3">All Probabilitas</th>
              <th className="border border-gray-300 p-3">Tanggal</th>
              <th className="border border-gray-300 p-3">Action</th>
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
                  {item.gambar_id}
                </td>
                <td className="border border-gray-300 p-3 capitalize text-black">
                  {item.predictedClass.replace(/_/g, " ")}
                </td>
                <td className="border border-gray-300 p-3 text-center text-black">
                  {item.predictionPercentage || "N/A"}
                </td>
                <td className="border border-gray-300 p-3 text-center text-black">
                  <button
                    onClick={() =>
                      openProbabilitiesModal(item.allProbabilities)
                    }
                    className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                  >
                    View
                  </button>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Load More Probabilities */}
        {modalProbabilities && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                All Probabilities
              </h2>
              <ul className="space-y-2">
                {Object.entries(modalProbabilities).map(([key, value]) => (
                  <li key={key} className="flex justify-between text-gray-700">
                    <span className="capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="font-semibold">{value.toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={closeProbabilitiesModal}
                className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

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
    </div>
  );
};

export default Predictions;

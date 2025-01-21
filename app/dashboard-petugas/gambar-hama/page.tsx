/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJWT } from "@/utils/decodeToken";
import Link from "next/link";
import Image from "next/image";

interface ImagesType {
  gambar_id: number;
  petugas_id: number;
  imageBase64: string;
  tanggal: string;
}

const Images: React.FC = () => {
  const [history, setHistory] = useState<ImagesType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const router = useRouter();

  const ITEMS_PER_PAGE = 5;

  const fetchHistory = async (cursor?: string) => {
    const token = localStorage.getItem("token");
    const decoded = token ? decodeJWT(token) : null;

    if (!token || !decoded) {
      router.push("/login");
      return;
    }

    const isInitialLoad = !cursor;
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}get-gambar-hama?cursor=${
          cursor || ""
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
      console.log("API Response Data:", data);

      if (data?.data && Array.isArray(data.data)) {
        const formattedHistory = data.data.map((item: any) => ({
          gambar_id: item.gambar_id,
          petugas_id: item.petugas_id,
          imageBase64: item.gambar_hama,
          tanggal: item.tanggal,
        }));

        setHistory((prev) =>
          isInitialLoad ? formattedHistory : [...prev, ...formattedHistory]
        );
        setNextCursor(data.next_cursor || null);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [router]);

  const loadMore = () => {
    if (nextCursor) {
      fetchHistory(nextCursor);
    }
  };

  const openModal = (image: string) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const Spinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (history.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Tidak ada Gambar Hama.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 lg:px-20">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Back to Dashboard Button */}
        <Link href="/dashboard-petugas">
          <span className="inline-flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg mb-6 hover:bg-blue-600 transition duration-300 cursor-pointer">
            <span className="mr-2">&larr;</span> Kembali
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-black mb-6">
          Tabel Gambar Hama
        </h1>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm">
              <th className="border border-gray-300 p-3">No</th>
              <th className="border border-gray-300 p-3">ID Gambar</th>
              <th className="border border-gray-300 p-3">ID Petugas</th>
              <th className="border border-gray-300 p-3">Gambar</th>
              <th className="border border-gray-300 p-3">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr
                key={item.gambar_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-blue-100 transition duration-300`}
              >
                <td className="border border-gray-300 p-3 text-center text-black">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-3 text-center text-black">
                  {item.gambar_id}
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
                <td className="border border-gray-300 p-3 text-center text-black">
                  {new Date(item.tanggal).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {nextCursor && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <div className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></div>
              ) : (
                "Muat Lebih Banyak"
              )}
            </button>
          </div>
        )}
      </div>

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
            <div className="flex justify-center mt-4">
              <a
                href={modalImage}
                download="predicted_pest_image.jpg"
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

export default Images;

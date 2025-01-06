/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Add this at the top to make it a client-side component

import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print"; // Import useReactToPrint hook
import { useParams, useRouter } from "next/navigation";
import { hamaData } from "@/hamaData";
import { decodeJWT } from "@/utils/decodeToken";
import Image from "next/image";

interface Laporan {
  id_laporan: number;
  prediksi_id: number;
  petugas_id: number;
  name: string;
  imageBase64: string;
  prediction_result: string;
  prediction_percentage: string;
  tanggal: string;
}

export default function LaporanHama() {
  const { id } = useParams();
  const contentRef = useRef<HTMLDivElement>(null); // Create a ref for the printable content
  const [isPrinting, setIsPrinting] = useState(false); // State to manage print status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [laporan, setLaporan] = useState<Laporan | null>(null);

  const router = useRouter();
  const promiseResolveRef = useRef<(() => void) | null>(null); // Ref for resolving the Promise in onBeforePrint

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token tidak ditemukan. Arahkan pengguna ke halaman login.");
      router.push("/login");
      return;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      console.warn("Token tidak valid. Arahkan pengguna ke halaman login.");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/get-laporan-hasil-prediksi-by-id?id_laporan=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `Gagal mendapatkan data dari API. Status: ${response.status} ${response.statusText}`
        );
        return;
      }

      const dataAPI = await response.json();
      console.log("Data yang diterima dari API:", dataAPI);

      // Check if dataAPI.data exists and has the expected properties
      if (dataAPI?.data) {
        const laporanData = dataAPI.data;
        setLaporan({
          id_laporan: laporanData.id_laporan,
          prediksi_id: laporanData.prediksi_id,
          petugas_id: laporanData.petugas_id,
          name: laporanData.name,
          imageBase64: laporanData.image_base64,
          prediction_result: laporanData.prediction_result,
          prediction_percentage: laporanData.prediction_percentage,
          tanggal: laporanData.tanggal,
        });
      } else {
        console.warn(
          "Data dari API tidak sesuai dengan format yang diharapkan."
        );
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id]); // Make sure to refetch when the 'id' parameter changes

  useEffect(() => {
    console.log("Laporan terbaru:", laporan);
  }, [laporan]);

  // Function to find the corresponding hamaData based on prediction_result
  const getHamaInfo = (prediction: string) => {
    return hamaData.find((item) => item.hama === prediction);
  };

  // useEffect hook to watch for state changes and resolve the promise when print is ready
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current(); // Resolve the Promise to indicate the DOM is ready
    }
  }, [isPrinting]);

  // Handle the print functionality using the `useReactToPrint` hook
  const handlePrint = useReactToPrint({
    contentRef, // Specify the ref pointing to the printable content
    onBeforePrint: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true); // Set the print state to true before printing
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null; // Reset the promise resolve reference
      setIsPrinting(false); // Reset the print state after printing
    },
  });

  // Get hama data based on the prediction result
  const hamaInfo = laporan?.prediction_result
    ? getHamaInfo(laporan.prediction_result)
    : null;

  // Show a loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
        <p className="ml-4 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Printable content */}
      <div
        ref={contentRef}
        className="container mx-auto px-10 py-14 bg-white text-black "
        style={{ width: "21cm", minHeight: "29.7cm" }}
      >
        {/* Header Kop Surat */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold">PEMERINTAH KABUPATEN LEBAK</h2>
          <h3 className="text-lg">KECAMATAN CIKULUR</h3>
          <h3 className="text-lg font-bold">DESA SUMURBANDUNG</h3>
          <p className="text-sm">
            Alamat: Jl. Raya Sampay-tileles Km. 4 Sumurbandung, 42356
          </p>
          <p className="text-sm">Email: kantordesa.sumurbandung@gmail.com</p>
        </div>

        {/* Informasi Laporan */}
        <div className="mb-4">
          <p>Perihal: Laporan hasil prediksi hama</p>
          {laporan?.name && laporan.tanggal ? (
            <>
              <p>Petugas: {laporan.name}</p>
              <p>
                Tanggal:{" "}
                {laporan?.tanggal
                  ? new Date(laporan.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long", // Untuk menampilkan hari
                      day: "2-digit", // Menampilkan tanggal dengan dua digit
                      month: "2-digit", // Menampilkan bulan dengan dua digit
                      year: "numeric", // Menampilkan tahun dengan format numeric
                    })
                  : "Tidak tersedia"}
              </p>
            </>
          ) : (
            <>
              <p>Petugas: "Tidak tersedia"</p>
              <p>Tanggal: "Tidak tersedia"</p>
            </>
          )}
        </div>

        {/* Konten Utama */}
        <div className="mb-8 text-justify">
          <p>
            Sebagai bagian dari upaya pengendalian hama tanaman, berikut ini
            kami sampaikan laporan hasil prediksi hama yang telah dilakukan
            berdasarkan data yang telah dikumpulkan. Laporan ini disusun oleh{" "}
            {laporan?.name || "petugas"} dan diharapkan dapat memberikan
            informasi yang akurat dan bermanfaat dalam pengambilan keputusan
            untuk menangani masalah hama pada tanaman padi secara tepat.
          </p>
        </div>

        {/* Hasil Prediksi */}
        <div className="p-4 rounded-md">
          <h3 className="text-lg font-bold mb-2 text-center">Hasil Prediksi</h3>
          <div className="flex items-center justify-around">
            <div className="md:w-1/3 mr-4 mb-4 md:mb-0">
              {/* Check if the image exists before rendering */}
              {laporan?.imageBase64 ? (
                <Image
                  src={laporan.imageBase64}
                  alt="Ulat Hama"
                  width={300}
                  height={200}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <p>Gambar Tidak Tersedia</p>
                </div>
              )}
            </div>
            <div>
              {laporan?.name && laporan.tanggal ? (
                <>
                  <p>Hama: {laporan.prediction_result.replace(/_/g, " ")}</p>
                  <p>Persentase: {laporan.prediction_percentage}</p>
                </>
              ) : (
                <>
                  <p>Hama: Tidak tersedia</p>
                  <p>Persentase: laporan.prediction_percentageTidak tersedia</p>
                </>
              )}

              {/* Dynamically show Kategori and Saran Obat */}
              {hamaInfo ? (
                <>
                  <p>Kategori: {hamaInfo.kategori}</p>
                  <p className="mt-2">Saran Obat:</p>
                  <ul className="list-disc ml-6">
                    {hamaInfo.obat.map((obat, index) => (
                      <li key={index}>{obat}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Data hama tidak ditemukan</p>
              )}
            </div>
          </div>
        </div>

        {/* Tanda Tangan Petugas */}
        <div className="flex justify-end mt-16">
          <div className="w-48 text-center">
            <p>Petugas</p>
            {laporan?.name && laporan.tanggal ? (
              <p className="mt-10">({laporan.name})</p>
            ) : (
              <>
                <p className="mt-10">(Nama tidak ada)</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Print */}
      <div className="mt-8 text-center">
        <button
          onClick={() => handlePrint && handlePrint()}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md"
        >
          Print
        </button>
      </div>
    </div>
  );
}

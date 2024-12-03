"use client"; // This tells Next.js that this is a client component

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DragAndDrop from "../components/DragAndDrop";
import PredictionResult from "../components/PredictionResult";
import SatisfactionStats from "../components/SatisfactionStats";
import Reviews from "../components/Reviews";
import ButtonCekHama from "../components/ButtonCekHama";
import { useRouter } from "next/navigation";
import { decodeJWT } from "../../utils/decodeToken";

interface PredictionData {
  success: boolean;
  message: string;
  data: {
    predicted_class: string;
    presentase_predicted_class: string;
    all_probabilities: Record<string, string>;
  };
}

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk memeriksa apakah proses selesai
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null
  ); // Store prediction data
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found. Redirecting to login.");
        router.push("/login");
        return;
      }

      try {
        const decoded = decodeJWT(token);

        if (!decoded) {
          console.log("Invalid token. Redirecting to login.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token has expired. Redirecting to login.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        // Cek role `is_admin` dan arahkan ke dashboard yang sesuai
        if (decoded.is_admin) {
          console.log("Redirecting to admin dashboard.");
        } else {
          console.log("Redirecting to user dashboard.");
        }
      } catch (error) {
        console.error("Error handling token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsLoading(false); // Selesai memeriksa token
      }
    };

    checkToken();
  }, [router]);

  if (isLoading) {
    return <div></div>; // Indikator loading atau elemen kosong
  }

  // Handle file upload and make prediction request
  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected for upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("./api/upload", {
        method: "POST",
        body: formData, // Kirim FormData tanpa mengatur Content-Type
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload result:", result);

      if (result.data) {
        setPredictionData({
          success: true,
          message: "Prediction successful",
          data: {
            predicted_class: result.data.predicted_class,
            presentase_predicted_class: result.data.presentase_predicted_class,
            all_probabilities: result.data.all_probabilities,
          },
        });
      } else {
        console.error("Unexpected response structure:", result);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-5 px-4 lg:px-40">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-6 rounded-md shadow-md">
          <DragAndDrop setSelectedFile={setSelectedFile} />
          <ButtonCekHama onClick={handleFileUpload} />
        </div>

        {/* Conditional Rendering of PredictionResult */}
        {predictionData && predictionData.data && (
          <PredictionResult
            pestName={predictionData.data.predicted_class}
            percentage={predictionData.data.presentase_predicted_class}
            all_probabilities={predictionData.data.all_probabilities}
          />
        )}
      </div>

      <SatisfactionStats />
      <Reviews />
    </div>
  );
};

export default Home;

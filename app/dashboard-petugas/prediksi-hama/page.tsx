"use client";

import React, { useState, useEffect } from "react";
import DragAndDrop from "../../components/DragAndDrop";
import PredictionResult from "../../components/PredictionResult";
import ButtonCekHama from "../../components/ButtonCekHama";
import { useRouter } from "next/navigation";
import { decodeJWT } from "../../../utils/decodeToken";
import PredictionResultSkeleton from "@/app/components/PredictionResultSkeleton";
import Swal from "sweetalert2";

interface PredictionData {
  success: boolean;
  message: string;
  data: {
    predicted_class: string;
    prediction_percentage: string;
    presentase_predicted_class: string;
    all_probabilities: Record<string, string>;
  };
}

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Set isLoading to false initially
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decoded = decodeJWT(token);
        if (!decoded || (decoded.exp && decoded.exp < Date.now() / 1000)) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [router]);

    const handleFileUpload = async () => {
      if (!selectedFile) {
        // Show SweetAlert2 error alert when no file is selected
        Swal.fire({
          title: 'Peringatan',
          text: 'Please select a file before uploading.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }
    
      const formData = new FormData();
      formData.append("file", selectedFile);
    
      setIsLoading(true); // Set loading to true when the request starts
    
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Show SweetAlert2 error alert when no token is found
          Swal.fire({
            title: 'Kesalahan',
            text: 'No token found. Please login again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          return;
        }
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
    
        if (response.ok) {
          const result = await response.json();
          setPredictionData({
            success: true,
            message: result.message || "Prediction successful",
            data: result.data,
          });
    
          // Show SweetAlert2 success alert on successful upload
          Swal.fire({
            title: 'Berhasil!',
            text: result.message || "Prediction successful",
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          // Show SweetAlert2 error alert on upload failure
          Swal.fire({
            title: 'Gagal!',
            text: "Upload failed.",
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error("Error during file upload:", error);
    
        // Show SweetAlert2 error alert on exception
        Swal.fire({
          title: 'Terjadi Kesalahan',
          text: 'An error occurred during file upload.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setIsLoading(false); // Set loading to false once the request is done
      }
    };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
      </div>
    ); // Show a loading spinner while the request is being processed
  }

  return (
    <div>
      {/* <Header /> */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <DragAndDrop setSelectedFile={setSelectedFile} />
          <ButtonCekHama onClick={handleFileUpload} />
        </div>

        {predictionData && predictionData.data ? (
          <PredictionResult
            pestName={predictionData.data.predicted_class}
            percentage={predictionData.data.prediction_percentage}
            all_probabilities={predictionData.data.all_probabilities}
            halaman="/dashboard-petugas/predictions"
          />
        ) : (
          <PredictionResultSkeleton />
        )}
      </div>
    </div>
  );
};

export default Home;

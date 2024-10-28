"use client"; // This tells Next.js that this is a client component

import React, { useState } from "react";
import Header from "./components/Header";
import DragAndDrop from "./components/DragAndDrop";
import PredictionResult from "./components/PredictionResult";
import SatisfactionStats from "./components/SatisfactionStats";
import Reviews from "./components/Reviews";
import ButtonCekHama from "./components/ButtonCekHama";

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
  const [predictionData, setPredictionData] = useState<PredictionData | null>(
    null
  ); // Use the defined interface
  console.log("ini :", predictionData);
  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected for upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload result:", result);

      // Ensure that the data structure is as expected
      if (result.data) {
        // Use the state setter to update predictionData
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
    <div className="min-h-screen bg-gray-100 py-5 px-40">
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

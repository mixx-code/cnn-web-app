import React from "react";

const PredictionResultSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-lg ">
      {/* Header Section Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-100 text-blue-900 font-bold rounded-t-lg px-4 sm:px-6 py-3 shadow-md">
        <div className="w-1/3 h-6 rounded">Hasil Prediksi</div>
        <div className="text-xl sm:text-2xl mt-2 sm:mt-0">?%</div>
      </div>
      {/* Main Section Skeleton */}
      <div className="flex items-center justify-center bg-blue-500 text-white font-bold text-lg sm:text-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-b-lg shadow-md">
        <div className="capitalize text-center">Hama ?</div>
      </div>
      {/* Probabilities Section Skeleton */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-4 text-center sm:text-left">
          <div className="w-1/2 h-6 rounded mx-auto sm:mx-0">
            Semua Probabilitas
          </div>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <li
              key={index}
              className={`flex justify-between text-gray-800 font-medium text-sm sm:text-lg p-2 rounded-md ${
                index % 2 === 0 ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <div className="flex w-1/2 h-4 rounded text-center items-center">
                ?
              </div>
              <div className="flex w-1/4 h-4 rounded text-center items-center">
                ?
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PredictionResultSkeleton;

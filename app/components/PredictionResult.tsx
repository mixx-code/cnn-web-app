import Link from "next/link";
import React from "react";

interface PredictionResultProps {
  pestName: string; // Nama hama
  percentage: string; // Persentase hasil prediksi
  all_probabilities: Record<string, string>; // Probabilitas semua kelas
  halaman: string; // URL halaman untuk tombol
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  pestName,
  percentage,
  all_probabilities,
  halaman,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-lg ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-100 text-blue-900 font-bold rounded-t-lg px-4 sm:px-6 py-3 shadow-md">
        <span className="text-sm sm:text-base">Hasil prediksi:</span>
        <span className="text-xl sm:text-2xl mt-2 sm:mt-0">
          {parseFloat(percentage).toFixed(2)}%
        </span>
      </div>
      {/* Main Section */}
      <div className="flex items-center justify-center bg-blue-500 text-white font-bold text-lg sm:text-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-b-lg shadow-md">
        <span className="capitalize text-center">
          {pestName.replace(/_/g, " ")}
        </span>
      </div>
      {/* Probabilities Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-4 text-center sm:text-left">
          Semua Probabilitas:
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(all_probabilities).map(([key, value], index) => (
            <li
              key={key}
              className={`flex justify-between text-gray-800 font-medium text-sm sm:text-lg p-2 rounded-md ${
                index % 2 === 0 ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <span className="capitalize">{key.replace(/_/g, " ")}</span>
              <span>{parseFloat(value).toFixed(2)}%</span>
            </li>
          ))}
        </ul>
        {/* Centered Button Section */}
        <div className="flex justify-center mt-4">
          <Link href={halaman}>
            <span className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600">
              Lihat lebih banyak
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;


// import React from "react";

// interface PredictionResultProps {
//   pestName: string; // Define the type of pestName
//   percentage: string; // Define the type of percentage
// }

// const PredictionResult: React.FC<PredictionResultProps> = ({ data }) => {
//   if (!data) return <p>No prediction data available.</p>; // Handling undefined case

//   return (
//     <div className="bg-white p-4 rounded-md shadow-md">
//       <h2 className="text-lg font-bold">Prediction Result</h2>
//       <p>Pest Name: {data.predicted_class}</p>
//       <p>Percentage: {data.presentase_predicted_class}</p>
//       {/* Optionally, display all probabilities */}
//       <div>
//         <h3>All Probabilities:</h3>
//         <ul>
//           {Object.entries(data.all_probabilities).map(([key, value]) => (
//             <li key={key}>
//               {key}: {value}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default PredictionResult;

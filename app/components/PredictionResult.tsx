// app/components/PredictionResult.tsx
import React, { useState } from "react";

interface PredictionResultProps {
  pestName: string; // Define the type of pestName
  percentage: string; // Define the type of percentage
  all_probabilities: Record<string, string>; // Define the type for all_probabilities
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  pestName,
  percentage,
  all_probabilities,
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFeedback = (feedbackValue: string) => {
    setFeedback(feedbackValue);
    // You can send the feedback to your server or handle it as needed
    console.log("User feedback:", feedbackValue);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold">Prediction Result</h2>
      <p>Pest Name: {pestName}</p>
      <p>Percentage: {percentage}</p>
      {/* Optionally, display all probabilities */}
      <div>
        <h3>All Probabilities:</h3>
        <ul>
          {Object.entries(all_probabilities).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>

      {/* Feedback Buttons */}
      <div className="mt-4">
        <h3 className="text-md font-semibold">Give Your Feedback:</h3>
        <div className="flex space-x-4 mt-2">
          <button
            onClick={() => handleFeedback("Puas")}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Puas
          </button>
          <button
            onClick={() => handleFeedback("Kurang Puas")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Kurang Puas
          </button>
          <button
            onClick={() => handleFeedback("Tidak Puas")}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Tidak Puas
          </button>
        </div>

        {feedback && <p className="mt-4">You selected: {feedback}</p>}
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

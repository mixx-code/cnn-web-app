// app/dashboard/predictions/page.tsx
import React from "react";

const Predictions = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Predictions List</h2>
      {/* Tabel atau tampilan data prediksi hama */}
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Pest Type</th>
            <th className="py-2 px-4 text-left">Prediction</th>
          </tr>
        </thead>
        <tbody>
          {/* Contoh data prediksi */}
          <tr className="border-b hover:bg-gray-50">
            <td className="py-2 px-4">1</td>
            <td className="py-2 px-4">Brown Plant Hopper</td>
            <td className="py-2 px-4">80%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Predictions;

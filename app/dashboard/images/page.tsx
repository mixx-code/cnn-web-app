// app/dashboard/images/page.tsx
import React from "react";

const Images = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Images of Pests</h2>
      {/* Menampilkan gambar hama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Contoh gambar */}
        <img
          src="/path/to/image1.jpg"
          alt="Pest 1"
          className="w-full h-auto rounded-lg"
        />
        <img
          src="/path/to/image2.jpg"
          alt="Pest 2"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default Images;

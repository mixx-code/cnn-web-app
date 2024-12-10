import { NextResponse } from "next/server";

// Handler untuk metode POST
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  // Pastikan variabel environment tersedia
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return NextResponse.json(
      { message: "API URL tidak dikonfigurasi." },
      { status: 500 }
    );
  }

  try {
    // Melakukan POST request ke API eksternal
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: req.body, // Ini mengalirkan stream langsung ke API

    });

    // Parsing respons dari API eksternal
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: data.message || "Prediksi gagal" },
        { status: apiResponse.status }
      );
    }

    // Mengembalikan respons sukses
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error saat mengakses API eksternal:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengakses API eksternal." },
      { status: 500 }
    );
  }
}



// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const token = req.headers.get('authorization')?.split(' ')[1];

//   if (!token) {
//     return NextResponse.json(
//       { success: false, message: 'Authentication token is missing' },
//       { status: 401 }
//     );
//   }

//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//       body: req.body, // Forward the form data from the client
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(data, { status: response.status });
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (err) {
//     return NextResponse.json(
//       { success: false, message: 'Error connecting to Flask API' },
//       { status: 500 }
//     );
//   }
// }



// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const formData = await request.formData();

//   try {
//     // Kirim formData ke Flask API untuk memproses gambar dan mendapatkan prediksi
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
//       method: "POST",
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       body: formData,
//     });

//     // Pastikan response OK dari Flask API
//     if (!response.ok) {
//       throw new Error("Failed to get prediction from Flask API");
//     }

//     const data = await response.json();
//     console.log("Data received from Flask API:", data);

//     // Periksa validitas data yang diterima
//     if (!data || !data.predicted_class || !data.probabilities || !data.request_count || !data.role) {
//       throw new Error("Invalid response structure from Flask API");
//     }

//     // Siapkan data respons sesuai format yang diinginkan
//     const predictionData = {
//       success: true,
//       message: "Image uploaded and predictions made successfully.",
//       data: {
//         predicted_class: data.predicted_class,  // Kelas yang diprediksi
//         presentase_predicted_class: data.probabilities[data.predicted_class] || 0,  // Persentase kelas yang diprediksi
//         all_probabilities: data.probabilities || {},  // Probabilitas untuk semua kelas
//         request_count: data.request_count,  // Jumlah permintaan
//         role: data.role  // Peran pengguna (misalnya 'admin', 'user', dll.)
//       },
//     };

//     return NextResponse.json(predictionData, { status: 200 });

//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
//   }
// }

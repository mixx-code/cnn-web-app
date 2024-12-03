import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    // Kirim formData ke Flask API untuk memproses gambar dan mendapatkan prediksi
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    // Pastikan response OK dari Flask API
    if (!response.ok) {
      throw new Error("Failed to get prediction from Flask API");
    }

    const data = await response.json();
    console.log("Data received from Flask API:", data);

    // Periksa validitas data yang diterima
    if (!data || !data.predicted_class || !data.probabilities || !data.request_count || !data.role) {
      throw new Error("Invalid response structure from Flask API");
    }

    // Siapkan data respons sesuai format yang diinginkan
    const predictionData = {
      success: true,
      message: "Image uploaded and predictions made successfully.",
      data: {
        predicted_class: data.predicted_class,  // Kelas yang diprediksi
        presentase_predicted_class: data.probabilities[data.predicted_class] || 0,  // Persentase kelas yang diprediksi
        all_probabilities: data.probabilities || {},  // Probabilitas untuk semua kelas
        request_count: data.request_count,  // Jumlah permintaan
        role: data.role  // Peran pengguna (misalnya 'admin', 'user', dll.)
      },
    };

    return NextResponse.json(predictionData, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

// Handler untuk metode POST
export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Pastikan variabel environment tersedia
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return NextResponse.json(
      { message: "API URL tidak dikonfigurasi." },
      { status: 500 }
    );
  }

  try {
    // Melakukan POST request ke API eksternal
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Parsing respons dari API eksternal
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: data.message || "Login gagal." },
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

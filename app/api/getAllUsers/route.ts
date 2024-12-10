import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {  // Menambahkan tipe NextRequest untuk parameter req
  const BACKEND_URL = 'http://localhost:5001/get-all-users'; // URL backend Flask Anda
  const token = req.headers.get('Authorization'); // Ambil token dari header permintaan

  // Retrieve the 'page' and 'per_page' query parameters from the request URL
  const page = req.nextUrl.searchParams.get('page') || '1';  // Default to '1' if no page is provided
  const perPage = req.nextUrl.searchParams.get('per_page') || '10';  // Default to '10' if no per_page is provided
  console.log("page : ", page)
  console.log("perPage : ", perPage)
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token is missing.' },
      { status: 403 }
    );
  }

  try {
    // Construct the query parameters string
    const queryParams = new URLSearchParams({
      page,
      per_page: perPage
    });

    // Make the fetch request to the backend with the query parameters
    const response = await fetch(`${BACKEND_URL}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: token, // Kirim token ke backend
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status }); // Forward error dari backend
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error accessing backend:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to connect to backend.' },
      { status: 500 }
    );
  }
}

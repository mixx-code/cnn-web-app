import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // URL of the backend Flask API
  const BACKEND_URL = 'http://localhost:5001/register-admin'; // Change this URL to match your Flask API endpoint
  const token = req.headers.get('Authorization'); // Ambil token dari header permintaan

  // If the token is missing, return a 403 response
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token is missing.' },
      { status: 403 }
    );
  }

  try {
    // Parse the incoming request body to get admin data (name, username, password, etc.)
    const { name, username, password } = await req.json();

    // Forward the request to the backend with the token and admin data
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        Authorization: token, // Pass token to backend API
        'Content-Type': 'application/json', // Ensure the correct content type
      },
      body: JSON.stringify({ name, username, password }), // Send the admin data in the body
    });

    // Parse the response from the backend
    const data = await response.json();

    // If the backend returns an error, forward the error response
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Return the successful response from the backend
    return NextResponse.json(data, { status: 201 }); // Status 201 for successful creation
  } catch (error) {
    // If an error occurs while connecting to the backend, return a 500 error
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user.' },
      { status: 500 }
    );
  }
}

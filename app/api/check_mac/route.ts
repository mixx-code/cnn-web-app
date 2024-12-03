// app/api/check_mac/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const { mac_address } = await request.json();

    if (!mac_address) {
      return NextResponse.json({ error: "MAC address is required" }, { status: 400 });
    }

    // Make the API call to the Flask server (adjust the URL as per your Flask setup)
    const flaskApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/check_mac`;

    const response = await fetch(flaskApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mac_address }),
    });

    const result = await response.json();

    if (response.ok) {
      // Return the result from Flask to the client
      return NextResponse.json(result, { status: 200 });
    } else {
      // If the Flask API returns an error, forward that to the client
      return NextResponse.json(result, { status: response.status });
    }
  } catch (error) {
    console.error("Error communicating with Flask API:", error);
    return NextResponse.json(
      { error: "Failed to check MAC address" },
      { status: 500 }
    );
  }
}

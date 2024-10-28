import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    const response = await fetch("EXTERNAL_API_URL_HERE", {
      method: "POST",
      body: formData, // Forward the form data to the external API
    });

    const data = await response.json();
    
    // Prepare the predictionData object as per your requirements
    const predictionData = {
      success: true,
      message: "Prediction successful",
      data: {
        predicted_class: data.predicted_class,
        presentase_predicted_class: data.probabilities[data.predicted_class],
        all_probabilities: data.probabilities,
      },
    };

    // Return the structured response
    return NextResponse.json(predictionData, { status: response.status });
  } catch (error) {
    console.error("Error forwarding request:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

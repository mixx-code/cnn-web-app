// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, email, role } = req.body;

      // Simulasi penyimpanan data ke database
      console.log("Received user data:", { name, email, role });

      // Return success response
      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

import jwt, { JwtPayload } from "jsonwebtoken";

// SECRET_KEY untuk memverifikasi token
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "default_secret";

// Fungsi untuk mendekode JWT (tanpa verifikasi)
export const decodeJWT = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token); // Hanya mendekode payload
    return decoded as JwtPayload | null; // Memastikan tipe data
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Fungsi untuk memverifikasi JWT (opsional jika Anda ingin memverifikasi)
export const verifyJWT = (token: string): JwtPayload | null => {
  try {
    const verified = jwt.verify(token, SECRET_KEY) as JwtPayload;
    return verified;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
};

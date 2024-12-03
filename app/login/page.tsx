/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { decodeJWT } from "../../utils/decodeToken";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading
  const [decodedToken, setDecodedToken] = useState<any>(null);

  const router = useRouter(); // Inisialisasi useRouter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading ke true saat proses login dimulai

    if (!username || !password) {
      setError("Username dan password harus diisi.");
      setLoading(false); // Set loading kembali ke false jika validasi gagal
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Username atau password salah.");
      }

      // Menangkap data dari response JSON
      const data = await response.json();

      if (data.success) {
        const token = data.data.token;
        // Menyimpan token ke dalam localStorage
        localStorage.setItem("token", token);

        // Dekode token menggunakan decodeJWT
        const decoded = decodeJWT(token);
        setDecodedToken(decoded); // Menyimpan decoded token ke state

        alert("Login berhasil!");

        // Cek apakah user adalah admin
        if (decoded && decoded.is_admin) {
          // Redirect ke dashboard jika is_admin true
          router.push("/dashboard");
        } else if (decoded) {
          // Redirect ke root jika is_admin false
          router.push("/dashboard-user");
        }
      } else {
        setError(data.message || "Login gagal.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false); // Set loading kembali ke false setelah proses selesai
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h1 className="text-xl font-bold text-center text-black mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Masukkan username"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Masukkan password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Disabled saat loading
            className={`w-full py-2 rounded-md shadow font-medium ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Loading..." : "Login"} {/* Teks berubah saat loading */}
          </button>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

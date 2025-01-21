/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { decodeJWT } from "../../utils/decodeToken";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

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
    setLoading(true); // Set loading to true when the login process starts
  
    if (!username || !password) {
      setError("Username dan password harus diisi.");
      setLoading(false); // Set loading back to false if validation fails
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
  
      // Capture the data from the JSON response
      const data = await response.json();
  
      if (data.success) {
        const token = data.data.token;
        // Save token to localStorage
        localStorage.setItem("token", token);
  
        // Decode the token using decodeJWT
        const decoded = decodeJWT(token);
        setDecodedToken(decoded); // Save the decoded token to state
  
        // Show SweetAlert2 success alert for successful login
        Swal.fire({
          title: 'Login Berhasil!',
          text: 'Selamat datang, Anda berhasil login!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
  
        // Check if is_admin is true
        if (decoded && decoded.is_admin) {
          // Redirect to dashboard if is_admin is true
          router.push("/dashboard");
        } else if (decoded) {
          // Redirect to the user dashboard if is_admin is false
          router.push("/dashboard-petugas");
        }
      } else {
        setError(data.message || "Login gagal.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false); // Set loading back to false after the process ends
    }
  };
  

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100 ">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-lg">
        <div className="flex justify-center mb-4">
          <Image src="/assets/img/logo.png" alt="Logo" height={64} width={64} />
        </div>

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
            disabled={loading}
            className={`w-full py-2 rounded-md shadow font-medium ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </form>
      </div>
      <p className="mt-4 text-sm text-gray-500 text-center lowercase">
        pemerintah kabupaten lebak kecamatan cikulur desa sumurbandung <br/> Koperasi Buru Tani
      </p>
    </div>
  );
};

export default LoginPage;

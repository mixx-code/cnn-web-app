"use client";
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal"; // Import modal
import ModalEditUser from "../../components/ModalEditUser";
import Link from "next/link";
import { decodeJWT } from "@/utils/decodeToken";
import { useRouter } from "next/navigation";

interface User {
  user_id: number;
  admin_id: number;
  name: string;
  username: string;
  password: string;
  created_at: string;
}

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditUserOpen, setIsModalEditUserOpen] =
    useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cursor, setCursor] = useState<number | null>(null); // Cursor state for pagination
  const [hasMore, setHasMore] = useState(true); // State to check if there's more data
  const [history, setHistory] = useState<User[]>([]);
  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const fetchHistory = async (newCursor: number | null = null) => {
    const token = localStorage.getItem("token");
    const decoded = token ? decodeJWT(token) : null;

    if (!token || !decoded) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/get-all-users?cursor=${
          newCursor || ""
        }&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch history");
        return;
      }

      const data = await response.json();
      console.log("data : ", data);

      if (data?.data && Array.isArray(data.data)) {
        const formattedHistory = data.data.map((item: any) => ({
          user_id: item.user_id,
          admin_id: item.admin_id,
          name: item.name,
          username: item.username,
          password: item.password,
          created_at: item.created_at,
        }));

        setHistory((prev) => {
          const uniqueItems = formattedHistory.filter(
            (newItem) =>
              !prev.some((oldItem) => oldItem.user_id === newItem.user_id)
          );
          return [...prev, ...uniqueItems];
        });

        setCursor(data.next_cursor);
        setHasMore(Boolean(data.next_cursor)); // Check if there's more data
        console.log("hasmore: ", Boolean(data.next_cursor));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const loadMore = () => {
    if (cursor) {
      fetchHistory(cursor);
    }
  };

  // Fetch user data from the backend with pagination
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const token = localStorage.getItem("token"); // Get token from localStorage

  //     if (!token) {
  //       setError("Token is missing. Please log in.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         `/api/getAllUsers?page=${currentPage}&per_page=${usersPerPage}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Include token in header
  //           },
  //         }
  //       );

  //       const data = await response.json();

  //       if (!response.ok) {
  //         setError(data.message || "Failed to fetch users.");
  //         setIsLoading(false);
  //         return;
  //       }

  //       setUsers(data.data || []); // Save users data in state
  //       setTotalPages(data.totalPages || 1); // Save total pages
  //       setIsLoading(false); // Stop loading after data is fetched
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //       setError("An unexpected error occurred.");
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUsers();
  // }, [currentPage]); // Refetch when currentPage changes

  const handleEdit = (userId: number) => {
    console.log("Edit user with ID:", userId);

    const user = history.find((user) => user.user_id === userId);
    console.log("id user: ", user);
    setUserToEdit(user || null);
    setIsModalEditUserOpen(true);
  };

  const handleDelete = async (userId: number): Promise<void> => {
    const apiUrl = `http://127.0.0.1:5001/delete-user/${userId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE", // Menggunakan metode HTTP DELETE untuk menghapus data
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Menambahkan token jika diperlukan
          "Content-Type": "application/json", // Tambahkan jika server memerlukan content type
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("User deleted successfully:", result);
      window.location.reload(); // This will reload the page

      // Tindakan tambahan setelah penghapusan berhasil
      alert("User berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Terjadi kesalahan saat menghapus user.");
    }
  };

  const handleCloseModal = () => {
    setIsModalEditUserOpen(false);
    setUserToEdit(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin border-t-4 border-blue-500 border-solid rounded-full w-16 h-16"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 lg:px-20">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <span>
            <Link href="/dashboard">
              <span className="inline-flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg mb-6 hover:bg-blue-600 transition duration-300 cursor-pointer">
                <span className="mr-2">&larr;</span> Kembali
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-black mb-6">Data User</h1>
          </span>
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add User
          </button>
        </div>

        {/* Table for displaying users */}
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm">
              <th className="border border-gray-300 p-3">#</th>
              <th className="border border-gray-300 p-3">ID User</th>
              <th className="border border-gray-300 p-3">ID Admin</th>
              <th className="border border-gray-300 p-3">Name</th>
              <th className="border border-gray-300 p-3">Username</th>
              <th className="border border-gray-300 p-3">Password</th>
              <th className="border border-gray-300 p-3">Created At</th>
              <th className="border border-gray-300 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td className="py-2 px-4 text-black text-center" colSpan={7}>
                  No users found.
                </td>
              </tr>
            ) : (
              history.map((user, index) => (
                <tr
                  key={user.user_id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } hover:bg-blue-100 transition duration-300`}
                >
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.user_id}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.admin_id}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.name}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {user.password}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    {new Date(user.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-black">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                      onClick={() => handleEdit(user.user_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(user.user_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-2 border-blue-500 rounded-full animate-spin"></div>
              ) : (
                "Muat Lebih Banyak"
              )}
            </button>
          </div>
        )}
        {/* Modal Form Add User */}
        <Modal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          title="Add New User"
        />

        {isModalEditUserOpen && userToEdit && (
          <ModalEditUser user={userToEdit} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default Users;

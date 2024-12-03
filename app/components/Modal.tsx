// components/Modal.tsx
import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  toggleModal,
  title,
  children,
}) => {
  if (!isOpen) return null;

  const handleSave = async () => {
    // Logic to submit form data (assuming handleSubmit is part of the form component)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          role: "User",
        }),
      });

      if (response.ok) {
        console.log("User added successfully");
        // Optionally close the modal after successful submission
        toggleModal();
      } else {
        console.error("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={toggleModal}
            className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave} // Trigger form submission here
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

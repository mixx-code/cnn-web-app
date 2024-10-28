import React, { useState, useCallback, ChangeEvent, DragEvent } from "react";

interface DragAndDropProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ setSelectedFile }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file); // Update the file in the parent component
        setPreviewUrl(URL.createObjectURL(file));
        console.log("File selected:", file.name);
      }
    },
    [setSelectedFile]
  );

  // Handle Drag Over
  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  // Handle Drop
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) {
        setSelectedFile(file); // Update the file in the parent component
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [setSelectedFile]
  );

  return (
    <div
      id="dropzone"
      className="border-2 border-dashed border-green-700 flex items-center justify-center h-80 mb-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="h-full object-contain" />
      ) : (
        <p className="text-gray-500 text-center">
          Drag and Drop
          <br />
          Upload Image
        </p>
      )}

      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default DragAndDrop;

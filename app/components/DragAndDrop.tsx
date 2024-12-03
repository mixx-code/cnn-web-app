import React, {
  useState,
  useCallback,
  useRef,
  ChangeEvent,
  DragEvent,
} from "react";

interface DragAndDropProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ setSelectedFile }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file selection
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

  // Handle drag over
  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  // Handle file drop
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

  // Handle deleting the image
  const handleDeleteImage = useCallback(() => {
    setPreviewUrl(null);
    setSelectedFile(null);

    // Reset the input value after deleting the image
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value
    }
  }, [setSelectedFile]);

  // Trigger file input click using ref
  const triggerFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      id="dropzone"
      className="border-2 border-dashed border-green-700 flex items-center justify-center h-80 mb-4 cursor-pointer relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={triggerFileInputClick} // Clicking the dropzone triggers the file input
    >
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="Preview"
            className="h-full object-contain"
          />
          {/* Delete button */}
          <button
            onClick={handleDeleteImage}
            className="absolute z-10 -top-2 -right-5 bg-red-600 text-white rounded-full p-1 w-8"
          >
            X
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-center">
          Drag and Drop
          <br />
          or click to upload
        </p>
      )}

      {/* File input for selecting images */}
      <input
        ref={fileInputRef}
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

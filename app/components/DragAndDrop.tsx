import React, {
  useState,
  useCallback,
  useRef,
  ChangeEvent,
  DragEvent,
} from "react";
import Image from "next/image";
interface DragAndDropProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ setSelectedFile }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [setSelectedFile]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [setSelectedFile]
  );

  const handleDeleteImage = useCallback(() => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setSelectedFile]);

  const triggerFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      id="dropzone"
      className="border-2 border-dashed border-green-700 flex items-center justify-center h-80 mb-4 cursor-pointer relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={triggerFileInputClick}
    >
      {previewUrl ? (
        <>
          <Image
            src={previewUrl}
            alt="Preview"
            fill // Untuk memastikan gambar memenuhi container-nya
            className="object-contain h-full"
          />
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
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default DragAndDrop;

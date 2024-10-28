interface ButtonCekHamaProps {
  onClick: () => void;
}

const ButtonCekHama: React.FC<ButtonCekHamaProps> = ({ onClick }) => {
  return (
    <button
      className="w-full bg-gray-300 py-2 text-gray-700 rounded-md mt-4"
      onClick={onClick}
    >
      Cek Jenis Hama
    </button>
  );
};

export default ButtonCekHama;

import React from 'react';

const ConvertButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
    >
      {loading ? "Convirtiendo..." : "Convertir a Word"}
    </button>
  );
};

export default ConvertButton;

import React from 'react';

const FileInput = ({ onFileChange }) => {
  return (
    <input
      type="file"
      accept=".pdf"
      onChange={onFileChange}
      className="mb-4 p-2 border border-gray-300 rounded"
    />
  );
};

export default FileInput;

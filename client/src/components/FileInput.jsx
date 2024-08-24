import React from 'react';

const FileInput = ({ onFileChange }) => {
  return (
    <input
      type="file"
      accept=".pdf"
      onChange={onFileChange}
      className="mb-4 p-2 border border-gray-500 rounded bg-[#e9e7e7] dark:bg-gray-900 dark:border-gray-100 transition-colors duration-300"
    />
  );
};

export default FileInput;

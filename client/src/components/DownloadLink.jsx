import React from 'react';

const DownloadLink = ({ fileURL }) => {
  return (
    <a
      href={fileURL}
      download="converted.docx"
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
    >
      Descargar archivo Word
    </a>
  );
};

export default DownloadLink;

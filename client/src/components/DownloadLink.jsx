import React from 'react';

const DownloadLink = ({ fileURL }) => {
  return (
    <a
      href={fileURL}
      download="converted.docx"
      className="bg-[#929090] hover:bg-[#BDBDBD] text-white font-bold py-2 px-4 rounded"
    >
      Descargar archivo Word
    </a>
  );
};

export default DownloadLink;

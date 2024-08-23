import React, { useState, useEffect } from "react";
import axios from "axios";
import { Hourglass } from "react-loader-spinner";
import FileInput from "./FileInput";
import ConvertButton from "./ConvertButton";
import DownloadLink from "./DownloadLink";

const PdfToWordConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      setError("Por favor, selecciona un archivo PDF");
      return;
    }

    setLoading(true); // Mostrar el loader
    setError(null);
    setElapsedTime(0); // Reiniciar el tiempo transcurrido

    // Iniciar el temporizador
    const startTime = Date.now();
    const timerId = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); // Tiempo en segundos
    }, 1000);
    setTimer(timerId);

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/pdf-to-word",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Para recibir el archivo convertido
        }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      setConvertedFile(fileURL);
    } catch (error) {
      setError("Hubo un problema con la conversión. Intenta de nuevo.");
    } finally {
      setLoading(false); // Ocultar el loader
      if (timer) clearInterval(timer); // Detener el temporizador
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-full">
          <Hourglass
            visible={true}
            height="100"
            width="100"
            ariaLabel="three-circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={["#ce6c30", "#edb672"]}
          />
          <p className="text-slate-900 mt-10">
            Convirtiendo, Espere un momento...{" "}
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-2 text-black">
            Convertir PDF a Word
          </h1>

          <FileInput onFileChange={handleFileChange} />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <ConvertButton onClick={handleConvert} loading={loading} />
          {convertedFile && <DownloadLink fileURL={convertedFile} />}
        </>
      )}
    </div>
  );
};

export default PdfToWordConverter;

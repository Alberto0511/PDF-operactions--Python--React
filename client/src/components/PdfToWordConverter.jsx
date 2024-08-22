import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";

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
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-full">
          <ThreeCircles
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="three-circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <p className="text-white mt-4">
            Tiempo de carga: {elapsedTime} segundos
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 text-white">
            Convertir PDF a Word
          </h1>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={handleConvert}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
          >
            {loading ? "Convirtiendo..." : "Convertir a Word"}
          </button>
          {convertedFile && (
            <a
              href={convertedFile}
              download="converted.docx"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Descargar archivo Word
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default PdfToWordConverter;

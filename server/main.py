from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from pdf2docx import Converter
import io
import tempfile
import os
from starlette.responses import Response
from starlette.middleware.cors import CORSMiddleware
from PyPDF2 import PdfMerger

# Definir el límite de tamaño final del PDF unido (20 MB en este ejemplo)
MAX_FINAL_SIZE = 20 * 1024 * 1024  # 20 MB

app = FastAPI()

# Configurar CORS para permitir solicitudes desde el frontend
origins = [
    "http://localhost:5173",  # Aquí pones la URL de tu frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permitir solo estas URLs
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Middleware para limitar el tamaño de los archivos (10 MB en este ejemplo)
@app.middleware("http")
async def limit_file_size(request: Request, call_next):
    max_size = 10 * 1024 * 1024  # 10 MB
    content_length = int(request.headers.get('Content-Length', 0))
    if content_length > max_size:
        return Response(content="El archivo es demasiado grande", status_code=413)
    return await call_next(request)

@app.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    # Validar que el archivo tenga la extensión .pdf
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")

    try:
        # Leer el contenido del archivo PDF
        contenido = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error al leer el archivo")

    try:
        # Crear un archivo temporal para almacenar el PDF
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
            temp_pdf.write(contenido)
            temp_pdf.flush()

            # Crear un buffer en memoria para el documento Word
            doc_buffer = io.BytesIO()

            # Convertir el PDF a Word
            convertir = Converter(temp_pdf.name)
            convertir.convert(doc_buffer, keep_images=True, keep_tables=True, keep_styles=True)
            convertir.close()

        # Preparar la respuesta con el archivo convertido
        doc_buffer.seek(0)
        headers = {
            "Content-Disposition": "attachment; filename=converted.docx"
        }
        return Response(
            content=doc_buffer.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers=headers
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conversión: {str(e)}")
    finally:
        # Eliminar el archivo temporal para liberar espacio
        os.unlink(temp_pdf.name)


@app.post("/merge-pdfs")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="Debes subir al menos un archivo PDF")

    merger = PdfMerger()
    temp_files = []  # Lista para almacenar los archivos temporales

    try:
        # Procesar cada archivo PDF y añadirlo al merger
        for file in files:
            if not file.filename.endswith(".pdf"):
                raise HTTPException(status_code=400, detail=f"El archivo {file.filename} no es un PDF")

            # Leer el contenido del archivo PDF
            pdf_bytes = await file.read()

            # Crear un archivo temporal para agregarlo al merger
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
                temp_pdf.write(pdf_bytes)
                temp_pdf.flush()
                temp_files.append(temp_pdf.name)  # Almacenar el nombre del archivo

                # Añadir el archivo PDF al merger
                merger.append(temp_pdf.name)

        # Crear un buffer en memoria para el PDF unido
        output_buffer = io.BytesIO()
        merger.write(output_buffer)
        merger.close()

        # Verificar el tamaño del archivo final
        final_size = output_buffer.getbuffer().nbytes
        if final_size > MAX_FINAL_SIZE:
            raise HTTPException(status_code=413, detail=f"El archivo final unido es demasiado grande: {final_size / (1024 * 1024):.2f} MB. El límite es de {MAX_FINAL_SIZE / (1024 * 1024):.2f} MB.")

        # Preparar la respuesta con el archivo PDF unido
        output_buffer.seek(0)
        headers = {
            "Content-Disposition": "attachment; filename=merged.pdf"
        }

        return Response(
            content=output_buffer.getvalue(),
            media_type="application/pdf",
            headers=headers
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al unir los PDFs: {str(e)}")
    
    finally:
        # Eliminar archivos temporales
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                os.unlink(temp_file)

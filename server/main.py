from fastapi import FastAPI, UploadFile, File, HTTPException
from pdf2docx import Converter
import io
import tempfile
from starlette.responses import Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Agregar la url del front
#uvicorn main:app --reload

origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permitir solo estas URLs
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

@app.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
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
            convertir.convert(doc_buffer)
            convertir.close()

        # Preparar la respuesta
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
        raise HTTPException(status_code=500, detail=f"Error de conversión: {e}")


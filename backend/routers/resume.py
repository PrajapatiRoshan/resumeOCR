import traceback
from fastapi import APIRouter
import io
from fastapi.responses import JSONResponse
import pdfplumber
import pytesseract
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Optional
from constant import OpenAIClient
from utility import APIException

router = APIRouter(prefix="/resume")


@router.post("/extract")
async def extract_resume(files: List[UploadFile] = File(...)):

    try:
        if not files:
            raise APIException(status_code=400, detail="No files uploaded.")

        combined_text = ""

        for file in files:

            if not (file.filename.endswith(".pdf") or file.filename.lower().endswith((".jpg", ".jpeg", ".png"))):
                raise APIException(
                    status_code=400, detail="Only PDF or image files are supported.")

            print("file", file)

            # 🧾 If PDF
            if file.filename.endswith(".pdf"):
                pdf_bytes = await file.read()
                with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                    for page in pdf.pages:
                        combined_text += page.extract_text() or ""

            # 🖼️ If Image
            else:
                image_bytes = await file.read()
                image = Image.open(io.BytesIO(image_bytes))
                extracted_text = pytesseract.image_to_string(image)
                combined_text += extracted_text + "\n"

        if not combined_text.strip():
            raise APIException(
                status_code=400, detail="Could not extract any text from the file.")

        print("extracted_text", combined_text)

        prompt = f"""
    Extract candidate details from this resume text:

    {combined_text}

Fields:
- full_name: Candidate's full name
- email: Candidate's email address
- phone_number: Candidate's contact number (if available)
- location: Candidate's city or address (if mentioned)
- skills: List of technical skills or relevant skills
- experience_years: Total years of experience (if mentioned)
- education: Degree(s), major(s), institutions
- current_job: Latest job position/title
- companies_worked_at: List of past employers
- linkedin: LinkedIn profile URL (if available)
- certifications: List of certifications (if mentioned)

Return the output strictly in JSON format that matches the ResumeData model.
    """

        class ResumeData(BaseModel):
            full_name: str
            email: str
            phone_number: Optional[str] = None
            location: Optional[str] = None
            skills: Optional[List[str]] = []
            experience_years: Optional[str] = None
            education: Optional[List[str]] = None
            current_job: Optional[str] = None
            companies_worked_at: Optional[List[str]] = []
            linkedin: Optional[str] = None
            certifications: Optional[List[str]] = []

        response = OpenAIClient.responses.parse(
            model="gpt-4.1-mini",
            input=[
                {"role": "system", "content": "Extract candidate details in JSON format."},
                {"role": "user", "content": prompt},
            ],
            text_format=ResumeData)

        structured_data = response.output_parsed

        print("structured_data", structured_data)

        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "file_name": [file.filename for file in files],
                "extracted_data": structured_data.model_dump(),
                "message": "Resume data extracted successfully."
            }
        )

    except APIException as ae:
        return JSONResponse(
            status_code=ae.status_code,
            content={
                "status": "failed",
                "error": str(ae),
                "message": "Unable to process the request."
            }
        )
    except Exception as e:
        print(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={
                "status": "failed",
                "error": str(e),
                "message": "Unable to process the request."
            }
        )

# FastAPI backend

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import os
from typing import List
from models import Frame
from parser import extract_frames_from_docx, extract_frames_from_pdf
from export import generate_pdf

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRAMES_FILE = "frames.json"


def load_frames():
    """Load frames from JSON file"""
    if os.path.exists(FRAMES_FILE):
        with open(FRAMES_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return [Frame(**frame) for frame in data]
    return []


def save_frames(frames: List[Frame]):
    """Save frames to JSON file"""
    with open(FRAMES_FILE, 'w', encoding='utf-8') as f:
        json.dump([frame.dict() for frame in frames], f, indent=2, ensure_ascii=False)


@app.get("/")
async def root():
    return {"message": "Frame Extractor API"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and parse document to extract frames"""
    temp_file_path = None
    try:
        # Validate file type
        if not (file.filename.endswith('.docx') or file.filename.endswith('.pdf')):
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload DOCX or PDF.")
        
        # Save uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Verify file was saved
        if not os.path.exists(temp_file_path):
            raise HTTPException(status_code=500, detail="Failed to save uploaded file")
        
        # Extract frames based on file type
        try:
            if file.filename.endswith('.docx'):
                frames = extract_frames_from_docx(temp_file_path)
            elif file.filename.endswith('.pdf'):
                frames = extract_frames_from_pdf(temp_file_path)
        except Exception as parse_error:
            raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(parse_error)}")
        
        # Save frames
        save_frames(frames)
        
        return {
            "message": "File processed successfully",
            "frames_count": len(frames),
            "frames": [frame.dict() for frame in frames]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    finally:
        # Clean up temp file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except:
                pass


@app.get("/frames")
async def get_frames():
    """Get all extracted frames"""
    frames = load_frames()
    return {"frames": [frame.dict() for frame in frames]}


@app.post("/save")
async def save_frame_updates(frames: List[Frame]):
    """Update frame details"""
    try:
        save_frames(frames)
        return {"message": "Frames updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/export")
async def export_pdf():
    """Generate and download PDF with all frames"""
    try:
        frames = load_frames()
        
        if not frames:
            raise HTTPException(status_code=400, detail="No frames to export")
        
        pdf_buffer = generate_pdf(frames)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=frames_export.pdf"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


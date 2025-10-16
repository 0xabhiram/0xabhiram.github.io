# Document parser for extracting frames

import re
from docx import Document
import PyPDF2
from models import Frame


def extract_frames_from_docx(file_path):
    """Extract frames from DOCX file"""
    try:
        doc = Document(file_path)
        full_text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        if not full_text.strip():
            raise ValueError("Document appears to be empty or could not be read")
        return parse_frames(full_text)
    except Exception as e:
        raise Exception(f"Error reading DOCX file: {str(e)}")


def extract_frames_from_pdf(file_path):
    """Extract frames from PDF file"""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            full_text = ""
            for page in pdf_reader.pages:
                full_text += page.extract_text() + "\n"
        
        if not full_text.strip():
            raise ValueError("PDF appears to be empty or could not be read")
        return parse_frames(full_text)
    except Exception as e:
        raise Exception(f"Error reading PDF file: {str(e)}")


def parse_frames(text):
    """Parse text to extract frames"""
    frames = []
    
    if not text or not text.strip():
        return frames
    
    # Split by Frame X: pattern
    pattern = r'Frame\s+(\d+)\s*:'
    parts = re.split(pattern, text, flags=re.IGNORECASE)
    
    # parts[0] is text before first frame (ignore)
    # parts[1] = frame number, parts[2] = content, parts[3] = frame number, parts[4] = content, ...
    for i in range(1, len(parts), 2):
        if i + 1 < len(parts):
            frame_num = parts[i].strip()
            content = parts[i + 1].strip()
            
            # Remove next frame marker if present
            content_lines = content.split('\n')
            cleaned_content = []
            for line in content_lines:
                if re.match(r'Frame\s+\d+\s*:', line, re.IGNORECASE):
                    break
                cleaned_content.append(line)
            
            cleaned_text = '\n'.join(cleaned_content).strip()
            
            # Only add frame if it has content
            if cleaned_text:
                frame = Frame(
                    frame_number=frame_num,
                    content=cleaned_text
                )
                frames.append(frame)
    
    return frames


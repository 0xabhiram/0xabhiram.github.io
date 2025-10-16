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
    """Parse text to extract frames - supports multiple formats"""
    frames = []
    
    if not text or not text.strip():
        return frames
    
    # Try different frame patterns
    patterns = [
        # Pattern 1: "Frame 1:" format
        r'Frame\s+(\d+)\s*:(.*?)(?=Frame\s+\d+\s*:|$)',
        # Pattern 2: "Frame 1 [timestamp] format
        r'Frame\s+(\d+)\s*\[([^\]]*)\]\s*(.*?)(?=Frame\s+\d+\s*\[|Frame\s+\d+\s*:|$)',
        # Pattern 3: "Frame 1" followed by newline
        r'Frame\s+(\d+)\s*\n(.*?)(?=Frame\s+\d+\s*|$)',
        # Pattern 4: "Frame 1 -" format
        r'Frame\s+(\d+)\s*-\s*(.*?)(?=Frame\s+\d+\s*-|$)'
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
        
        for match in matches:
            frame_num = match.group(1).strip()
            
            if len(match.groups()) == 2:
                # Pattern 1, 3, 4: content is in group 2
                content = match.group(2).strip()
            elif len(match.groups()) == 3:
                # Pattern 2: timestamp in group 2, content in group 3
                timestamp = match.group(2).strip()
                content = match.group(3).strip()
                
                # Include timestamp in content if present
                if timestamp:
                    content = f"[{timestamp}] {content}"
            
            # Clean up content
            content_lines = content.split('\n')
            cleaned_content = []
            for line in content_lines:
                if re.match(r'Frame\s+\d+\s*', line, re.IGNORECASE):
                    break
                cleaned_content.append(line)
            
            cleaned_text = '\n'.join(cleaned_content).strip()
            
            # Only add frame if it has content and doesn't already exist
            if cleaned_text and not any(f.frame_number == frame_num for f in frames):
                frame = Frame(
                    frame_number=frame_num,
                    content=cleaned_text
                )
                frames.append(frame)
        
        # If we found frames with this pattern, stop trying other patterns
        if frames:
            break
    
    # Sort frames by frame number
    frames.sort(key=lambda x: int(x.frame_number))
    
    return frames


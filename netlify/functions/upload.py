import json
import os
from http.server import BaseHTTPRequestHandler
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../../backend'))

from parser import extract_frames_from_docx, extract_frames_from_pdf
from models import Frame
import tempfile

def handler(event, context):
    """Netlify serverless function for file upload"""
    try:
        # Parse the request
        if event['httpMethod'] != 'POST':
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
        
        # Get file data from request
        body = json.loads(event['body'])
        file_content = body.get('content')
        filename = body.get('filename', 'uploaded_file')
        
        if not file_content:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'No file content provided'})
            }
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix='.txt', delete=False) as temp_file:
            temp_file.write(file_content.encode())
            temp_file_path = temp_file.name
        
        try:
            # Extract frames
            if filename.endswith('.docx'):
                frames = extract_frames_from_docx(temp_file_path)
            elif filename.endswith('.pdf'):
                frames = extract_frames_from_pdf(temp_file_path)
            else:
                # Assume text file
                frames = []
                content = file_content
                # Simple frame parsing for text
                import re
                pattern = r'Frame\s+(\d+)\s*:'
                parts = re.split(pattern, content, flags=re.IGNORECASE)
                
                for i in range(1, len(parts), 2):
                    if i + 1 < len(parts):
                        frame_num = parts[i].strip()
                        content = parts[i + 1].strip()
                        if content:
                            frame = Frame(frame_number=frame_num, content=content)
                            frames.append(frame)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'File processed successfully',
                    'frames_count': len(frames),
                    'frames': [frame.dict() for frame in frames]
                })
            }
            
        finally:
            # Clean up temp file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }

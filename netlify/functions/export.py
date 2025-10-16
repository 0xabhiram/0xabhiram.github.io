import json
import base64
import io
from http.server import BaseHTTPRequestHandler
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../../backend'))

from export import generate_pdf
from models import Frame

def handler(event, context):
    """Netlify serverless function for PDF export"""
    try:
        if event['httpMethod'] != 'POST':
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
        
        # Parse frames from request body
        body = json.loads(event['body'])
        frames_data = body.get('frames', [])
        
        if not frames_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'No frames data provided'})
            }
        
        # Convert to Frame objects
        frames = [Frame(**frame_data) for frame_data in frames_data]
        
        # Generate PDF
        pdf_buffer = generate_pdf(frames)
        pdf_data = pdf_buffer.getvalue()
        
        # Encode as base64 for JSON response
        pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'pdf': pdf_base64,
                'filename': 'frames_export.pdf'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }

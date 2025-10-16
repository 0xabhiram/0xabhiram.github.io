# Frame Extractor Web App

A simple web application to extract, edit, and export story frames from DOCX and PDF documents.

## Features

- 📤 Upload DOCX or PDF documents
- 🔍 Automatically extract frames (Frame 1:, Frame 2:, etc.)
- ✏️ Edit frame details in an intuitive UI
- 📄 Export all frames as a formatted PDF document
- 🚀 Host-ready for Render (free hosting)

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Document Parsing**: python-docx, PyPDF2
- **PDF Export**: ReportLab
- **Storage**: JSON file (no database required)

## Project Structure

```
project/
├── backend/
│   ├── main.py           # FastAPI application with endpoints
│   ├── parser.py         # Frame extraction logic
│   ├── export.py         # PDF generation
│   ├── models.py         # Pydantic models
│   └── frames.json       # Temporary data storage
├── frontend/
│   ├── index.html        # Main UI
│   ├── script.js         # Frontend logic
│   └── style.css         # Styling
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Installation

1. **Clone the repository**
   ```bash
   cd ProjectX-main
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Running Locally

1. **Start the backend server**
   ```bash
   cd backend
   python main.py
   ```
   The API will be available at `http://localhost:8000`

2. **Open the frontend**
   - Open `frontend/index.html` in your web browser
   - Or use a simple HTTP server:
     ```bash
     cd frontend
     python -m http.server 3000
     ```
   - Then visit `http://localhost:3000`

## API Endpoints

- `POST /upload` - Upload and parse document
- `GET /frames` - Retrieve all frames
- `POST /save` - Save frame updates
- `GET /export` - Generate and download PDF

## Frame Format

The application looks for frames in the following format in your document:

```
Frame 1:
Your content here...

Frame 2:
More content...

Frame 3:
Even more content...
```

## Frame Fields

Each frame contains the following editable fields:

- Frame Number
- Frame Tone (Dropdown: Informative, Cinematic, Emotional, Playful, Serious)
- Content — Dialogues / Narration (Auto-filled from document)
- Frame Type (Dropdown: Live Footage, Animation, Live Footage + Animation)
- Voice Over Required? (Toggle)
- Editing Required? (Toggle)
- Facilitator Costume / Props
- Scene Description
- Camera / Cinematographer Notes
- Editing Notes
- Suggestions for Frame Improvement

## Deployment to Render

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Configure settings**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Deploy**

For the frontend, you can:
- Host it separately on Render as a static site
- Or serve it from FastAPI by adding static file serving

## Usage

1. **Upload Document**: Click "Choose File" and select your DOCX or PDF file
2. **Review Frames**: The system will automatically extract all frames
3. **Edit Details**: Modify any fields as needed
4. **Save Changes**: Click "Save Changes" to persist your edits
5. **Export PDF**: Click "Export PDF" to download a formatted document

## Notes

- No AI is used - purely regex-based parsing
- Frames are stored in `backend/frames.json`
- For production, consider using a proper database
- CORS is enabled for development (configure appropriately for production)

## License

MIT License - feel free to use and modify as needed.


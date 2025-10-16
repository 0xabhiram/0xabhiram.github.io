// Client-side Frame Extractor for GitHub Pages
let currentFrames = [];

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileName = document.getElementById('fileName');
const uploadStatus = document.getElementById('uploadStatus');
const framesSection = document.getElementById('framesSection');
const framesContainer = document.getElementById('framesContainer');
const saveBtn = document.getElementById('saveBtn');
const exportBtn = document.getElementById('exportBtn');

// Event Listeners
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
saveBtn.addEventListener('click', saveFrames);
exportBtn.addEventListener('click', exportPDF);

// Handle file upload (client-side)
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    fileName.textContent = `Selected: ${file.name}`;
    
    try {
        showStatus('Processing file...', 'info');
        
        let content = '';
        
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            content = await readTextFile(file);
        } else if (file.name.endsWith('.docx')) {
            showStatus('DOCX files require server processing. Please use a text file or the full version.', 'error');
            return;
        } else {
            showStatus('Unsupported file type. Please use .txt files.', 'error');
            return;
        }
        
        // Parse frames
        const frames = parseFrames(content);
        
        if (frames.length === 0) {
            showStatus('No frames found. Make sure your file has "Frame X:" format.', 'error');
            return;
        }
        
        showStatus(`✅ Success! Extracted ${frames.length} frames`, 'success');
        currentFrames = frames;
        displayFrames(frames);
        
    } catch (error) {
        showStatus(`❌ Error: ${error.message}`, 'error');
    }
}

// Read text file
function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

// Parse frames from text
function parseFrames(text) {
    const frames = [];
    const pattern = /Frame\s+(\d+)\s*:([\s\S]*?)(?=Frame\s+\d+\s*:|$)/gi;
    
    let match;
    while ((match = pattern.exec(text)) !== null) {
        const frameNumber = match[1].trim();
        const content = match[2].trim();
        
        if (content) {
            frames.push({
                frame_number: frameNumber,
                frame_tone: "Informative",
                content: content,
                frame_type: "Live Footage",
                voice_over_required: false,
                editing_required: false,
                facilitator_costume_props: "",
                scene_description: "",
                camera_notes: "",
                editing_notes: "",
                suggestions: ""
            });
        }
    }
    
    return frames;
}

// Display frames in UI
function displayFrames(frames) {
    framesSection.style.display = 'block';
    framesContainer.innerHTML = '';

    frames.forEach((frame, index) => {
        const frameCard = createFrameCard(frame, index);
        framesContainer.appendChild(frameCard);
    });
}

// Create frame card HTML
function createFrameCard(frame, index) {
    const card = document.createElement('div');
    card.className = 'frame-card';
    card.innerHTML = `
        <div class="frame-header">
            <h3>Frame ${frame.frame_number}</h3>
            <button class="btn-collapse" onclick="toggleFrame(${index})">▼</button>
        </div>
        <div class="frame-body" id="frame-${index}">
            <div class="form-group">
                <label>Frame Number</label>
                <input type="text" class="form-input" data-index="${index}" data-field="frame_number" value="${frame.frame_number}">
            </div>

            <div class="form-group">
                <label>Frame Tone</label>
                <select class="form-input" data-index="${index}" data-field="frame_tone">
                    <option value="Informative" ${frame.frame_tone === 'Informative' ? 'selected' : ''}>Informative</option>
                    <option value="Cinematic" ${frame.frame_tone === 'Cinematic' ? 'selected' : ''}>Cinematic</option>
                    <option value="Emotional" ${frame.frame_tone === 'Emotional' ? 'selected' : ''}>Emotional</option>
                    <option value="Playful" ${frame.frame_tone === 'Playful' ? 'selected' : ''}>Playful</option>
                    <option value="Serious" ${frame.frame_tone === 'Serious' ? 'selected' : ''}>Serious</option>
                </select>
            </div>

            <div class="form-group">
                <label>Content — Dialogues / Narration</label>
                <textarea class="form-textarea" data-index="${index}" data-field="content" rows="6">${frame.content}</textarea>
            </div>

            <div class="form-group">
                <label>Frame Type</label>
                <select class="form-input" data-index="${index}" data-field="frame_type">
                    <option value="Live Footage" ${frame.frame_type === 'Live Footage' ? 'selected' : ''}>Live Footage</option>
                    <option value="Animation" ${frame.frame_type === 'Animation' ? 'selected' : ''}>Animation</option>
                    <option value="Live Footage + Animation" ${frame.frame_type === 'Live Footage + Animation' ? 'selected' : ''}>Live Footage + Animation</option>
                </select>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="toggle-label">
                        <input type="checkbox" class="form-toggle" data-index="${index}" data-field="voice_over_required" ${frame.voice_over_required ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        <span>Voice Over Required?</span>
                    </label>
                </div>

                <div class="form-group">
                    <label class="toggle-label">
                        <input type="checkbox" class="form-toggle" data-index="${index}" data-field="editing_required" ${frame.editing_required ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        <span>Editing Required?</span>
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label>Facilitator Costume / Props</label>
                <input type="text" class="form-input" data-index="${index}" data-field="facilitator_costume_props" value="${frame.facilitator_costume_props}">
            </div>

            <div class="form-group">
                <label>Scene Description</label>
                <textarea class="form-textarea" data-index="${index}" data-field="scene_description" rows="4">${frame.scene_description}</textarea>
            </div>

            <div class="form-group">
                <label>Camera / Cinematographer Notes</label>
                <textarea class="form-textarea" data-index="${index}" data-field="camera_notes" rows="4">${frame.camera_notes}</textarea>
            </div>

            <div class="form-group">
                <label>Editing Notes</label>
                <textarea class="form-textarea" data-index="${index}" data-field="editing_notes" rows="4">${frame.editing_notes}</textarea>
            </div>

            <div class="form-group">
                <label>Suggestions for Frame Improvement</label>
                <textarea class="form-textarea" data-index="${index}" data-field="suggestions" rows="4">${frame.suggestions}</textarea>
            </div>
        </div>
    `;

    return card;
}

// Toggle frame collapse
function toggleFrame(index) {
    const frameBody = document.getElementById(`frame-${index}`);
    frameBody.classList.toggle('collapsed');
}

// Save frames (local storage)
function saveFrames() {
    // Collect data from all form fields
    const updatedFrames = currentFrames.map((frame, index) => {
        const updatedFrame = { ...frame };
        
        // Get all inputs for this frame
        const inputs = document.querySelectorAll(`[data-index="${index}"]`);
        
        inputs.forEach(input => {
            const field = input.dataset.field;
            if (input.type === 'checkbox') {
                updatedFrame[field] = input.checked;
            } else {
                updatedFrame[field] = input.value;
            }
        });
        
        return updatedFrame;
    });

    try {
        // Save to localStorage
        localStorage.setItem('frameExtractorFrames', JSON.stringify(updatedFrames));
        showStatus('✅ Changes saved to local storage!', 'success');
        currentFrames = updatedFrames;
    } catch (error) {
        showStatus(`❌ Error saving: ${error.message}`, 'error');
    }
}

// Export PDF using jsPDF
function exportPDF() {
    try {
        showStatus('Generating PDF...', 'info');
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set up document
        doc.setFontSize(16);
        doc.text('Frame Details Document', 20, 20);
        
        let yPosition = 40;
        const pageHeight = doc.internal.pageSize.height;
        
        currentFrames.forEach((frame, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 50) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Frame title
            doc.setFontSize(14);
            doc.text(`Frame ${frame.frame_number}`, 20, yPosition);
            yPosition += 10;
            
            // Frame details
            doc.setFontSize(10);
            const details = [
                `Frame Number: ${frame.frame_number}`,
                `Frame Tone: ${frame.frame_tone}`,
                `Content: ${frame.content.substring(0, 100)}${frame.content.length > 100 ? '...' : ''}`,
                `Frame Type: ${frame.frame_type}`,
                `Voice Over Required: ${frame.voice_over_required ? 'Yes' : 'No'}`,
                `Editing Required: ${frame.editing_required ? 'Yes' : 'No'}`,
                `Facilitator Costume/Props: ${frame.facilitator_costume_props}`,
                `Scene Description: ${frame.scene_description}`,
                `Camera Notes: ${frame.camera_notes}`,
                `Editing Notes: ${frame.editing_notes}`,
                `Suggestions: ${frame.suggestions}`
            ];
            
            details.forEach(detail => {
                if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(detail, 20, yPosition);
                yPosition += 5;
            });
            
            yPosition += 10; // Space between frames
        });
        
        // Save the PDF
        doc.save('frames_export.pdf');
        showStatus('✅ PDF exported successfully!', 'success');
        
    } catch (error) {
        showStatus(`❌ Error: ${error.message}`, 'error');
    }
}

// Show status message
function showStatus(message, type) {
    uploadStatus.textContent = message;
    uploadStatus.className = `status-message status-${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            uploadStatus.textContent = '';
            uploadStatus.className = 'status-message';
        }, 3000);
    }
}

// Load saved frames on page load
window.addEventListener('load', () => {
    const savedFrames = localStorage.getItem('frameExtractorFrames');
    if (savedFrames) {
        try {
            currentFrames = JSON.parse(savedFrames);
            displayFrames(currentFrames);
        } catch (error) {
            console.log('Could not load saved frames');
        }
    }
});

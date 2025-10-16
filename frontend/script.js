// API Configuration - auto-detect based on current host
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8000' 
    : `${window.location.protocol}//${window.location.hostname}:8000`;

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

// Load frames on page load
window.addEventListener('load', loadFrames);

// Handle file upload
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    fileName.textContent = `Selected: ${file.name}`;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
        showStatus('Uploading and processing...', 'info');
        
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showStatus(`✅ Success! Extracted ${data.frames_count} frames`, 'success');
            currentFrames = data.frames;
            displayFrames(data.frames);
        } else {
            showStatus(`❌ Error: ${data.detail}`, 'error');
        }
    } catch (error) {
        showStatus(`❌ Error: ${error.message}`, 'error');
    }
}

// Load existing frames
async function loadFrames() {
    try {
        const response = await fetch(`${API_URL}/frames`);
        const data = await response.json();
        
        if (data.frames && data.frames.length > 0) {
            currentFrames = data.frames;
            displayFrames(data.frames);
        }
    } catch (error) {
        console.log('No existing frames found');
    }
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

// Save frames
async function saveFrames() {
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
        showStatus('Saving...', 'info');
        
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFrames)
        });

        const data = await response.json();

        if (response.ok) {
            showStatus('✅ Changes saved successfully!', 'success');
            currentFrames = updatedFrames;
        } else {
            showStatus(`❌ Error: ${data.detail}`, 'error');
        }
    } catch (error) {
        showStatus(`❌ Error: ${error.message}`, 'error');
    }
}

// Export PDF
async function exportPDF() {
    try {
        showStatus('Generating PDF...', 'info');
        
        const response = await fetch(`${API_URL}/export`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'frames_export.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showStatus('✅ PDF exported successfully!', 'success');
        } else {
            const data = await response.json();
            showStatus(`❌ Error: ${data.detail}`, 'error');
        }
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


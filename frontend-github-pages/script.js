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
const clearBtn = document.getElementById('clearBtn');

// New elements for tabs and text input
const tabBtns = document.querySelectorAll('.tab-btn');
const textInput = document.getElementById('textInput');
const analyzeTextBtn = document.getElementById('analyzeTextBtn');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const clearTextBtn = document.getElementById('clearTextBtn');

// Event Listeners
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
saveBtn.addEventListener('click', saveFrames);
exportBtn.addEventListener('click', exportPDF);
clearBtn.addEventListener('click', clearAllData);

// Tab functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Text input functionality
analyzeTextBtn.addEventListener('click', handleTextAnalysis);
loadSampleBtn.addEventListener('click', loadSampleContent);
clearTextBtn.addEventListener('click', clearTextContent);

// Tab switching function
function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Handle text analysis
function handleTextAnalysis() {
    const text = textInput.value.trim();
    
    if (!text) {
        showStatus('Please enter some text to analyze.', 'error');
        return;
    }
    
    try {
        showStatus('Analyzing text...', 'info');
        
        // Parse frames
        const frames = parseFrames(text);
        
        if (frames.length === 0) {
            showStatus(`No frames found. Supported formats:\n• Frame 1: content\n• Frame 1 [timestamp] content\n• Frame 1\ncontent\n• Frame 1 - content`, 'error');
            return;
        }
        
        showStatus(`✅ Success! Extracted ${frames.length} frames from text`, 'success');
        currentFrames = frames;
        displayFrames(frames);
        
    } catch (error) {
        showStatus(`❌ Error analyzing text: ${error.message}`, 'error');
    }
}

// Load sample content
function loadSampleContent() {
    const sampleContent = `Frame 1 [0:00–0:07 | Quick montage: glowing text, AI images forming, camera zooms through scenes]

🎙 Voice-Over (mysterious, confident):

"What if one sentence could turn into a world?
What if you could write a film… instead of shooting it?"

Frame 2 [0:08–0:15 | Visual: AI tools transforming text → visuals → motion]

🎙 Voice-Over:

"In this module, you'll discover how words become images, motion, and sound — the full power to build your own short film using AI."

Frame 3 [0:16–0:25 | Flashback visuals: previous module moments]

🎙 Voice-Over:

"Last time, you learned how AI can help you think and study smarter. Now, you'll use it to create — to imagine, design, and bring ideas alive."

Frame 4 [0:26–0:37 | Visual: vibrant AI art forming in seconds]

🎙 Voice-Over:

"First — Image Mastery. You'll learn how to describe light, mood, and detail so clearly that AI paints your vision perfectly."

Frame 5 [0:38–0:47 | Visual: smooth video transitions, camera moves, AI-generated scenes]

🎙 Voice-Over:

"Next — Video Mastery. Where those still images begin to move, flow, and tell stories that feel cinematic."`;
    
    textInput.value = sampleContent;
    showStatus('Sample content loaded! Click "Analyze Text" to extract frames.', 'info');
}

// Clear text content
function clearTextContent() {
    textInput.value = '';
    showStatus('Text cleared.', 'info');
}

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
            // Check if Mammoth library is available
            if (typeof mammoth === 'undefined') {
                showStatus('DOCX processing library loading... Please wait and try again.', 'error');
                return;
            }
            showStatus('Processing DOCX file...', 'info');
            content = await readDocxFile(file);
        } else {
            showStatus('Unsupported file type. Please use .txt or .docx files.', 'error');
            return;
        }
        
        // Parse frames
        const frames = parseFrames(content);
        
        if (frames.length === 0) {
            showStatus(`No frames found. Supported formats:\n• Frame 1: content\n• Frame 1 [timestamp] content\n• Frame 1\ncontent\n• Frame 1 - content`, 'error');
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

// Read DOCX file using Mammoth library
function readDocxFile(file) {
    return new Promise((resolve, reject) => {
        if (typeof mammoth === 'undefined') {
            reject(new Error('DOCX processing library not loaded. Please refresh the page.'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            mammoth.extractRawText({arrayBuffer: arrayBuffer})
                .then(function(result) {
                    resolve(result.value);
                })
                .catch(function(error) {
                    reject(new Error('Failed to process DOCX file: ' + error.message));
                });
        };
        reader.onerror = (e) => reject(new Error('Failed to read DOCX file'));
        reader.readAsArrayBuffer(file);
    });
}

// Parse frames from text - supports multiple formats
function parseFrames(text) {
    const frames = [];
    
    // Try different frame patterns
    const patterns = [
        // Pattern 1: "Frame 1:" format
        /Frame\s+(\d+)\s*:([\s\S]*?)(?=Frame\s+\d+\s*:|$)/gi,
        // Pattern 2: "Frame 1 [timestamp] format
        /Frame\s+(\d+)\s*\[([^\]]*)\]\s*([\s\S]*?)(?=Frame\s+\d+\s*\[|Frame\s+\d+\s*:|$)/gi,
        // Pattern 3: "Frame 1" followed by newline
        /Frame\s+(\d+)\s*\n([\s\S]*?)(?=Frame\s+\d+\s*|$)/gi,
        // Pattern 4: "Frame 1 -" format
        /Frame\s+(\d+)\s*-\s*([\s\S]*?)(?=Frame\s+\d+\s*-|$)/gi
    ];
    
    console.log('Trying to parse frames from text:', text.substring(0, 200) + '...');
    
    for (const pattern of patterns) {
        let match;
        pattern.lastIndex = 0; // Reset regex state
        
        while ((match = pattern.exec(text)) !== null) {
            const frameNumber = match[1].trim();
            let content = '';
            
            if (match.length === 3) {
                // Pattern 1, 3, 4: content is in match[2]
                content = match[2].trim();
            } else if (match.length === 4) {
                // Pattern 2: timestamp in match[2], content in match[3]
                const timestamp = match[2].trim();
                content = match[3].trim();
                
                // Include timestamp in content if present
                if (timestamp) {
                    content = `[${timestamp}] ${content}`;
                }
            }
            
            if (content) {
                // Check if this frame number already exists
                const existingFrame = frames.find(f => f.frame_number === frameNumber);
                if (!existingFrame) {
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
        }
        
        // If we found frames with this pattern, stop trying other patterns
        if (frames.length > 0) {
            console.log(`Found ${frames.length} frames using pattern ${patterns.indexOf(pattern) + 1}`);
            break;
        }
    }
    
    // Sort frames by frame number
    frames.sort((a, b) => parseInt(a.frame_number) - parseInt(b.frame_number));
    
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

// Create frame card HTML with table format
function createFrameCard(frame, index) {
    const card = document.createElement('div');
    card.className = 'frame-card';
    card.innerHTML = `
        <div class="frame-header">Frame ${frame.frame_number}</div>
        <table class="frame-table">
            <tr>
                <th>Field</th>
                <th>Value</th>
            </tr>
            <tr>
                <td><strong>Frame Number</strong></td>
                <td><input type="text" class="form-input" data-index="${index}" data-field="frame_number" value="${frame.frame_number}"></td>
            </tr>
            <tr>
                <td><strong>Frame Tone</strong></td>
                <td>
                    <select class="form-select" data-index="${index}" data-field="frame_tone">
                        <option value="Informative" ${frame.frame_tone === 'Informative' ? 'selected' : ''}>Informative</option>
                        <option value="Cinematic" ${frame.frame_tone === 'Cinematic' ? 'selected' : ''}>Cinematic</option>
                        <option value="Emotional" ${frame.frame_tone === 'Emotional' ? 'selected' : ''}>Emotional</option>
                        <option value="Playful" ${frame.frame_tone === 'Playful' ? 'selected' : ''}>Playful</option>
                        <option value="Serious" ${frame.frame_tone === 'Serious' ? 'selected' : ''}>Serious</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td><strong>Content — Dialogues / Narration</strong></td>
                <td><textarea class="form-textarea" data-index="${index}" data-field="content" rows="4">${frame.content}</textarea></td>
            </tr>
            <tr>
                <td><strong>Frame Type</strong></td>
                <td>
                    <select class="form-select" data-index="${index}" data-field="frame_type">
                        <option value="Live Footage" ${frame.frame_type === 'Live Footage' ? 'selected' : ''}>Live Footage</option>
                        <option value="Animation" ${frame.frame_type === 'Animation' ? 'selected' : ''}>Animation</option>
                        <option value="Live Footage + Animation" ${frame.frame_type === 'Live Footage + Animation' ? 'selected' : ''}>Live Footage + Animation</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td><strong>Voice Over Required?</strong></td>
                <td>
                    <label class="toggle-label">
                        <input type="checkbox" class="form-toggle" data-index="${index}" data-field="voice_over_required" ${frame.voice_over_required ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">${frame.voice_over_required ? 'Yes' : 'No'}</span>
                    </label>
                </td>
            </tr>
            <tr>
                <td><strong>Editing Required?</strong></td>
                <td>
                    <label class="toggle-label">
                        <input type="checkbox" class="form-toggle" data-index="${index}" data-field="editing_required" ${frame.editing_required ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">${frame.editing_required ? 'Yes' : 'No'}</span>
                    </label>
                </td>
            </tr>
            <tr>
                <td><strong>Facilitator Costume / Props</strong></td>
                <td><input type="text" class="form-input" data-index="${index}" data-field="facilitator_costume_props" value="${frame.facilitator_costume_props}"></td>
            </tr>
            <tr>
                <td><strong>Scene Description</strong></td>
                <td><textarea class="form-textarea" data-index="${index}" data-field="scene_description" rows="3">${frame.scene_description}</textarea></td>
            </tr>
            <tr>
                <td><strong>Camera / Cinematographer Notes</strong></td>
                <td><textarea class="form-textarea" data-index="${index}" data-field="camera_notes" rows="3">${frame.camera_notes}</textarea></td>
            </tr>
            <tr>
                <td><strong>Editing Notes</strong></td>
                <td><textarea class="form-textarea" data-index="${index}" data-field="editing_notes" rows="3">${frame.editing_notes}</textarea></td>
            </tr>
            <tr>
                <td><strong>Suggestions for Frame Improvement</strong></td>
                <td><textarea class="form-textarea" data-index="${index}" data-field="suggestions" rows="3">${frame.suggestions}</textarea></td>
            </tr>
        </table>
    `;

    return card;
}

// Update toggle labels when toggles change
function updateToggleLabel(checkbox) {
    const label = checkbox.parentNode.querySelector('.toggle-label');
    if (label) {
        label.textContent = checkbox.checked ? 'Yes' : 'No';
    }
}

// Add event listeners for toggles
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('form-toggle')) {
        updateToggleLabel(e.target);
    }
});

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

// Clear all data function
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        clearOldData();
        showStatus('✅ All data cleared successfully!', 'success');
    }
}

// Show full version deployment information
function showFullVersionInfo() {
    const info = `🚀 DEPLOY FULL VERSION FOR COMPLETE FUNCTIONALITY

To get full DOCX and PDF support:

1. NETLIFY (Recommended - Free):
   • Go to netlify.com
   • Connect GitHub repo: https://github.com/0xabhiram/Arjun-Shetty
   • Auto-deploy with full backend support

2. RENDER (Free Tier):
   • Go to render.com
   • Connect GitHub repo
   • Deploy as Web Service

Features in Full Version:
✅ Complete DOCX/PDF processing
✅ Server-side frame extraction
✅ Advanced PDF export
✅ Data persistence
✅ No file size limits

Current GitHub Pages Version:
⚠️ Client-side only
⚠️ Basic DOCX text extraction
⚠️ Limited file processing`;
    
    alert(info);
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

// Clear old data and load saved frames on page load
window.addEventListener('load', () => {
    // Debug: Check if we're running the latest version
    console.log('Frame Extractor v2.6 loaded - COMPLETE mobile text corruption fix');
    console.log('Mammoth library available:', typeof mammoth !== 'undefined');
    
    // Clear any old/stale data first
    clearOldData();
    
    const savedFrames = localStorage.getItem('frameExtractorFrames');
    if (savedFrames) {
        try {
            currentFrames = JSON.parse(savedFrames);
            // Only display if frames are recent (within 24 hours)
            if (isRecentData(savedFrames)) {
                displayFrames(currentFrames);
            } else {
                clearOldData();
                showStatus('Old data cleared. Please upload a new document.', 'info');
            }
        } catch (error) {
            console.log('Could not load saved frames');
            clearOldData();
        }
    }
});

// Clear old data from localStorage
function clearOldData() {
    localStorage.removeItem('frameExtractorFrames');
    localStorage.removeItem('frameExtractorTimestamp');
    currentFrames = [];
    framesSection.style.display = 'none';
    framesContainer.innerHTML = '';
    fileName.textContent = '';
}

// Check if data is recent (within 24 hours)
function isRecentData(data) {
    const timestamp = localStorage.getItem('frameExtractorTimestamp');
    if (!timestamp) return false;
    
    const now = Date.now();
    const dataTime = parseInt(timestamp);
    const hoursDiff = (now - dataTime) / (1000 * 60 * 60);
    
    return hoursDiff < 24; // Keep data for 24 hours
}

// Add timestamp when saving data
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
        // Save to localStorage with timestamp
        localStorage.setItem('frameExtractorFrames', JSON.stringify(updatedFrames));
        localStorage.setItem('frameExtractorTimestamp', Date.now().toString());
        showStatus('✅ Changes saved to local storage!', 'success');
        currentFrames = updatedFrames;
    } catch (error) {
        showStatus(`❌ Error saving: ${error.message}`, 'error');
    }
}

// Clear all data function
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        clearOldData();
        showStatus('✅ All data cleared successfully!', 'success');
    }
}

// Show full version deployment information
function showFullVersionInfo() {
    const info = `🚀 DEPLOY FULL VERSION FOR COMPLETE FUNCTIONALITY

To get full DOCX and PDF support:

1. NETLIFY (Recommended - Free):
   • Go to netlify.com
   • Connect GitHub repo: https://github.com/0xabhiram/Arjun-Shetty
   • Auto-deploy with full backend support

2. RENDER (Free Tier):
   • Go to render.com
   • Connect GitHub repo
   • Deploy as Web Service

Features in Full Version:
✅ Complete DOCX/PDF processing
✅ Server-side frame extraction
✅ Advanced PDF export
✅ Data persistence
✅ No file size limits

Current GitHub Pages Version:
⚠️ Client-side only
⚠️ Basic DOCX text extraction
⚠️ Limited file processing`;
    
    alert(info);
}

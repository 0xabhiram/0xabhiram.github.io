// Enhanced PDF export functionality
// Creates a formatted HTML document and opens print dialog

export const exportToPDF = (frames) => {
  // Create a comprehensive HTML representation
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AI Video Course Storyboard - Export</title>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 30px 40px;
          color: #1e293b;
          background: white;
          line-height: 1.6;
        }
        
        .header { 
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 4px solid #2563eb;
        }
        
        .header h1 {
          font-size: 28px;
          color: #1e40af;
          margin-bottom: 10px;
        }
        
        .header .meta {
          color: #64748b;
          font-size: 14px;
        }
        
        .frame { 
          page-break-inside: avoid;
          margin-bottom: 35px;
          border: 2px solid #e2e8f0;
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .frame-header { 
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .frame-header h2 {
          font-size: 20px;
          font-weight: 600;
        }
        
        .frame-body {
          padding: 20px;
        }
        
        .badges { 
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }
        
        .badge { 
          background: #dbeafe;
          color: #1e40af;
          padding: 5px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .badge.pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .section { 
          margin-bottom: 18px;
        }
        
        .section-label { 
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .section-value { 
          color: #1e293b;
          font-size: 14px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 4px;
          border-left: 3px solid #2563eb;
        }
        
        .section-value.empty {
          color: #94a3b8;
          font-style: italic;
          border-left-color: #cbd5e1;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .frame { 
            page-break-inside: avoid;
            margin-bottom: 30px;
          }
          
          .header {
            margin-bottom: 30px;
          }
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          color: #64748b;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎬 AI Video Course Storyboard</h1>
        <div class="meta">
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Frames:</strong> ${frames.length}</p>
        </div>
      </div>
  `;

  frames.forEach((frame) => {
    const hasDetails = frame.sceneDescription || frame.cameraNote || frame.editingNote || frame.facilitatorCostume;
    
    htmlContent += `
      <div class="frame">
        <div class="frame-header">
          <h2>Frame ${frame.frameNumber}</h2>
        </div>
        
        <div class="frame-body">
          <div class="badges">
            <span class="badge">Tone: ${frame.frameTone}</span>
            <span class="badge">Type: ${frame.frameType}</span>
            <span class="badge">Voice Over: ${frame.voiceOverRequired ? 'Yes' : 'No'}</span>
            <span class="badge">Editing: ${frame.editingRequired ? 'Yes' : 'No'}</span>
            ${!hasDetails ? '<span class="badge pending">Details Pending</span>' : ''}
          </div>
          
          <div class="section">
            <div class="section-label">📝 Content — Dialogues / Narration</div>
            <div class="section-value">${frame.content || '<em>No content specified</em>'}</div>
          </div>
          
          <div class="grid">
            <div class="section">
              <div class="section-label">👔 Facilitator Costume / Props</div>
              <div class="section-value ${!frame.facilitatorCostume ? 'empty' : ''}">${frame.facilitatorCostume || 'Not specified'}</div>
            </div>
            
            <div class="section">
              <div class="section-label">🎬 Frame Type</div>
              <div class="section-value">${frame.frameType}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-label">🎭 Scene Description</div>
            <div class="section-value ${!frame.sceneDescription ? 'empty' : ''}">${frame.sceneDescription || 'Not specified'}</div>
          </div>
          
          <div class="section">
            <div class="section-label">📹 Camera / Cinematographer Notes</div>
            <div class="section-value ${!frame.cameraNote ? 'empty' : ''}">${frame.cameraNote || 'Not specified'}</div>
          </div>
          
          <div class="section">
            <div class="section-label">✂️ Editing Notes</div>
            <div class="section-value ${!frame.editingNote ? 'empty' : ''}">${frame.editingNote || 'Not specified'}</div>
          </div>
          
          <div class="section">
            <div class="section-label">💡 Suggestions for Frame Improvement</div>
            <div class="section-value ${!frame.suggestions ? 'empty' : ''}">${frame.suggestions || 'No suggestions'}</div>
          </div>
        </div>
      </div>
    `;
  });

  htmlContent += `
      <div class="footer">
        <p>AI Video Course Storyboard Export | Generated from Storyboard Management System</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob and download as HTML (can be saved as PDF from browser)
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Download the HTML file
  const a = document.createElement('a');
  a.href = url;
  a.download = `storyboard-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Also open in new window for immediate printing
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
// Parse script text and extract frames
export const parseScript = (scriptText) => {
  const frames = [];
  
  // Try multiple patterns for frame detection
  // Pattern 1: "Frame 1:", "Frame 2:", etc. (case insensitive)
  let framePattern = /Frame\s+(\d+)\s*:([^]*?)(?=Frame\s+\d+\s*:|$)/gi;
  let matches = [...scriptText.matchAll(framePattern)];
  
  // Pattern 2: "Frame 1 -", "Frame 2 -", etc.
  if (matches.length === 0) {
    framePattern = /Frame\s+(\d+)\s*-([^]*?)(?=Frame\s+\d+\s*-|$)/gi;
    matches = [...scriptText.matchAll(framePattern)];
  }
  
  // Pattern 3: Just numbers "1.", "2.", etc.
  if (matches.length === 0) {
    framePattern = /^(\d+)\.\s*([^]*?)(?=^\d+\.|$)/gim;
    matches = [...scriptText.matchAll(framePattern)];
  }
  
  // Pattern 4: "[Frame 1]", "[Frame 2]", etc.
  if (matches.length === 0) {
    framePattern = /\[Frame\s+(\d+)\]([^]*?)(?=\[Frame\s+\d+\]|$)/gi;
    matches = [...scriptText.matchAll(framePattern)];
  }
  
  matches.forEach(match => {
    const frameNumber = match[1];
    const content = match[2].trim();
    
    if (content) {
      frames.push({
        id: `parsed-${Date.now()}-${frameNumber}-${Math.random().toString(36).substr(2, 9)}`,
        frameNumber: frameNumber,
        frameTone: 'Informative',
        content: content,
        frameType: 'Live Footage',
        voiceOverRequired: false,
        editingRequired: false,
        facilitatorCostume: '',
        sceneDescription: '',
        cameraNote: '',
        editingNote: '',
        suggestions: ''
      });
    }
  });
  
  return frames;
};
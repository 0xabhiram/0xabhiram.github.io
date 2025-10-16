import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { frameToneOptions, frameTypeOptions } from '../mockData';

const FrameEditor = ({ frame, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    frameNumber: '',
    frameTone: 'Informative',
    content: '',
    frameType: 'Live Footage',
    voiceOverRequired: false,
    editingRequired: false,
    facilitatorCostume: '',
    sceneDescription: '',
    cameraNote: '',
    editingNote: '',
    suggestions: ''
  });

  useEffect(() => {
    if (frame) {
      setFormData(frame);
    }
  }, [frame]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Frame Number and Tone */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frameNumber" className="text-slate-700">Frame Number</Label>
          <Input
            id="frameNumber"
            value={formData.frameNumber}
            onChange={(e) => handleChange('frameNumber', e.target.value)}
            placeholder="e.g., 1"
            required
            className="border-slate-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frameTone" className="text-slate-700">Frame Tone</Label>
          <Select value={formData.frameTone} onValueChange={(value) => handleChange('frameTone', value)}>
            <SelectTrigger className="border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frameToneOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content - Dialogues / Narration */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-slate-700">Content — Dialogues / Narration</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Write all on-screen or voice dialogues here..."
          className="min-h-[120px] border-slate-300"
          required
        />
      </div>

      {/* Frame Type */}
      <div className="space-y-2">
        <Label htmlFor="frameType" className="text-slate-700">Frame Type</Label>
        <Select value={formData.frameType} onValueChange={(value) => handleChange('frameType', value)}>
          <SelectTrigger className="border-slate-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {frameTypeOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Voice Over and Editing Required */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-700">Voice Over Required?</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={formData.voiceOverRequired ? "default" : "outline"}
              onClick={() => handleChange('voiceOverRequired', true)}
              className={formData.voiceOverRequired ? "bg-blue-600 hover:bg-blue-700" : "border-slate-300"}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!formData.voiceOverRequired ? "default" : "outline"}
              onClick={() => handleChange('voiceOverRequired', false)}
              className={!formData.voiceOverRequired ? "bg-blue-600 hover:bg-blue-700" : "border-slate-300"}
            >
              No
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700">Editing Required?</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={formData.editingRequired ? "default" : "outline"}
              onClick={() => handleChange('editingRequired', true)}
              className={formData.editingRequired ? "bg-blue-600 hover:bg-blue-700" : "border-slate-300"}
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!formData.editingRequired ? "default" : "outline"}
              onClick={() => handleChange('editingRequired', false)}
              className={!formData.editingRequired ? "bg-blue-600 hover:bg-blue-700" : "border-slate-300"}
            >
              No
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Technical Sections */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="facilitatorCostume" className="text-slate-700">Facilitator Costume / Props</Label>
          <Input
            id="facilitatorCostume"
            value={formData.facilitatorCostume}
            onChange={(e) => handleChange('facilitatorCostume', e.target.value)}
            placeholder="e.g., Professional blazer, white shirt"
            className="border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sceneDescription" className="text-slate-700">Scene Description</Label>
          <Textarea
            id="sceneDescription"
            value={formData.sceneDescription}
            onChange={(e) => handleChange('sceneDescription', e.target.value)}
            placeholder="Describe the scene setup, location, lighting..."
            className="min-h-[80px] border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cameraNote" className="text-slate-700">Camera / Cinematographer Notes</Label>
          <Textarea
            id="cameraNote"
            value={formData.cameraNote}
            onChange={(e) => handleChange('cameraNote', e.target.value)}
            placeholder="e.g., Medium shot, 50mm lens, f/2.8"
            className="min-h-[80px] border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="editingNote" className="text-slate-700">Editing Notes</Label>
          <Textarea
            id="editingNote"
            value={formData.editingNote}
            onChange={(e) => handleChange('editingNote', e.target.value)}
            placeholder="Special effects, transitions, overlays..."
            className="min-h-[80px] border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="suggestions" className="text-slate-700">Suggestions for Frame Improvement</Label>
          <Textarea
            id="suggestions"
            value={formData.suggestions}
            onChange={(e) => handleChange('suggestions', e.target.value)}
            placeholder="Add creative or technical feedback here..."
            className="min-h-[80px] border-slate-300"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel} className="border-slate-300">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 transition-colors">
          Save Frame
        </Button>
      </div>
    </form>
  );
};

export default FrameEditor;
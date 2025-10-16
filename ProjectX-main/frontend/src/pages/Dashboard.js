import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Film, LogOut, Plus, FileText, Upload, Download } from 'lucide-react';
import { mockFrames } from '../mockData';
import FrameEditor from '../components/FrameEditor';
import FrameCard from '../components/FrameCard';
import { parseScript } from '../utils/scriptParser';
import { exportToPDF } from '../utils/pdfExporter';
import { toast } from '../hooks/use-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);
  const [scriptText, setScriptText] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Load mock frames from localStorage or use default
    const savedFrames = localStorage.getItem('storyboardFrames');
    if (savedFrames) {
      setFrames(JSON.parse(savedFrames));
    } else {
      setFrames(mockFrames);
      localStorage.setItem('storyboardFrames', JSON.stringify(mockFrames));
    }
  }, []);

  const saveFramesToStorage = (updatedFrames) => {
    setFrames(updatedFrames);
    localStorage.setItem('storyboardFrames', JSON.stringify(updatedFrames));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddFrame = () => {
    setSelectedFrame(null);
    setIsEditorOpen(true);
  };

  const handleEditFrame = (frame) => {
    setSelectedFrame(frame);
    setIsEditorOpen(true);
  };

  const handleDeleteFrame = (frameId) => {
    const updatedFrames = frames.filter(f => f.id !== frameId);
    saveFramesToStorage(updatedFrames);
    toast({
      title: "Frame deleted",
      description: "Frame has been removed from storyboard."
    });
  };

  const handleSaveFrame = (frameData) => {
    if (selectedFrame) {
      // Update existing frame
      const updatedFrames = frames.map(f => 
        f.id === selectedFrame.id ? { ...frameData, id: selectedFrame.id } : f
      );
      saveFramesToStorage(updatedFrames);
      toast({
        title: "Frame updated",
        description: "Your changes have been saved."
      });
    } else {
      // Add new frame
      const newFrame = { ...frameData, id: Date.now().toString() };
      saveFramesToStorage([...frames, newFrame]);
      toast({
        title: "Frame added",
        description: "New frame has been added to storyboard."
      });
    }
    setIsEditorOpen(false);
  };

  const handleParseScript = () => {
    if (!scriptText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a script to parse.",
        variant: "destructive"
      });
      return;
    }

    const parsedFrames = parseScript(scriptText);
    if (parsedFrames.length === 0) {
      toast({
        title: "No frames detected",
        description: "Could not find frame numbers in the script. Use format 'Frame 1:', 'Frame 2:', etc.",
        variant: "destructive"
      });
      return;
    }

    // Replace all frames with newly parsed ones
    saveFramesToStorage(parsedFrames);
    setScriptText('');
    setIsScriptDialogOpen(false);
    toast({
      title: "Script imported successfully",
      description: `${parsedFrames.length} frames created. Click on any frame to add details.`
    });
  };

  const handleExportPDF = () => {
    exportToPDF(frames);
    toast({
      title: "PDF Export",
      description: "Storyboard exported successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Film className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">AI Video Storyboard</h1>
                <p className="text-sm text-slate-500">Welcome, {user?.username}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-slate-300">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-8">
          {frames.length === 0 ? (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Get Started</h3>
              <p className="text-blue-700 mb-4">Paste your entire script with frame numbers to automatically create all frames at once.</p>
              <Dialog open={isScriptDialogOpen} onOpenChange={setIsScriptDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Script
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Import Your Script</DialogTitle>
                    <DialogDescription className="text-base">
                      Paste your complete script below. Frame numbers will be auto-detected (e.g., "Frame 1:", "Frame 2:", etc.). You can add voice over, editing, and camera notes later.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Frame 1: Welcome to our AI video course. Today we will explore the fundamentals...\n\nFrame 2: Artificial Intelligence has transformed the way we live and work...\n\nFrame 3: Let's start with the basics..."
                    className="min-h-[400px] font-mono text-sm border-slate-300"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsScriptDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleParseScript} className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Import All Frames
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Dialog open={isScriptDialogOpen} onOpenChange={setIsScriptDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    Import New Script
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Import Your Script</DialogTitle>
                    <DialogDescription className="text-base">
                      Paste your complete script below. This will replace all existing frames.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Frame 1: Welcome to our AI video course...\n\nFrame 2: Today we will explore..."
                    className="min-h-[400px] font-mono text-sm border-slate-300"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsScriptDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleParseScript} className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Import All Frames
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button onClick={handleAddFrame} variant="outline" className="border-slate-300">
                <Plus className="h-4 w-4 mr-2" />
                Add Single Frame
              </Button>

              <Button onClick={handleExportPDF} variant="outline" className="border-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          )}
        </div>

        {/* Frames List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Storyboard Frames ({frames.length})
            </h2>
          </div>

          {frames.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-slate-100 rounded-full">
                  <Film className="h-12 w-12 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No frames yet</h3>
                  <p className="text-slate-500">Import your script above to get started</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {frames.map((frame) => (
                <FrameCard
                  key={frame.id}
                  frame={frame}
                  onEdit={handleEditFrame}
                  onDelete={handleDeleteFrame}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Frame Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFrame ? 'Edit Frame' : 'Add New Frame'}</DialogTitle>
            <DialogDescription>
              Fill in the details for your storyboard frame
            </DialogDescription>
          </DialogHeader>
          <FrameEditor
            frame={selectedFrame}
            onSave={handleSaveFrame}
            onCancel={() => setIsEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
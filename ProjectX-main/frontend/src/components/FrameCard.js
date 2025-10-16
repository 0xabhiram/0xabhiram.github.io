import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit, Trash2, Film, Mic, Scissors, AlertCircle } from 'lucide-react';

const FrameCard = ({ frame, onEdit, onDelete }) => {
  // Check if frame has all details filled
  const hasDetails = frame.sceneDescription || frame.cameraNote || frame.editingNote || frame.facilitatorCostume;
  
  return (
    <Card className="hover:shadow-md transition-shadow border-slate-200 cursor-pointer" onClick={() => onEdit(frame)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Film className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-800">Frame {frame.frameNumber}</h3>
                {!hasDetails && (
                  <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Details pending
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="mt-1 border-blue-200 text-blue-700 bg-blue-50">
                {frame.frameTone}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(frame)}
              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(frame.id)}
              className="text-slate-600 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Content</h4>
          <p className="text-sm text-slate-600 line-clamp-3">{frame.content}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">Frame Type</p>
            <Badge variant="secondary" className="text-xs">{frame.frameType}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Mic className={`h-4 w-4 ${frame.voiceOverRequired ? 'text-green-600' : 'text-slate-400'}`} />
            <span className="text-xs text-slate-600">
              Voice Over: {frame.voiceOverRequired ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Scissors className={`h-4 w-4 ${frame.editingRequired ? 'text-green-600' : 'text-slate-400'}`} />
            <span className="text-xs text-slate-600">
              Editing: {frame.editingRequired ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {hasDetails && (
          <div className="pt-2 border-t border-slate-100">
            {frame.sceneDescription && (
              <div className="mb-2">
                <h4 className="text-xs font-medium text-slate-700 mb-1">Scene</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{frame.sceneDescription}</p>
              </div>
            )}
            {frame.cameraNote && (
              <div>
                <h4 className="text-xs font-medium text-slate-700 mb-1">Camera</h4>
                <p className="text-xs text-slate-600 line-clamp-1">{frame.cameraNote}</p>
              </div>
            )}
          </div>
        )}
        
        {!hasDetails && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
              Click to add voice over, editing, camera, and scene details
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FrameCard;
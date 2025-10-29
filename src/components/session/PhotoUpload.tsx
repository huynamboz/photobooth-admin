import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload, Image, X } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, caption?: string) => Promise<void>;
  sessionId: string;
  loading?: boolean;
}

function PhotoUpload({ isOpen, onClose, onUpload, sessionId, loading = false }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<'upload' | 'add-to-session'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploadStep('add-to-session');
      await onUpload(selectedFile, caption || undefined);
      handleClose();
    } catch (error) {
      setUploadStep('upload');
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCaption('');
    setPreview(null);
    setUploadStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Photo to Session</DialogTitle>
          {loading && (
            <div className="text-sm text-gray-600">
              {uploadStep === 'upload' ? 'Uploading image...' : 'Adding photo to session...'}
            </div>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Select Photo *</Label>
            <div className="flex items-center space-x-2">
              <Input
                ref={fileInputRef}
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Supported formats: JPG, PNG, GIF. Max size: 10MB
            </p>
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter photo caption..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedFile}>
              {loading 
                ? (uploadStep === 'upload' ? 'Uploading Image...' : 'Adding to Session...') 
                : 'Upload Photo'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PhotoUpload;

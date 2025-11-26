import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, caption?: string) => Promise<void>;
  onUploadMultiple?: (files: File[]) => Promise<void>;
  sessionId: string;
  loading?: boolean;
}

function PhotoUpload({ isOpen, onClose, onUpload, onUploadMultiple, loading = false }: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [uploadStep, setUploadStep] = useState<'upload' | 'add-to-session'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check max limit (20 images)
    if (selectedFiles.length + files.length > 20) {
      toast.error('Maximum 20 images allowed per upload');
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} (not an image)`);
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (exceeds 10MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length === 0) return;

    // Create previews for valid files
    const newPreviews: { file: File; url: string }[] = [];
    let loadedCount = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({ file, url: e.target?.result as string });
        loadedCount++;
        
        // When all previews are loaded, update state
        if (loadedCount === validFiles.length) {
          setPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAll = () => {
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    try {
      setUploadStep('add-to-session');
      
      // Use multiple upload if available and more than 1 file
      if (onUploadMultiple && selectedFiles.length > 1) {
        await onUploadMultiple(selectedFiles);
      } else {
        // Single file upload (backward compatibility)
        for (const file of selectedFiles) {
          await onUpload(file);
        }
      }
      
      handleClose();
    } catch (error) {
      setUploadStep('upload');
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setPreviews([]);
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
            <Label htmlFor="photo">Select Photos *</Label>
            <div className="flex items-center space-x-2">
              <Input
                ref={fileInputRef}
                id="photo"
                type="file"
                accept="image/*"
                multiple
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
              Supported formats: JPG, PNG, GIF, WEBP. Max size: 10MB per image. Max 20 images.
            </p>
            {selectedFiles.length > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </div>

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Preview ({previews.length} image{previews.length > 1 ? 's' : ''})</Label>
                {selectedFiles.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAll}
                  >
                    Remove All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto p-2 border rounded-lg">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                      {preview.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || selectedFiles.length === 0}>
              {loading 
                ? (uploadStep === 'upload' ? 'Uploading Images...' : 'Adding to Session...') 
                : selectedFiles.length > 1 
                  ? `Upload ${selectedFiles.length} Photos`
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

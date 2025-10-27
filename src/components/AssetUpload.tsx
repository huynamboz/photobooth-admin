import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AssetType, type UploadAssetRequest } from "@/types/asset";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface AssetUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: UploadAssetRequest) => Promise<void>;
}

function AssetUpload({ isOpen, onClose, onUpload }: AssetUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<AssetType>(AssetType.FRAME);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      await onUpload({
        file: selectedFile,
        type: assetType,
      });
      toast.success('Asset uploaded successfully');
      onClose();
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload asset');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setAssetType(AssetType.FRAME);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!uploading) {
      onClose();
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Asset</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="assetType">Asset Type *</Label>
            <select
              id="assetType"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as AssetType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            >
              <option value={AssetType.FRAME}>Frame</option>
              <option value={AssetType.FILTER}>Filter</option>
              <option value={AssetType.STICKER}>Sticker</option>
            </select>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Upload File *</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <ImageIcon className="mx-auto h-12 w-12 text-green-500" />
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Drop your image here, or{' '}
                      <span className="text-blue-600 hover:text-blue-500 cursor-pointer">
                        browse
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || !selectedFile}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AssetUpload;

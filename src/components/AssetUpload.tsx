import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  
  // Filter properties (only for type="filter")
  const [filterType, setFilterType] = useState<string>('');
  const [scale, setScale] = useState<string>('');
  const [offsetY, setOffsetY] = useState<string>('');
  const [anchorIdx, setAnchorIdx] = useState<string>('');
  const [leftIdx, setLeftIdx] = useState<string>('');
  const [rightIdx, setRightIdx] = useState<string>('');

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
      const uploadData: UploadAssetRequest = {
        file: selectedFile,
        type: assetType,
      };

      // Add filter properties if type is filter
      if (assetType === AssetType.FILTER) {
        uploadData.filterType = filterType || null;
        if (scale) uploadData.scale = parseFloat(scale);
        if (offsetY) uploadData.offset_y = parseFloat(offsetY);
        if (anchorIdx) uploadData.anchor_idx = parseInt(anchorIdx, 10);
        if (leftIdx) uploadData.left_idx = parseInt(leftIdx, 10);
        if (rightIdx) uploadData.right_idx = parseInt(rightIdx, 10);
      }

      await onUpload(uploadData);
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
    setFilterType('');
    setScale('');
    setOffsetY('');
    setAnchorIdx('');
    setLeftIdx('');
    setRightIdx('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset filter fields when asset type changes
  useEffect(() => {
    if (assetType !== AssetType.FILTER) {
      setFilterType('');
      setScale('');
      setOffsetY('');
      setAnchorIdx('');
      setLeftIdx('');
      setRightIdx('');
    }
  }, [assetType]);

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

          {/* Filter Properties (only shown when type is filter) */}
          {assetType === AssetType.FILTER && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Properties</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Filter Type */}
                <div className="space-y-2">
                  <Label htmlFor="filterType">Filter Type</Label>
                  <Input
                    id="filterType"
                    type="text"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    placeholder="e.g. cute, cool, poetic"
                    disabled={uploading}
                  />
                </div>

                {/* Scale */}
                <div className="space-y-2">
                  <Label htmlFor="scale">Scale</Label>
                  <Input
                    id="scale"
                    type="number"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    placeholder="e.g. 2.5"
                    disabled={uploading}
                  />
                </div>

                {/* Offset Y */}
                <div className="space-y-2">
                  <Label htmlFor="offsetY">Offset Y</Label>
                  <Input
                    id="offsetY"
                    type="number"
                    step="0.1"
                    value={offsetY}
                    onChange={(e) => setOffsetY(e.target.value)}
                    placeholder="e.g. -100"
                    disabled={uploading}
                  />
                </div>

                {/* Anchor Index */}
                <div className="space-y-2">
                  <Label htmlFor="anchorIdx">Anchor Index</Label>
                  <Input
                    id="anchorIdx"
                    type="number"
                    value={anchorIdx}
                    onChange={(e) => setAnchorIdx(e.target.value)}
                    placeholder="e.g. 10"
                    disabled={uploading}
                  />
                </div>

                {/* Left Index */}
                <div className="space-y-2">
                  <Label htmlFor="leftIdx">Left Index</Label>
                  <Input
                    id="leftIdx"
                    type="number"
                    value={leftIdx}
                    onChange={(e) => setLeftIdx(e.target.value)}
                    placeholder="e.g. 10"
                    disabled={uploading}
                  />
                </div>

                {/* Right Index */}
                <div className="space-y-2">
                  <Label htmlFor="rightIdx">Right Index</Label>
                  <Input
                    id="rightIdx"
                    type="number"
                    value={rightIdx}
                    onChange={(e) => setRightIdx(e.target.value)}
                    placeholder="e.g. 10"
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>
          )}

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

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { type Asset } from "@/types/asset";
import { Edit } from "lucide-react";
import { toast } from "sonner";

interface AssetEditFilterProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onUpdate: (assetId: string, filterData: {
    filterType?: string | null;
    scale?: number;
    offset_y?: number;
    anchor_idx?: number;
    left_idx?: number;
    right_idx?: number;
  }) => Promise<void>;
  loading?: boolean;
}

function AssetEditFilter({ isOpen, onClose, asset, onUpdate, loading = false }: AssetEditFilterProps) {
  const [filterType, setFilterType] = useState<string>('');
  const [scale, setScale] = useState<string>('');
  const [offsetY, setOffsetY] = useState<string>('');
  const [anchorIdx, setAnchorIdx] = useState<string>('');
  const [leftIdx, setLeftIdx] = useState<string>('');
  const [rightIdx, setRightIdx] = useState<string>('');

  // Initialize form with asset data
  useEffect(() => {
    if (asset && asset.type === 'filter') {
      setFilterType(asset.filterType || '');
      setScale(asset.scale?.toString() || '');
      setOffsetY(asset.offset_y?.toString() || '');
      setAnchorIdx(asset.anchor_idx?.toString() || '');
      setLeftIdx(asset.left_idx?.toString() || '');
      setRightIdx(asset.right_idx?.toString() || '');
    }
  }, [asset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asset) {
      toast.error('No asset selected');
      return;
    }

    if (asset.type !== 'filter') {
      toast.error('This asset is not a filter');
      return;
    }

    try {
      const filterData: {
        filterType?: string | null;
        scale?: number;
        offset_y?: number;
        anchor_idx?: number;
        left_idx?: number;
        right_idx?: number;
      } = {};

      filterData.filterType = filterType || null;
      if (scale) filterData.scale = parseFloat(scale);
      if (offsetY) filterData.offset_y = parseFloat(offsetY);
      if (anchorIdx) filterData.anchor_idx = parseInt(anchorIdx, 10);
      if (leftIdx) filterData.left_idx = parseInt(leftIdx, 10);
      if (rightIdx) filterData.right_idx = parseInt(rightIdx, 10);

      await onUpdate(asset.id, filterData);
      toast.success('Filter properties updated successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update filter properties');
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!asset || asset.type !== 'filter') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Filter Properties
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {loading ? 'Updating...' : 'Update Filter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AssetEditFilter;


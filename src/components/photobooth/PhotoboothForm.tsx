import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Photobooth, type CreatePhotoboothRequest, type UpdatePhotoboothRequest, type PhotoboothStatus } from "@/types/photobooth";

interface PhotoboothFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePhotoboothRequest | UpdatePhotoboothRequest) => void;
  photobooth?: Photobooth | null;
  loading?: boolean;
}

function PhotoboothForm({ isOpen, onClose, onSubmit, photobooth, loading = false }: PhotoboothFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'available' as PhotoboothStatus,
  });

  useEffect(() => {
    if (photobooth) {
      setFormData({
        name: photobooth.name,
        description: photobooth.description || '',
        location: photobooth.location || '',
        status: photobooth.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        status: 'available',
      });
    }
  }, [photobooth, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {photobooth ? 'Edit Photobooth' : 'Create New Photobooth'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter photobooth name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (photobooth ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PhotoboothForm;

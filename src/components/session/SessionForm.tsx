import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CreateSessionRequest } from "@/types/session";
import { usePhotoboothStore } from "@/stores/photoboothStore";

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSessionRequest) => void;
  loading?: boolean;
}

function SessionForm({ isOpen, onClose, onSubmit, loading = false }: SessionFormProps) {
  const { photobooths, fetchPhotobooths } = usePhotoboothStore();
  
  const [formData, setFormData] = useState({
    photoboothId: '',
    maxPhotos: 10,
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchPhotobooths({ limit: 100 }); // Load all photobooths for selection
    }
  }, [isOpen, fetchPhotobooths]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        photoboothId: '',
        maxPhotos: 10,
        notes: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Create New Session
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="photoboothId">Photobooth *</Label>
              <Select
                value={formData.photoboothId}
                onValueChange={(value) => handleChange('photoboothId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select photobooth" />
                </SelectTrigger>
                <SelectContent>
                  {photobooths.map((photobooth) => (
                    <SelectItem key={photobooth.id} value={photobooth.id}>
                      {photobooth.name} {photobooth.location && `(${photobooth.location})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPhotos">Max Photos</Label>
              <Input
                id="maxPhotos"
                type="number"
                min="1"
                max="50"
                value={formData.maxPhotos}
                onChange={(e) => handleChange('maxPhotos', parseInt(e.target.value) || 10)}
                placeholder="10"
              />
            </div>
          </div>



          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Enter session notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SessionForm;

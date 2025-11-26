import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type User } from "@/types/user";

interface AddPointsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (points: number) => Promise<void>;
  user: User | null;
  loading?: boolean;
}

function AddPointsDialog({ isOpen, onClose, onSubmit, user, loading = false }: AddPointsDialogProps) {
  const [points, setPoints] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPoints('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pointsValue = parseInt(points, 10);
    
    if (!points || isNaN(pointsValue) || pointsValue < 1) {
      setError('Points must be a positive integer (minimum 1)');
      return;
    }

    try {
      await onSubmit(pointsValue);
      onClose();
    } catch (err) {
      // Error is handled by parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Points</DialogTitle>
          <DialogDescription>
            Add points to user <strong>{user?.name}</strong> ({user?.email})
            {user?.points !== undefined && (
              <span className="block mt-1 text-sm text-gray-600">
                Current points: <strong>{user.points}</strong>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="1"
                step="1"
                placeholder="Enter points to add"
                value={points}
                onChange={(e) => {
                  setPoints(e.target.value);
                  setError('');
                }}
                disabled={loading}
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <p className="text-xs text-gray-500">
                Minimum: 1 point
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Points'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddPointsDialog;


import { useState } from 'react';
import { type Photo } from '@/types/photo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  Download, 
  Edit,
  CheckCircle,
  Clock,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface PhotoTableProps {
  photos: Photo[];
  loading: boolean;
  onViewDetails: (photo: Photo) => void;
  onDelete: (id: string) => void;
  onUpdateCaption: (id: string, caption: string) => void;
  onMarkProcessed: (id: string) => void;
  onDownload: (id: string) => void;
}

function PhotoTable({
  photos,
  loading,
  onViewDetails,
  onDelete,
  onUpdateCaption,
  onMarkProcessed,
  onDownload
}: PhotoTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');

  const handleEditStart = (photo: Photo) => {
    setEditingId(photo.id);
    setEditCaption(photo.caption || '');
  };

  const handleEditSave = () => {
    if (editingId && editCaption !== undefined) {
      onUpdateCaption(editingId, editCaption);
      setEditingId(null);
      setEditCaption('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditCaption('');
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProcessedStatus = (photo: Photo) => {
    if (photo.isProcessed) {
      return <Badge className="bg-green-100 text-green-800">Processed</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading photos...</span>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No photos found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No photos match your current filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Caption</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {photos.map((photo) => (
              <TableRow key={photo.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || `Photo ${photo.order}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">#{photo.sessionId.slice(-8)}</div>
                    {photo.session && (
                      <div className="text-gray-500 capitalize">
                        {photo.session.status}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {editingId === photo.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="h-8"
                        placeholder="Enter caption..."
                      />
                      <Button
                        size="sm"
                        onClick={handleEditSave}
                        disabled={editCaption === (photo.caption || '')}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm">
                      {photo.caption || (
                        <span className="text-gray-400 italic">No caption</span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">#{photo.order}</span>
                </TableCell>
                <TableCell>
                  {getProcessedStatus(photo)}
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {formatDate(photo.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(photo)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditStart(photo)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Caption
                      </DropdownMenuItem>
                      {!photo.isProcessed && (
                        <DropdownMenuItem onClick={() => onMarkProcessed(photo.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Processed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDownload(photo.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(photo.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the photo
              and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default PhotoTable;

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Photo } from "@/types/photo";
import { 
  Image as ImageIcon,
  Download,
  Calendar,
  Hash,
  FileText,
  CheckCircle,
  Clock,
  X
} from "lucide-react";
import { toast } from "sonner";

interface PhotoDetailProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
  loading?: boolean;
}

function PhotoDetail({ isOpen, onClose, photo, loading = false }: PhotoDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = () => {
    if (photo) {
      const link = document.createElement('a');
      link.href = photo.imageUrl;
      link.download = `photo-${photo.id.slice(-8)}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Photo download started');
    }
  };

  if (!photo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Photo Details - #{photo.id.slice(-8)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Photo Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || `Photo ${photo.order}`}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Information */}
          <Card>
            <CardHeader>
              <CardTitle>Photo Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo ID */}
                <div className="flex items-center space-x-3">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Photo ID</div>
                    <div className="font-medium font-mono text-sm">
                      {photo.id}
                    </div>
                  </div>
                </div>

                {/* Order */}
                <div className="flex items-center space-x-3">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Order</div>
                    <div className="font-medium">#{photo.order}</div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-3">
                  {photo.isProcessed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge className={photo.isProcessed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {photo.isProcessed ? 'Processed' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                {/* Caption */}
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Caption</div>
                    <div className="font-medium">
                      {photo.caption || (
                        <span className="text-gray-400 italic">No caption</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Created</div>
                    <div className="text-sm">{formatDate(photo.createdAt)}</div>
                  </div>
                </div>

                {photo.processedAt && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Processed</div>
                      <div className="text-sm">{formatDate(photo.processedAt)}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Information */}
          {photo.session && (
            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Session ID</div>
                    <div className="font-medium font-mono text-sm">
                      {photo.session.id}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge className="bg-blue-100 text-blue-800 capitalize">
                      {photo.session.status}
                    </Badge>
                  </div>
                  {photo.session.userId && (
                    <div>
                      <div className="text-sm text-gray-500">User ID</div>
                      <div className="font-medium font-mono text-sm">
                        {photo.session.userId}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-500">Photobooth ID</div>
                    <div className="font-medium font-mono text-sm">
                      {photo.session.photoboothId}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Image URL</div>
                  <div className="font-mono text-xs break-all text-blue-600">
                    <a 
                      href={photo.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {photo.imageUrl}
                    </a>
                  </div>
                </div>
                {photo.publicId && (
                  <div>
                    <div className="text-sm text-gray-500">Public ID</div>
                    <div className="font-mono text-xs break-all">
                      {photo.publicId}
                    </div>
                  </div>
                )}
                {photo.thumbnailUrl && (
                  <div>
                    <div className="text-sm text-gray-500">Thumbnail URL</div>
                    <div className="font-mono text-xs break-all text-blue-600">
                      <a 
                        href={photo.thumbnailUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {photo.thumbnailUrl}
                      </a>
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">Last Updated</div>
                  <div className="text-sm">{formatDate(photo.updatedAt)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PhotoDetail;

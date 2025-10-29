import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Session } from "@/types/session";
import { 
  Camera, 
  User, 
  Clock, 
  MapPin, 
  Calendar, 
  Image as ImageIcon,
  X,
  Download,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface SessionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  loading?: boolean;
}

function SessionDetail({ isOpen, onClose, session, loading = false }: SessionDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'active':
        return '📸';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'expired':
        return '⏰';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (session: Session) => {
    if (session.startedAt && session.completedAt) {
      const start = new Date(session.startedAt);
      const end = new Date(session.completedAt);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes`;
    }
    return '-';
  };

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image download started');
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  if (!session) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Session Details - #{session.id.slice(-8)}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Session Information</span>
                  <div className="flex items-center space-x-2">
                    <span>{getStatusIcon(session.status)}</span>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">User</div>
                      <div className="font-medium">
                        {session.user ? (
                          <div>
                            <div>{session.user.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{session.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No user assigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Photobooth Info */}
                  <div className="flex items-center space-x-3">
                    <Camera className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Photobooth</div>
                      <div className="font-medium">
                        <div>{session.photobooth.name}</div>
                        {session.photobooth.location && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {session.photobooth.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Photo Count */}
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Photos</div>
                      <div className="font-medium">
                        {session.photoCount} / {session.maxPhotos}
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{getDuration(session)}</div>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Created</div>
                      <div className="text-sm">{formatDate(session.createdAt)}</div>
                    </div>
                  </div>

                  {session.startedAt && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Started</div>
                        <div className="text-sm">{formatDate(session.startedAt)}</div>
                      </div>
                    </div>
                  )}

                  {session.completedAt && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Completed</div>
                        <div className="text-sm">{formatDate(session.completedAt)}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {session.notes && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-2">Notes</div>
                    <div className="text-sm bg-gray-50 p-3 rounded-md">
                      {session.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photos Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>Photos ({session.photos.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {session.photos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No photos in this session</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {session.photos.map((photo, index) => (
                      <div key={photo.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={photo.imageUrl}
                            alt={photo.caption || `Photo ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleViewImage(photo.imageUrl)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownloadImage(photo.imageUrl, `photo-${index + 1}.jpg`)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Photo Info */}
                        <div className="mt-2">
                          <div className="text-xs text-gray-500">#{photo.order}</div>
                          {photo.caption && (
                            <div className="text-xs text-gray-700 truncate" title={photo.caption}>
                              {photo.caption}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Image Viewer Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Image Preview</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default SessionDetail;

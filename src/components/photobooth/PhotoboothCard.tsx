import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { type Photobooth, type PhotoboothStatus } from "@/types/photobooth";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Clock,
  Activity
} from "lucide-react";

interface PhotoboothCardProps {
  photobooth: Photobooth;
  onEdit: (photobooth: Photobooth) => void;
  onDelete: (id: string) => void;
  onViewDetails: (photobooth: Photobooth) => void;
}

function PhotoboothCard({ 
  photobooth, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: PhotoboothCardProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusColor = (status: PhotoboothStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: PhotoboothStatus) => {
    switch (status) {
      case 'available':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'busy':
        return <div className="w-3 h-3 bg-orange-500 rounded-full"></div>;
      case 'maintenance':
        return <div className="w-3 h-3 bg-purple-500 rounded-full"></div>;
      case 'offline':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                {photobooth.name}
              </CardTitle>
              {photobooth.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {photobooth.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(photobooth)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(photobooth)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDeleteId(photobooth.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Status Badge */}
          <div className="flex items-center space-x-2 mb-4">
            {getStatusIcon(photobooth.status)}
            <Badge className={`${getStatusColor(photobooth.status)} text-xs font-medium`}>
              {photobooth.status.charAt(0).toUpperCase() + photobooth.status.slice(1)}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {photobooth.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{photobooth.location}</span>
              </div>
            )}

            {photobooth.currentSessionId && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Activity className="h-4 w-4" />
                <span>Session: {photobooth.currentSessionId.slice(-8)}</span>
              </div>
            )}

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Updated {formatDate(photobooth.updatedAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(photobooth)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(photobooth)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the photobooth
              "{photobooth.name}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
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

export default PhotoboothCard;

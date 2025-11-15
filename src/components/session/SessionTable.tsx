import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { type Session, type SessionStatus } from "@/types/session";
import { MoreHorizontal, Trash2, Eye, Camera, User, Clock, CheckCircle, Upload, Play } from "lucide-react";

interface SessionTableProps {
  sessions: Session[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SessionStatus) => void;
  onViewDetails: (session: Session) => void;
  onUploadPhoto: (session: Session) => void;
  onClearSession?: (photoboothId: string) => void;
  onStartCapture?: (sessionId: string) => void;
}

function SessionTable({ 
  sessions, 
  loading = false, 
  onDelete, 
  onStatusChange,
  onViewDetails,
  onUploadPhoto,
  onClearSession,
  onStartCapture
}: SessionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusColor = (status: SessionStatus) => {
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

  const getStatusIcon = (status: SessionStatus) => {
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
      month: 'short',
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
      return `${diffMins} min`;
    }
    return '-';
  };

  const canDelete = (status: SessionStatus) => ['pending', 'cancelled', 'expired'].includes(status);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Photobooth</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No sessions found
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">#{session.id.slice(-8)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {session.user ? (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{session.user.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{session.user.email}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="font-medium">{session.photobooth.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{getStatusIcon(session.status)}</span>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{session.photoCount}</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-500">{session.maxPhotos}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {session.startedAt ? formatDate(session.startedAt) : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {session.completedAt ? formatDate(session.completedAt) : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {getDuration(session)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(session)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {['active', 'completed'].includes(session.status) && (
                          <DropdownMenuItem onClick={() => onUploadPhoto(session)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                          </DropdownMenuItem>
                        )}
                        {session.status === 'pending' && (
                          <DropdownMenuItem onClick={() => onStatusChange(session.id, 'active')}>
                            <Camera className="mr-2 h-4 w-4" />
                            Start Session
                          </DropdownMenuItem>
                        )}
                        {['pending', 'active'].includes(session.status) && (
                          <DropdownMenuItem onClick={() => onStatusChange(session.id, 'cancelled')}>
                            <Clock className="mr-2 h-4 w-4" />
                            Cancel Session
                          </DropdownMenuItem>
                        )}
                        {session.status === 'active' && (
                          <DropdownMenuItem onClick={() => onStatusChange(session.id, 'completed')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Complete Session
                          </DropdownMenuItem>
                        )}
                        {session.status === 'active' && onStartCapture && (
                          <DropdownMenuItem onClick={() => onStartCapture(session.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            Start Capture
                          </DropdownMenuItem>
                        )}
                        {session.status === 'active' && onClearSession && (
                          <DropdownMenuItem onClick={() => onClearSession(session.photoboothId)}>
                            <Clock className="mr-2 h-4 w-4" />
                            Clear Session
                          </DropdownMenuItem>
                        )}
                        {canDelete(session.status) && (
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(session.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the session
              and remove all associated data.
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

export default SessionTable;

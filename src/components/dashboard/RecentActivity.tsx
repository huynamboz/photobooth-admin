import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Session } from "@/types/session";
import { Clock, Camera, CheckCircle, XCircle } from "lucide-react";

interface RecentActivityProps {
  sessions: Session[];
  loading?: boolean;
}

function RecentActivity({ sessions, loading = false }: RecentActivityProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Camera className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="animate-pulse bg-gray-200 rounded-full h-8 w-8"></div>
                <div className="flex-1 space-y-2">
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-3/4"></div>
                  <div className="animate-pulse bg-gray-200 rounded h-3 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.slice(0, 10).map((session) => (
              <div key={session.id} className="flex items-center space-x-3">
                <div className="shrink-0">
                  {getStatusIcon(session.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Session {session.id.slice(-8)}
                    </p>
                    <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{session.photobooth?.name}</span>
                    <span>•</span>
                    <span>{session.photoCount} photos</span>
                    <span>•</span>
                    <span>{formatTimeAgo(session.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;

import { useState, useEffect, useCallback } from 'react';
import Layout from "../components/Layout";
import SessionTable from "../components/session/SessionTable";
import SessionForm from "../components/session/SessionForm";
import SessionFiltersComponent from "../components/session/SessionFilters";
import PhotoUpload from "../components/session/PhotoUpload";
import SessionDetail from "../components/session/SessionDetail";
import FilterSelectorDialog from "../components/session/FilterSelectorDialog";
import PaginationWrapper from "../components/PaginationWrapper";
import { useSessionStore } from "@/stores/sessionStore";
import { usePhotoboothStore } from "@/stores/photoboothStore";
import { type Session, type SessionStatus, type CreateSessionRequest } from "@/types/session";
import { type Asset } from "@/types/asset";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { toast } from "sonner";

function SessionsPage() {
  const {
    sessions,
    pagination,
    loading,
    error,
    filters,
    fetchSessions,
    createSession,
    updateSession,
    cancelSession,
    deleteSession,
    startSession,
    completeSession,
    uploadPhoto,
    uploadMultiplePhotos,
    clearSessionFromPhotobooth,
    startCapture,
    addFilter,
    removeFilter,
    setFilters,
    clearFilters,
    clearError
  } = useSessionStore();

  const {
    photobooths,
    fetchPhotobooths
  } = usePhotoboothStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const loadSessions = useCallback(async () => {
    try {
      await fetchSessions({
        page: currentPage,
        limit: pageSize,
        ...filters
      });
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }, [fetchSessions, currentPage, pageSize, filters]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    fetchPhotobooths({ limit: 100 }); // Load photobooths for filters
  }, [fetchPhotobooths]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleCreateSession = async (data: CreateSessionRequest) => {
    try {
      await createSession(data);
      toast.success('Session created successfully');
      setIsFormOpen(false);
      loadSessions();
    } catch {
      toast.error('Failed to create session');
    }
  };


  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSession(id);
      toast.success('Session deleted successfully');
      loadSessions();
    } catch {
      toast.error('Failed to delete session');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      if (status === 'active') {
        await startSession(id);
        toast.success('Session started successfully');
      } else if (status === 'completed') {
        await completeSession(id);
        toast.success('Session completed successfully');
      } else if (status === 'cancelled') {
        await cancelSession(id);
        toast.success('Session cancelled successfully');
      } else {
        await updateSession(id, { status: status as SessionStatus });
        toast.success(`Session status changed to ${status}`);
      }
      loadSessions();
    } catch {
      toast.error('Failed to update session status');
    }
  };

  const handleClearSession = async (photoboothId: string) => {
    try {
      await clearSessionFromPhotobooth(photoboothId);
      toast.success('Session cleared from photobooth successfully');
      loadSessions();
    } catch {
      toast.error('Failed to clear session from photobooth');
    }
  };

  const handleStartCapture = async (sessionId: string) => {
    try {
      await startCapture(sessionId);
      toast.success('Capture started successfully');
    } catch {
      toast.error('Failed to start capture');
    }
  };


  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setIsDetailOpen(true);
  };

  const handleUploadPhoto = (session: Session) => {
    setSelectedSession(session);
    setIsPhotoUploadOpen(true);
  };

  const handlePhotoUpload = async (file: File, caption?: string) => {
    if (!selectedSession) return;
    
    try {
      await uploadPhoto(selectedSession.id, file, caption);
      toast.success('Photo uploaded successfully');
      loadSessions();
    } catch {
      toast.error('Failed to upload photo');
    }
  };

  const handleMultiplePhotoUpload = async (files: File[]) => {
    if (!selectedSession) return;
    
    try {
      const result = await uploadMultiplePhotos(selectedSession.id, files);
      toast.success(`Successfully uploaded ${result.uploaded} photo${result.uploaded > 1 ? 's' : ''}`);
      if (result.failed > 0) {
        toast.warning(`${result.failed} photo(s) failed to upload`);
      }
      loadSessions();
    } catch {
      toast.error('Failed to upload photos');
    }
  };

  const handlePhotoUploadClose = () => {
    setIsPhotoUploadOpen(false);
    setSelectedSession(null);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedSession(null);
  };

  const handleChangeFilter = (session: Session) => {
    setSelectedSession(session);
    setIsFilterDialogOpen(true);
  };

  const handleFilterSelect = async (filter: Asset) => {
    if (!selectedSession) return;
    
    const isFilterInSession = selectedSession.filterIds?.includes(filter.id) || false;
    
    try {
      if (isFilterInSession) {
        await removeFilter(selectedSession.id, filter.id);
        toast.success(`Filter "${filter.filterType || filter.id}" removed successfully`);
      } else {
        await addFilter(selectedSession.id, filter.id);
        toast.success(`Filter "${filter.filterType || filter.id}" added successfully`);
      }
      setIsFilterDialogOpen(false);
      setSelectedSession(null);
      loadSessions(); // Refresh sessions list
    } catch (error) {
      toast.error(isFilterInSession ? 'Failed to remove filter' : 'Failed to add filter');
    }
  };

  const handleFilterDialogClose = () => {
    setIsFilterDialogOpen(false);
    setSelectedSession(null);
  };

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      expired: 0
    };
    
    sessions.forEach(session => {
      counts[session.status]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Session Management
                </h1>
                <p className="text-gray-600">
                  Monitor and manage photo sessions.
                </p>
              </div>
              <Button onClick={handleCreate} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <SessionFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
              photobooths={photobooths}
            />
          </div>

          {/* Stats */}
          {pagination && (
            <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing {sessions.length} of {pagination.total} sessions
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Pending: {statusCounts.pending}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Active: {statusCounts.active}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Completed: {statusCounts.completed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Cancelled: {statusCounts.cancelled}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Expired: {statusCounts.expired}</span>
                </div>
              </div>
            </div>
          )}

          {/* Sessions Table */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-500 mb-4">
                {Object.values(filters).some(v => v) 
                  ? "Try adjusting your filters to see more results."
                  : "Get started by creating your first session."
                }
              </p>
              {!Object.values(filters).some(v => v) && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              )}
            </div>
          ) : (
            <>
              <SessionTable
                sessions={sessions}
                loading={loading}
                onDelete={handleDeleteSession}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
                onUploadPhoto={handleUploadPhoto}
                onClearSession={handleClearSession}
                onStartCapture={handleStartCapture}
                onChangeFilter={handleChangeFilter}
              />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <PaginationWrapper
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}

          {/* Form Modal */}
          <SessionForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSubmit={(data) => handleCreateSession(data as CreateSessionRequest)}
            loading={loading}
          />

          {/* Photo Upload Modal */}
          <PhotoUpload
            isOpen={isPhotoUploadOpen}
            onClose={handlePhotoUploadClose}
            onUpload={handlePhotoUpload}
            onUploadMultiple={handleMultiplePhotoUpload}
            sessionId={selectedSession?.id || ''}
            loading={loading}
          />

          {/* Session Detail Modal */}
          <SessionDetail
            isOpen={isDetailOpen}
            onClose={handleDetailClose}
            session={selectedSession}
            onFilterChanged={loadSessions}
          />

          {/* Filter Selector Dialog */}
          <FilterSelectorDialog
            isOpen={isFilterDialogOpen}
            onClose={handleFilterDialogClose}
            onSelectFilter={handleFilterSelect}
            session={selectedSession}
          />
        </div>
      </div>
    </Layout>
  );
}

export default SessionsPage;

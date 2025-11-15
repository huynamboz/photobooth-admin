import { useState, useEffect, useCallback } from 'react';
import Layout from "../components/Layout";
import PhotoTable from "../components/photo/PhotoTable";
import PhotoFilters from "../components/photo/PhotoFilters";
import PhotoDetail from "../components/photo/PhotoDetail";
import PaginationWrapper from "../components/PaginationWrapper";
import { usePhotoStore } from "@/stores/photoStore";
import { type Photo } from "@/types/photo";
import { 
  Image as ImageIcon,
  Download,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

function PhotosPage() {
  const {
    photos,
    pagination,
    loading,
    error,
    filters,
    fetchPhotos,
    deletePhoto,
    updatePhotoCaption,
    markPhotoAsProcessed,
    downloadPhoto,
    setFilters,
    clearFilters,
    clearError
  } = usePhotoStore();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const loadPhotos = useCallback(async () => {
    const params = {
      page: currentPage,
      limit: pageSize,
      ...filters
    };
    await fetchPhotos(params);
  }, [currentPage, pageSize, filters, fetchPhotos]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await deletePhoto(id);
      toast.success('Photo deleted successfully');
      loadPhotos(); // Refresh the list
    } catch {
      toast.error('Failed to delete photo');
    }
  };

  const handleUpdateCaption = async (id: string, caption: string) => {
    try {
      await updatePhotoCaption(id, caption);
      toast.success('Photo caption updated successfully');
      loadPhotos(); // Refresh the list
    } catch {
      toast.error('Failed to update photo caption');
    }
  };

  const handleMarkProcessed = async (id: string) => {
    try {
      await markPhotoAsProcessed(id);
      toast.success('Photo marked as processed');
      loadPhotos(); // Refresh the list
    } catch {
      toast.error('Failed to mark photo as processed');
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadPhoto(id);
      toast.success('Photo download started');
    } catch {
      toast.error('Failed to download photo');
    }
  };

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  // Calculate stats
  const totalPhotos = pagination?.total || 0;
  const processedPhotos = photos.filter(photo => photo.isProcessed).length;
  const pendingPhotos = photos.filter(photo => !photo.isProcessed).length;

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Photo Management
            </h1>
            <p className="text-gray-600">
              Manage and organize all photos in the system.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <ImageIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Photos</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalPhotos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Processed</p>
                  <p className="text-2xl font-semibold text-gray-900">{processedPhotos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{pendingPhotos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Processing Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {totalPhotos > 0 ? Math.round((processedPhotos / totalPhotos) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <PhotoFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Photos Table */}
          <div className="mt-6">
            <PhotoTable
              photos={photos}
              loading={loading}
              onViewDetails={handleViewDetails}
              onDelete={handleDeletePhoto}
              onUpdateCaption={handleUpdateCaption}
              onMarkProcessed={handleMarkProcessed}
              onDownload={handleDownload}
            />
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6">
              <PaginationWrapper
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Photo Detail Modal */}
          <PhotoDetail
            isOpen={isDetailOpen}
            onClose={handleDetailClose}
            photo={selectedPhoto}
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  );
}

export default PhotosPage;
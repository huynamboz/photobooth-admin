import { useState, useEffect, useCallback } from 'react';
import Layout from "../components/Layout";
import PhotoboothCard from "../components/photobooth/PhotoboothCard";
import PhotoboothForm from "../components/photobooth/PhotoboothForm";
import PhotoboothFiltersComponent from "../components/photobooth/PhotoboothFilters";
import PaginationWrapper from "../components/PaginationWrapper";
import { usePhotoboothStore } from "@/stores/photoboothStore";
import { type Photobooth, type CreatePhotoboothRequest, type UpdatePhotoboothRequest } from "@/types/photobooth";
import { Button } from "@/components/ui/button";
import { Plus, Monitor } from "lucide-react";
import { toast } from "sonner";

function PhotoboothsPage() {
  const {
    photobooths,
    pagination,
    loading,
    error,
    filters,
    fetchPhotobooths,
    createPhotobooth,
    updatePhotobooth,
    deletePhotobooth,
    setFilters,
    clearFilters,
    clearError
  } = usePhotoboothStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPhotobooth, setEditingPhotobooth] = useState<Photobooth | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const loadPhotobooths = useCallback(async () => {
    try {
      await fetchPhotobooths({
        page: currentPage,
        limit: pageSize,
        ...filters
      });
    } catch (error) {
      console.error('Failed to load photobooths:', error);
    }
  }, [fetchPhotobooths, currentPage, pageSize, filters]);

  useEffect(() => {
    loadPhotobooths();
  }, [loadPhotobooths]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleCreatePhotobooth = async (data: CreatePhotoboothRequest) => {
    try {
      await createPhotobooth(data);
      toast.success('Photobooth created successfully');
      setIsFormOpen(false);
      loadPhotobooths();
    } catch {
      toast.error('Failed to create photobooth');
    }
  };

  const handleEditPhotobooth = async (data: UpdatePhotoboothRequest) => {
    if (!editingPhotobooth) return;
    
    try {
      await updatePhotobooth(editingPhotobooth.id, data);
      toast.success('Photobooth updated successfully');
      setIsFormOpen(false);
      setEditingPhotobooth(null);
      loadPhotobooths();
    } catch {
      toast.error('Failed to update photobooth');
    }
  };

  const handleDeletePhotobooth = async (id: string) => {
    try {
      await deletePhotobooth(id);
      toast.success('Photobooth deleted successfully');
      loadPhotobooths();
    } catch {
      toast.error('Failed to delete photobooth');
    }
  };


  const handleViewDetails = (photobooth: Photobooth) => {
    // TODO: Implement view details modal or navigate to details page
    toast.info(`View details for ${photobooth.name}`);
  };

  const handleEdit = (photobooth: Photobooth) => {
    setEditingPhotobooth(photobooth);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingPhotobooth(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPhotobooth(null);
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Photobooth Management
                </h1>
                <p className="text-gray-600">
                  Manage your photobooth devices and their status.
                </p>
              </div>
              <Button onClick={handleCreate} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Photobooth
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <PhotoboothFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Stats */}
          {pagination && (
            <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing {photobooths.length} of {pagination.total} photobooths
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Available: {photobooths.filter(p => p.status === 'available').length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Busy: {photobooths.filter(p => p.status === 'busy').length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Maintenance: {photobooths.filter(p => p.status === 'maintenance').length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Offline: {photobooths.filter(p => p.status === 'offline').length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Photobooth Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : photobooths.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photobooths found</h3>
              <p className="text-gray-500 mb-4">
                {Object.values(filters).some(v => v) 
                  ? "Try adjusting your filters to see more results."
                  : "Get started by creating your first photobooth."
                }
              </p>
              {!Object.values(filters).some(v => v) && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Photobooth
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {photobooths.map((photobooth) => (
                    <PhotoboothCard
                      key={photobooth.id}
                      photobooth={photobooth}
                      onEdit={handleEdit}
                      onDelete={handleDeletePhotobooth}
                      onViewDetails={handleViewDetails}
                    />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <PaginationWrapper
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}

          {/* Form Modal */}
          <PhotoboothForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSubmit={editingPhotobooth ? handleEditPhotobooth : (data) => handleCreatePhotobooth(data as CreatePhotoboothRequest)}
            photobooth={editingPhotobooth}
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  );
}

export default PhotoboothsPage;

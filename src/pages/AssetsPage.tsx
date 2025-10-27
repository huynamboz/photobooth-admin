import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAssetStore } from "@/stores/assetStore";
import { type Asset, AssetType, type UploadAssetRequest, type GetAssetsParams } from "@/types/asset";
import Layout from "../components/Layout";
import AssetUpload from "../components/AssetUpload";
import PaginationWrapper from "../components/PaginationWrapper";
import { 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Search, 
  Filter,
  Image as ImageIcon,
  Frame,
  Palette,
  Sticker
} from "lucide-react";
import { toast } from "sonner";

function AssetsPage() {
  const {
    assets,
    pagination,
    loading,
    error,
    filters,
    fetchAssets,
    uploadAsset,
    deleteAsset,
    setFilters,
    clearFilters,
    clearError
  } = useAssetStore();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);


  const loadAssets = useCallback(async () => {
    const params: GetAssetsParams = {
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      type: filters.type,
    };
    await fetchAssets(params);
  }, [currentPage, pageSize, searchTerm, filters.type, fetchAssets]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUploadAsset = async (uploadData: UploadAssetRequest) => {
    await uploadAsset(uploadData);
    setIsUploadOpen(false);
    loadAssets(); // Refresh the list
  };

  const handleDeleteAsset = async () => {
    if (selectedAsset) {
      await deleteAsset(selectedAsset.id);
      setIsDeleteOpen(false);
      setSelectedAsset(null);
      loadAssets(); // Refresh the list
    }
  };

  const openDeleteDialog = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteOpen(true);
  };

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.FRAME:
        return <Frame className="h-4 w-4" />;
      case AssetType.FILTER:
        return <Palette className="h-4 w-4" />;
      case AssetType.STICKER:
        return <Sticker className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getAssetTypeColor = (type: AssetType) => {
    switch (type) {
      case AssetType.FRAME:
        return 'bg-blue-100 text-blue-800';
      case AssetType.FILTER:
        return 'bg-purple-100 text-purple-800';
      case AssetType.STICKER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Asset Management
            </h1>
            <p className="text-gray-600">
              Manage frames, filters, and stickers for your PhotoBooth.
            </p>
          </div>

          {/* Header with Search, Filter and Upload Button */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter by Type */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {filters.type ? filters.type : 'All Types'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilters({})}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({ type: AssetType.FRAME })}>
                      <Frame className="mr-2 h-4 w-4" />
                      Frames
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({ type: AssetType.FILTER })}>
                      <Palette className="mr-2 h-4 w-4" />
                      Filters
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters({ type: AssetType.STICKER })}>
                      <Sticker className="mr-2 h-4 w-4" />
                      Stickers
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters */}
                {(filters.type || searchTerm) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearFilters();
                      setSearchTerm('');
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>

              <Button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Upload Asset
              </Button>
            </div>
          </div>

          {/* Assets Grid */}
          <div className="bg-white shadow rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading assets...</span>
              </div>
            ) : assets.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {searchTerm || filters.type ? 'No assets found matching your criteria.' : 'No assets yet'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filters.type 
                    ? 'Try adjusting your search or filters.' 
                    : 'Get started by uploading your first asset.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                {assets.map((asset) => (
                  <div key={asset.id} className="group relative bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Asset Image */}
                    <div className="aspect-square relative">
                      <img
                        src={asset.imageUrl}
                        alt={`${asset.type} asset`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Overlay with Actions */}
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(asset)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Asset Info */}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAssetTypeColor(asset.type)}`}>
                          {getAssetIcon(asset.type)}
                          <span className="ml-1 capitalize">{asset.type}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t">
                <PaginationWrapper
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Upload Asset Dialog */}
        <AssetUpload
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={handleUploadAsset}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the asset
                <strong> {selectedAsset?.type}</strong> and remove it from Cloudinary.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAsset}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

export default AssetsPage;

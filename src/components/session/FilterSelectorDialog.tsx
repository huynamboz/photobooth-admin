import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { assetService } from "@/services/assetService";
import { type Asset } from "@/types/asset";
import { type Session } from "@/types/session";
import { AssetType } from "@/types/asset";
import { Search, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface FilterSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFilter?: (filter: Asset) => void;
  session?: Session | null;
}

function FilterSelectorDialog({ isOpen, onClose, onSelectFilter, session }: FilterSelectorDialogProps) {
  const [filters, setFilters] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get filter IDs from session
  const sessionFilterIds = session?.filterIds || [];

  useEffect(() => {
    if (isOpen) {
      loadFilters();
    }
  }, [isOpen]);

  const loadFilters = async () => {
    setLoading(true);
    try {
      const response = await assetService.getAllAssetsAdmin({
        type: AssetType.FILTER,
        page: 1,
        limit: 100, // Load more filters
      });
      setFilters(response.data);
    } catch (error) {
      toast.error('Failed to load filters');
      console.error('Failed to load filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFilters = filters.filter(filter => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      filter.filterType?.toLowerCase().includes(search) ||
      filter.imageUrl.toLowerCase().includes(search)
    );
  });

  const handleToggleFilter = (filter: Asset) => {
    if (onSelectFilter) {
      onSelectFilter(filter);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Select Filter</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search filters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading filters...</span>
            </div>
          ) : filteredFilters.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No filters found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFilters.map((filter) => {
                const isInSessionFilters = sessionFilterIds.includes(filter.id);
                
                return (
                  <div
                    key={filter.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      isInSessionFilters
                        ? 'border-green-500 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleToggleFilter(filter)}
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={filter.imageUrl}
                        alt={filter.filterType || 'Filter'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 transition-all ${
                      isInSessionFilters
                        ? 'bg-green-500/20'
                        : 'bg-black/0 group-hover:bg-black/10'
                    }`} />

                    {/* Status Indicators */}
                    <div className="absolute top-2 right-2">
                      {isInSessionFilters && (
                        <div className="bg-green-500 text-white rounded-full p-1" title="Filter in Session">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {/* Filter Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <div className="flex items-center justify-between">
                        {filter.filterType && (
                          <Badge variant="secondary" className="text-xs">
                            {filter.filterType}
                          </Badge>
                        )}
                        {isInSessionFilters && (
                          <Badge className="bg-green-500 text-white text-xs">
                            Added
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FilterSelectorDialog;


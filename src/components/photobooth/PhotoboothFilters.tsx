import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type PhotoboothStatus, type PhotoboothFilters } from "@/types/photobooth";
import { Search, Filter, X } from "lucide-react";

interface PhotoboothFiltersProps {
  filters: PhotoboothFilters;
  onFiltersChange: (filters: Partial<PhotoboothFilters>) => void;
  onClearFilters: () => void;
}

function PhotoboothFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: PhotoboothFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search photobooths..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.status || ''}
            onValueChange={(value) => onFiltersChange({ 
              status: value === 'all' ? undefined : value as PhotoboothStatus 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="w-full sm:w-48">
          <Input
            placeholder="Filter by location..."
            value={filters.location || ''}
            onChange={(e) => onFiltersChange({ location: e.target.value })}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Search: {filters.search}
              <button
                onClick={() => onFiltersChange({ search: undefined })}
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Status: {filters.status}
              <button
                onClick={() => onFiltersChange({ status: undefined })}
                className="ml-1 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Location: {filters.location}
              <button
                onClick={() => onFiltersChange({ location: undefined })}
                className="ml-1 hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default PhotoboothFiltersComponent;

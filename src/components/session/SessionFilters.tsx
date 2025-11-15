import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type SessionStatus, type SessionFilters } from "@/types/session";
import { Search, X, Calendar } from "lucide-react";

interface SessionFiltersProps {
  filters: SessionFilters;
  onFiltersChange: (filters: Partial<SessionFilters>) => void;
  onClearFilters: () => void;
  photobooths: Array<{ id: string; name: string; location?: string }>;
}

function SessionFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  photobooths 
}: SessionFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sessions..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <Select
            value={filters.status || ''}
            onValueChange={(value) => onFiltersChange({ 
              status: value === 'all' ? undefined : value as SessionStatus 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Photobooth Filter */}
        <div className="w-full lg:w-48">
          <Select
            value={filters.photoboothId || ''}
            onValueChange={(value) => onFiltersChange({ 
              photoboothId: value === 'all' ? undefined : value 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Photobooths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Photobooths</SelectItem>
              {photobooths.map((photobooth) => (
                <SelectItem key={photobooth.id} value={photobooth.id}>
                  {photobooth.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Filter */}
        <div className="w-full lg:w-48">
          <Input
            placeholder="Filter by user ID..."
            value={filters.userId || ''}
            onChange={(e) => onFiltersChange({ userId: e.target.value })}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full lg:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Date Range Filters */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom || ''}
              onChange={(e) => onFiltersChange({ dateFrom: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="date"
              placeholder="To date"
              value={filters.dateTo || ''}
              onChange={(e) => onFiltersChange({ dateTo: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
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
          {filters.photoboothId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Photobooth: {photobooths.find(p => p.id === filters.photoboothId)?.name || filters.photoboothId}
              <button
                onClick={() => onFiltersChange({ photoboothId: undefined })}
                className="ml-1 hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.userId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
              User: {filters.userId}
              <button
                onClick={() => onFiltersChange({ userId: undefined })}
                className="ml-1 hover:text-orange-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.dateFrom && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
              From: {filters.dateFrom}
              <button
                onClick={() => onFiltersChange({ dateFrom: undefined })}
                className="ml-1 hover:text-indigo-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.dateTo && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
              To: {filters.dateTo}
              <button
                onClick={() => onFiltersChange({ dateTo: undefined })}
                className="ml-1 hover:text-indigo-600"
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

export default SessionFiltersComponent;

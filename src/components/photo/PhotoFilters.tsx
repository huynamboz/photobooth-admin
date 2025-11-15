import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Filter, 
  X,
  Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";

interface PhotoFiltersProps {
  filters: {
    sessionId?: string;
    isProcessed?: boolean;
    dateFrom?: string;
    dateTo?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

function PhotoFilters({ filters, onFiltersChange, onClearFilters }: PhotoFiltersProps) {
  const [sessionId, setSessionId] = useState(filters.sessionId || '');
  const [isProcessed, setIsProcessed] = useState<string>(
    filters.isProcessed !== undefined ? filters.isProcessed.toString() : 'all'
  );
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  const handleApplyFilters = () => {
    const newFilters: any = {};
    
    if (sessionId.trim()) {
      newFilters.sessionId = sessionId.trim();
    }
    
    if (isProcessed !== 'all') {
      newFilters.isProcessed = isProcessed === 'true';
    }
    
    if (dateFrom) {
      newFilters.dateFrom = dateFrom.toISOString();
    }
    
    if (dateTo) {
      newFilters.dateTo = dateTo.toISOString();
    }
    
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setSessionId('');
    setIsProcessed('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    onClearFilters();
  };

  const hasActiveFilters = sessionId || isProcessed !== 'all' || dateFrom || dateTo;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Session ID Filter */}
        <div className="flex-1 min-w-0">
          <Label htmlFor="sessionId" className="text-sm font-medium text-gray-700">
            Session ID
          </Label>
          <Input
            id="sessionId"
            placeholder="Enter session ID..."
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Processed Status Filter */}
        <div className="flex-1 min-w-0">
          <Label className="text-sm font-medium text-gray-700">Status</Label>
          <Select value={isProcessed} onValueChange={setIsProcessed}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Processed</SelectItem>
              <SelectItem value="false">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From Filter */}
        <div className="flex-1 min-w-0">
          <Label className="text-sm font-medium text-gray-700">From Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-1 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To Filter */}
        <div className="flex-1 min-w-0">
          <Label className="text-sm font-medium text-gray-700">To Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-1 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhotoFilters;

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { type PaginationMeta } from "@/types/pagination";

interface PaginationWrapperProps {
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  className?: string;
}

function PaginationWrapper({ pagination, onPageChange, className = "" }: PaginationWrapperProps) {
  if (!pagination) return null;

  const { page, totalPages, hasNext, hasPrev } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (page > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (page < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Showing page {page} of {totalPages} ({pagination.total} total items)
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasPrev) onPageChange(page - 1);
              }}
              className={!hasPrev ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {pageNumbers.map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(pageNum as number);
                  }}
                  isActive={pageNum === page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasNext) onPageChange(page + 1);
              }}
              className={!hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default PaginationWrapper;

"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ProductListPaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
}

export function ProductListPagination({
    pagination,
    onPageChange,
}: ProductListPaginationProps) {
    const { page, totalPages } = pagination;

    if (totalPages <= 1) return null;

    // Generate page numbers to show
    const getVisiblePages = () => {
        const pages: number[] = [];
        const showPages = 5; // Show max 5 page numbers
        
        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            // Show pages around current page
            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Page {page} sur {totalPages} ({pagination.total} produits)
            </div>
            
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                        />
                    </PaginationItem>
                    
                    {visiblePages.map((pageNum, index) => {
                        // Check if we need ellipsis
                        if (index > 0 && pageNum - visiblePages[index - 1] > 1) {
                            return (
                                <PaginationItem key={`ellipsis-${pageNum}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }
                        
                        return (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    onClick={() => onPageChange(pageNum)}
                                    isActive={pageNum === page}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                    
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

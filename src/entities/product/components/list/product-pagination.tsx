
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PaginationInfo } from '../../types/product.types';

interface ProductPaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    className?: string;
}

export function ProductPagination({ pagination, onPageChange, className }: ProductPaginationProps) {
    const { page, totalPages } = pagination;

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Smart pagination with ellipsis
            if (page <= 3) {
                // Near the beginning
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (page >= totalPages - 2) {
                // Near the end
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                // In the middle
                pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = getPageNumbers();

    return (
        <Pagination className={className}>
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        aria-label="Page précédente"
                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Précédent</span>
                    </PaginationPrevious>
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((pageNum, index) => (
                    <PaginationItem key={index}>
                        {pageNum === '...' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                onClick={() => onPageChange(pageNum as number)}
                                isActive={page === pageNum}
                                aria-label={`Aller à la page ${pageNum} `}
                            >
                                {pageNum}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        aria-label="Page suivante"
                        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    >
                        <span className="hidden sm:inline">Suivant</span>
                        <ChevronRight className="h-4 w-4" />
                    </PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

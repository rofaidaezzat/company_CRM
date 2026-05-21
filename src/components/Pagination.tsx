import chevronLeft from '../assets/chevron-left.svg';
import chevronRight from '../assets/chevron-right.svg';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Build page list: always show 1, last, current±1, with ellipsis
  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const delta = 1;
    const range: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    pages.push(1);

    if (range[0] > 2) pages.push('...');
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  // Shared font style
  const fontStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    fontWeight: 400,
    lineHeight: '140%',
    letterSpacing: 0,
    color: '#4B5563',
  };

  // Shared button base
  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    border: '1px solid rgba(212, 213, 216, 1)',
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    paddingLeft: 16,
    gap: 8,
    height: 32,
    background: 'transparent',
    cursor: 'pointer',
    boxSizing: 'border-box',
    ...fontStyle,
  };

  return (
    <div
      style={{
        height: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* ── Previous ── */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{
          ...btnBase,
          width: 125,
          opacity: currentPage === 1 ? 0.45 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <img src={chevronLeft} alt="prev" width={20} height={20} style={{ opacity: 1 }} />
        Previous
      </button>
      {/* ── Page numbers ── */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            style={{
              ...fontStyle,
              width: 40,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
            }}
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            style={{
              ...btnBase,
              width: 40,
              paddingRight: 16,
              paddingLeft: 16,
              border:
                currentPage === page
                  ? '1px solid rgba(0, 35, 111, 1)'
                  : '1px solid rgba(212, 213, 216, 1)',
              color: currentPage === page ? 'rgba(0, 35, 111, 1)' : '#4B5563',
              fontWeight: currentPage === page ? 600 : 400,
            }}
          >
            {page}
          </button>
        )
      )}

      {/* ── Next ── */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{
          ...btnBase,
          width: 96,
          opacity: currentPage === totalPages ? 0.45 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        Next
        <img src={chevronRight} alt="next" width={20} height={20} style={{ opacity: 1 }} />
      </button>
    </div>
  );
};

export default Pagination;

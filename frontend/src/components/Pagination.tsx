interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages < 2) return null;

  return (
    <nav className="pagination" aria-label="Pagination du catalogue">
      <button
        className="pagination__button"
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <span aria-hidden="true">←</span>
        <span>Précédent</span>
      </button>
      <span className="pagination__current" aria-live="polite">
        <strong>{String(page).padStart(2, '0')}</strong>
        <span>/</span>
        {String(totalPages).padStart(2, '0')}
      </span>
      <button
        className="pagination__button pagination__button--next"
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <span>Suivant</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}

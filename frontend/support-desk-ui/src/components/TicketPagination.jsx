const SORT_FIELDS = ['createdAt', 'priority', 'status', 'title'];
const PAGE_SIZES = [5, 10, 20];

export default function TicketPagination({
  pageInfo,
  cacheMessage,
  onRefresh,
  onNext,
  onPrevious,
  onPageSizeChange,
  onSortByChange,
  onSortDirectionChange
}) {
  const { page, size, sortBy, direction, totalPages, totalElements } = pageInfo;

  const isFirstPage = page <= 0;
  const isLastPage = page + 1 >= totalPages;

  const isFromCache = cacheMessage === 'Loaded from cache';

  return (
    <section className="pagination-bar" aria-label="Pagination and sorting">
      <div className="pagination-sort">
        <label>
          Sort by
          <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
            {SORT_FIELDS.map((field) => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </label>

        <label>
          Direction
          <select value={direction} onChange={(event) => onSortDirectionChange(event.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <label>
          Page size
          <select value={size} onChange={(event) => onPageSizeChange(event.target.value)}>
            {PAGE_SIZES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="pagination-nav">
        <span className={isFromCache ? 'cache-tag cache-hit' : 'cache-tag'}>{cacheMessage}</span>
        <button type="button" className="button-link secondary" onClick={onRefresh}>
          Refresh
        </button>
        <button type="button" className="button-link secondary" onClick={onPrevious} disabled={isFirstPage}>
          Previous
        </button>
        <span className="pagination-status">
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages} · {totalElements} total
        </span>
        <button type="button" className="button-link" onClick={onNext} disabled={isLastPage}>
          Next
        </button>
      </div>
    </section>
  );
}

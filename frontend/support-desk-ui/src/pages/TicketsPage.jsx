import { useEffect } from 'react';
import { Link } from 'react-router';
import TicketList from '../components/TicketList.jsx';
import TicketDetail from '../components/TicketDetail.jsx';
import TicketFilterPanel from '../components/TicketFilterPanel.jsx';
import TicketPagination from '../components/TicketPagination.jsx';
import TicketSummaryCards from '../components/TicketSummaryCards.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingMessage from '../components/LoadingMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTicketData } from '../context/TicketDataContext.jsx';

export default function TicketsPage() {
  const { user } = useAuth();

  const {
    tickets,
    visibleTickets,
    selectedTicket,
    loading,
    error,
    pageInfo,
    cacheMessage,
    filters,
    loadTicketsPage,
    refreshTickets,
    goToNextPage,
    goToPreviousPage,
    setPageSize,
    setSortBy,
    setSortDirection,
    setSearchText,
    setStatusFilter,
    setPriorityFilter,
    selectTicket
  } = useTicketData();

  // Load the first page when the page mounts.
  useEffect(() => {
    loadTicketsPage();
  }, [loadTicketsPage]);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <section className="card welcome-card">
        <div>
          <p className="eyebrow">Ticket data</p>
          <h2>Tickets</h2>
          <p>Paged and sorted by the backend, then filtered client-side.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="action-row">
            <Link className="button-link" to="/app/tickets/new">Create Ticket</Link>
            {selectedTicket && (
              <Link className="button-link secondary" to={`/app/tickets/${selectedTicket.id}/edit`}>
                Edit Selected
              </Link>
            )}
          </div>
        )}
      </section>

      <TicketSummaryCards tickets={tickets} />

      <TicketPagination
        pageInfo={pageInfo}
        cacheMessage={cacheMessage}
        onRefresh={refreshTickets}
        onNext={goToNextPage}
        onPrevious={goToPreviousPage}
        onPageSizeChange={setPageSize}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <TicketFilterPanel
        searchText={filters.searchText}
        statusFilter={filters.statusFilter}
        priorityFilter={filters.priorityFilter}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      {loading ? (
        <LoadingMessage message="Loading tickets..." />
      ) : (
        <section className="ticket-board">
          <TicketList
            tickets={visibleTickets}
            selectedId={selectedTicket?.id ?? null}
            onSelect={selectTicket}
          />
          <TicketDetail ticket={selectedTicket} />
        </section>
      )}
    </>
  );
}

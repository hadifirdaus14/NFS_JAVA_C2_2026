import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import TicketList from '../components/TicketList.jsx';
import TicketDetail from '../components/TicketDetail.jsx';
import TicketFilterPanel from '../components/TicketFilterPanel.jsx';
import TicketSummaryCards from '../components/TicketSummaryCards.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingMessage from '../components/LoadingMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchTickets } from '../services/api.js';

export default function TicketsPage() {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load tickets from the backend once we have a token
  useEffect(() => {
    let ignore = false;

    async function loadTickets() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchTickets(token);

        if (!ignore) {
          setTickets(data);
          setSelectedId(data[0]?.id ?? null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Could not load tickets.');
          console.error(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      ignore = true;
    };
  }, [token]);

  const filteredTickets = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !search ||
        ticket.title.toLowerCase().includes(search) ||
        ticket.category.toLowerCase().includes(search) ||
        ticket.createdBy.toLowerCase().includes(search);

      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchText, statusFilter, priorityFilter]);

  // Keep the selection valid when the filtered list changes
  useEffect(() => {
    if (filteredTickets.length === 0) {
      setSelectedId(null);
      return;
    }

    const selectedStillVisible = filteredTickets.some((ticket) => ticket.id === selectedId);

    if (!selectedStillVisible) {
      setSelectedId(filteredTickets[0].id);
    }
  }, [filteredTickets, selectedId]);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) ?? null;

  if (loading) {
    return <LoadingMessage message="Loading tickets..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <section className="card welcome-card">
        <div>
          <p className="eyebrow">Sample ticket data</p>
          <h2>Tickets</h2>
          <p>Browsing local sample data, then use the Day 13 form wizard to create or update tickets.</p>
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

      <TicketFilterPanel
        searchText={searchText}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <section className="ticket-board">
        <TicketList
          tickets={filteredTickets}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <TicketDetail ticket={selectedTicket} />
      </section>
    </>
  );
}

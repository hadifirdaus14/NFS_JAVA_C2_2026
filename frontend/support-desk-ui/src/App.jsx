import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import TicketList from "./components/TicketList";
import TicketDetail from "./components/TicketDetail";
import { sampleTickets } from "./data/sampleTickets";
import TicketFilter from "./components/TicketFilter";
import ApiInfo from "./components/ApiInfo";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const selectedTicket = sampleTickets.find(
    (ticket) => ticket.id === selectedId
  );

  const filteredTickets = sampleTickets.filter((ticket) => {
    const search = searchText.toLowerCase();
    const matchesSearch =
      ticket.title.toLowerCase().includes(search) ||
      ticket.category.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Layout>
      <div className="ticket-page">
        <ApiInfo />
        <TicketFilter
          searchText={searchText}
          onSearchChange={setSearchText}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
        />
        <p className="ticket-count">
          Showing {filteredTickets.length} of {sampleTickets.length} tickets
        </p>
        <div className="ticket-board">
          <TicketList
            tickets={filteredTickets}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <TicketDetail ticket={selectedTicket} />
        </div>
      </div>
    </Layout>
  );
}

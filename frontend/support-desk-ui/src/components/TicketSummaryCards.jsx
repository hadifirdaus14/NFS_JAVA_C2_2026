import { countByStatus } from "../utils/tickets.js";

export default function TicketSummaryCards({ tickets }) {
    const total = tickets.length;
    const open = countByStatus(tickets, 'OPEN');
    const inProgress = countByStatus(tickets, 'IN_PROGRESS');
    const closed = countByStatus(tickets, 'CLOSED');

    return (
        <section className="api-info-grid" aria-label="Ticket summary">
            <SummaryCards label="Total Tickets" value={total} />
            <SummaryCards label="OPEN" value={open} />
            <SummaryCards label="IN_PROGRESS" value={inProgress} />
            <SummaryCards label="CLOSED" value={closed} />
        </section>
    );
}

function SummaryCards({ label, value }) {
    return (
        <article className="summary-card">
            <p>{label}</p>
            <strong>{value}</strong>
        </article>
    );
}

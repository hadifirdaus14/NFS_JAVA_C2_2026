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
        // aria-label names the card so a test can ask for "the OPEN card" and read
        // the number inside it, instead of searching the whole summary for a digit.
        <article className="summary-card" aria-label={label}>
            <p>{label}</p>
            <strong>{value}</strong>
        </article>
    );
}

// Small summary row showing the total and a count per status.
const STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export default function TicketSummaryCards({ tickets }) {
    const total = tickets.length;
    const countFor = (status) => tickets.filter((ticket) => ticket.status === status).length;

    return (
        <section className="api-info-grid" aria-label="Ticket summary">
            <div className="info-item">
                <span>Total</span>
                <strong>{total}</strong>
            </div>

            {STATUSES.map((status) => (
                <div key={status} className="info-item">
                    <span>{status.replace('_', ' ')}</span>
                    <strong>{countFor(status)}</strong>
                </div>
            ))}
        </section>
    );
}

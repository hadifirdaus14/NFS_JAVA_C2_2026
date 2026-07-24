import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

export default function TicketDetail({ ticket }) {
    if (!ticket) {
        return (
            <section className="ticket-detail empty">
                <p>Select a ticket to see its details.</p>
            </section>
        );
    }

    return (
        <section className="ticket-detail">
            <h2>{ticket.title}</h2>

            <div className="ticket-detail-badges">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
            </div>

            <dl className="ticket-detail-meta">
                <div>
                    <dt>Category</dt>
                    <dd>{ticket.category}</dd>
                </div>
                <div>
                    <dt>Created by</dt>
                    <dd>{ticket.createdBy}</dd>
                </div>
                <div>
                    <dt>Created at</dt>
                    <dd>{ticket.createdAt}</dd>
                </div>
                <div>
                    <dt>Ticket ID</dt>
                    <dd>{ticket.id}</dd>
                </div>
            </dl>
        </section>
    );
}

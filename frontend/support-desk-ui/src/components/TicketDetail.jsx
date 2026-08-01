import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export default function TicketDetail({ ticket, onStatusChange, updating = false }) {
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

            {onStatusChange && (
                <div className="status-actions">
                    <span className="status-actions-label">
                        Set status{updating ? ' (saving…)' : ''}:
                    </span>
                    {STATUS_OPTIONS.map((status) => (
                        <button
                            key={status}
                            type="button"
                            className={status === ticket.status ? 'button-link' : 'button-link secondary'}
                            disabled={updating || status === ticket.status}
                            onClick={() => onStatusChange(ticket.id, status)}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            )}

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

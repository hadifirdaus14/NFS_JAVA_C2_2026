import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

export default function TicketList({ tickets, selectedId, onSelect }) {
    return (
        <ul className="ticket-list">
            {tickets.map((ticket) => {
                const isSelected = ticket.id === selectedId;

                return (
                    <li key={ticket.id}>
                        <button
                            type="button"
                            className={isSelected ? "ticket-item selected" : "ticket-item"}
                            onClick={() => onSelect(ticket.id)}
                        >
                            <span className="ticket-item-title">{ticket.title}</span>
                            <span className="ticket-item-badges">
                                <PriorityBadge priority={ticket.priority} />
                                <StatusBadge status={ticket.status} />
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

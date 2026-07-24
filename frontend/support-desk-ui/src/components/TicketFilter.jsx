export default function TicketFilter({
    searchText,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
}) {
    return (
        <div className="ticket-filter">
            <input
                type="search"
                className="filter-input"
                placeholder="Search by title or category"
                value={searchText}
                onChange={(event) => onSearchChange(event.target.value)}
            />

            <select
                className="filter-select"
                value={statusFilter}
                onChange={(event) => onStatusChange(event.target.value)}
            >
                <option value="ALL">All statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
            </select>

            <select
                className="filter-select"
                value={priorityFilter}
                onChange={(event) => onPriorityChange(event.target.value)}
            >
                <option value="ALL">All priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
            </select>
        </div>
    );
}

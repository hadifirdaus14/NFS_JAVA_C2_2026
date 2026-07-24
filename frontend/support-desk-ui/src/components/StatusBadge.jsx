export default function StatusBadge({ status }) {
    const className = `badge status-${status.toLowerCase()}`;
    const label = status.replace('_', ' ');

    return <span className={className}>{label}</span>;
}

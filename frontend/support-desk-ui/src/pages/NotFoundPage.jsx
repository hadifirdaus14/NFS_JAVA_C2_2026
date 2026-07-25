import { Link } from "react-router";

export default function NotFoundPage() {
    return (
        <div className="page">
            <h1>404 — Page Not Found</h1>
            <p>
                That route doesn't exist. <Link to="/app/dashboard">Go to dashboard</Link>
            </p>
        </div>
    );
}

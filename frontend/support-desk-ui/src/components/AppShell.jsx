import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function AppShell() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }
    
    return (
        <div className="app-shell">
            <header className="app-header">
                <div>
                    <p className="eyebrow">Day 12 Routing & Protected Views</p>
                    <h1>Support Desk UI</h1>
                    <p className="header-subtitle">
                        Nested routes, guarded pages, login redirect flow and protected backend data.
                    </p>
                </div>
                <div className="user-panel">
                    <span>{user?.name}</span>
                    <strong>{user?.role}</strong>
                    <button type="button" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <nav className="app-nav">
                <NavLink to="/app/dashboard">Dashboard</NavLink>
                <NavLink to="/app/tickets">Tickets</NavLink>
                <NavLink to="/app/reports">Reports</NavLink>
                <NavLink to="/docs">API Docs</NavLink>
            </nav>
            

            {/* Nested routes (dashboard, tickets, reports) render here */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}

import { NavLink, Outlet } from "react-router";

export default function AppShell() {
    return (
        <div className="app-shell">
            
            <h1>Support Desk</h1>
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

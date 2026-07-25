import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate("/app/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">Day 12</p>
        <h1>Login to Asset Tracker</h1>
        <p>
          This login calls our Day 9 backend, stores the JWT in localStorage for this demo
          and redirects the user to the protected area of our application.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <ErrorMessage message={error} />}
          {loading && <LoadingMessage message="Logging in..." />}

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div className="login-help">
          <strong>Seeded admin</strong>
          <span>email: admin@example.com</span>
          <span>password: Admin@12345</span>
        </div>
      </section>
    </main>
    );
}

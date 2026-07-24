import { useEffect, useState } from "react";
import { fetchApiInfo } from "../services/api";

export default function ApiInfo() {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApiInfo()
            .then((data) => {
                setInfo(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setInfo(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="api-info loading">Loading API info…</div>;
    }

    if (error) {
        return (
            <div className="api-info error">
                ⚠ {error}. Is the backend running?
            </div>
        );
    }

    return (
        <div className="api-info success">
            Connected to <strong>{info.application}</strong> ({info.version}) —{" "}
            {info.status}
        </div>
    );
}

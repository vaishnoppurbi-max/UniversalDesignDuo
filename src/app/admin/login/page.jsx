"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="admin admin-login-wrap">
      <div className="admin-login-card">
        <img src="/assets/img/logo/logo-dark.png" alt="Universal Design Duo" />
        <h1>Admin Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
  );
}

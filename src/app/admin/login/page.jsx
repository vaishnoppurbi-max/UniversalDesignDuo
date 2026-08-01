"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import "../admin.css";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function AdminLoginPage() {
  const router = useRouter();
  const googleBtnRef = useRef(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gisReady, setGisReady] = useState(false);

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

  async function handleGoogleCredential(response) {
    setError("");
    const res = await fetch("/api/admin/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Google sign-in failed");
    }
  }

  useEffect(() => {
    if (!gisReady || !GOOGLE_CLIENT_ID || !window.google || !googleBtnRef.current) {
      return;
    }
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: 296,
      text: "signin_with",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gisReady]);

  return (
    <div className="admin admin-login-wrap">
      {GOOGLE_CLIENT_ID && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => setGisReady(true)}
        />
      )}
      <div className="admin-login-card">
        <img src="/assets/img/logo/logo-dark.png" alt="Universal Design Duo" />
        <h1>Admin Sign In</h1>

        {GOOGLE_CLIENT_ID && (
          <>
            <div ref={googleBtnRef} className="google-btn-slot" />
            <div className="login-divider">
              <span>or use password</span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
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

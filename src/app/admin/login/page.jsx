"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const googleBtnRef = useRef(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [googleClientId, setGoogleClientId] = useState("");
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg.googleSignInEnabled && cfg.googleClientId) {
          setGoogleClientId(cfg.googleClientId);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-login on localhost: if already signed in, go to /admin; otherwise
  // silently obtain a dev session so you don't have to type the password.
  useEffect(() => {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const isLocal = host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
    if (!isLocal) return;

    let cancelled = false;
    (async () => {
      setAutoLoggingIn(true);
      try {
        const meRes = await fetch("/api/admin/me");
        if (cancelled) return;
        if (meRes.ok) {
          router.push("/admin");
          router.refresh();
          return;
        }
        const res = await fetch("/api/admin/auto-login", { method: "POST" });
        if (cancelled) return;
        if (res.ok) {
          router.push("/admin");
          router.refresh();
          return;
        }
      } catch {
        /* ignore — fall back to manual login */
      } finally {
        if (!cancelled) setAutoLoggingIn(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

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
    if (!gisReady || !googleClientId || !window.google || !googleBtnRef.current) {
      return;
    }
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: 296,
      text: "signin_with",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gisReady, googleClientId]);

  return (
    <div className="admin admin-login-wrap">
      {googleClientId && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => setGisReady(true)}
        />
      )}
      <div className="admin-login-card">
        <img src="/assets/img/logo/logo-dark.png" alt="Universal Design Duo" />
        <h1>Admin Sign In</h1>

        {autoLoggingIn && (
          <p className="auto-login-msg">Signing you in automatically…</p>
        )}

        {googleClientId && (
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

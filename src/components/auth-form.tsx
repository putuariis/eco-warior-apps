"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Something went wrong");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="auth-page">
      <div className="container">
        <div className="card auth-card">
          <a className="brand" href="/" style={{ marginBottom: 22 }}>
            <span className="brand-mark">
              <Leaf size={20} />
            </span>
            <span>ECO-WARRIOR</span>
          </a>

          <div className="eyebrow">{isSignUp ? "JOIN THE WAR" : "WELCOME BACK"}</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", margin: "6px 0 4px" }}>
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h1>
          <p className="muted" style={{ marginBottom: 20 }}>
            {isSignUp
              ? "Start logging real-world climate actions and earn Eco-Tokens."
              : "Continue your climate impact journey."}
          </p>

          <form onSubmit={handleSubmit} className="grid form auth-form">
            {isSignUp && (
              <div className="field full">
                <label htmlFor="name">Display name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Putu"
                />
              </div>
            )}
            <div className="field full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="field full">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="field full">
                <div className="notice" style={{ borderColor: "var(--like)", color: "var(--like)", background: "#fff0f1" }} role="alert">
                  {error}
                </div>
              </div>
            )}

            <div className="field full">
              <button className="btn primary" type="submit" disabled={loading} style={{ width: "100%" }}>
                {loading ? "PLEASE WAIT…" : isSignUp ? "CREATE ACCOUNT →" : "SIGN IN →"}
              </button>
            </div>
          </form>

          <p className="muted" style={{ textAlign: "center", marginTop: 18, fontSize: 13 }}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Link href={isSignUp ? "/sign-in" : "/sign-up"} style={{ color: "var(--primary)", fontWeight: 700 }}>
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

function LoginForm({ onShowRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Invalid email or password");
        setLoading(false);
        return;
      }

      const data = await response.json(); // { token, userId, name, email, role }

      const authData = {
        token: data.token,
        role: data.role,
        userId: data.userId,
        name: data.name,
        email: data.email,
      };

      localStorage.setItem("insurai_auth", data.token);
      localStorage.setItem("insurai_user", JSON.stringify(authData));

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(authData);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageRoot}>
      <div style={styles.centerShell}>
        <div style={styles.glowCircle} />

        <div style={styles.card}>
          <h1 style={styles.title}>Sign In</h1>
          <p style={styles.subtitle}>
            Don’t have an account yet?{" "}
            <button
              type="button"
              onClick={onShowRegister}
              style={styles.linkButton}
            >
              Sign up
            </button>
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              <span style={styles.labelText}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>Password</span>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ ...styles.input, ...styles.passwordInput }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={styles.eyeButton}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4b5563"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.primaryButton,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div style={styles.dividerRow}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={styles.googleButton}
          >
            <FcGoogle size={20} style={{ marginRight: 8 }} />
            Google
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageRoot: {
    minHeight: "100vh",
    margin: 0,
    background:
      "radial-gradient(circle at top, #1f2937 0, #020617 55%, #000000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#f9fafb",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  centerShell: {
    position: "relative",
    width: "100%",
    maxWidth: 520,
    padding: "2rem 1.5rem",
  },
  glowCircle: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 360,
    height: 360,
    borderRadius: "999px",
    background:
      "radial-gradient(circle at center, rgba(59,130,246,0.4), transparent 60%)",
    filter: "blur(4px)",
    opacity: 0.8,
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    padding: "2.4rem 2.2rem 2.3rem",
    borderRadius: 26,
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(3,7,18,0.98))",
    border: "1px solid rgba(148,163,184,0.4)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.85)",
    backdropFilter: "blur(22px)",
    zIndex: 1,
  },
  title: {
    fontSize: "2.1rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textAlign: "center",
    margin: 0,
    marginBottom: "0.4rem",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#9ca3af",
    marginBottom: "1.6rem",
  },
  linkButton: {
    background: "none",
    border: "none",
    padding: 0,
    color: "#60a5fa",
    cursor: "pointer",
    fontWeight: 500,
  },
  error: {
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.6)",
    color: "#fecaca",
    borderRadius: 10,
    padding: "0.7rem 0.9rem",
    fontSize: "0.82rem",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    fontSize: "0.78rem",
  },
  labelText: {
    color: "#9ca3af",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  input: {
    borderRadius: 999,
    border: "1px solid rgba(55,65,81,0.9)",
    padding: "0.7rem 1rem",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    outline: "none",
  },
  primaryButton: {
    marginTop: "0.9rem",
    borderRadius: 999,
    border: "none",
    padding: "0.75rem 1.6rem",
    width: "100%",
    background:
      "linear-gradient(135deg, #3b82f6 0%, #6366f1 35%, #8b5cf6 100%)",
    color: "#f9fafb",
    fontWeight: 600,
    fontSize: "0.95rem",
    letterSpacing: "0.06em",
    boxShadow: "0 0 25px rgba(37,99,235,0.7)",
    transition: "transform 0.12s ease, box-shadow 0.12s ease",
  },
  dividerRow: {
    marginTop: "1.5rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "linear-gradient(to right, transparent, #374151, transparent)",
  },
  dividerText: {
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "0.7rem",
  },
  googleButton: {
    width: "100%",
    padding: "0.65rem 1rem",
    borderRadius: 999,
    border: "1px solid #374151",
    background: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    gap: "0.4rem",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    paddingRight: "2.4rem",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default LoginForm;



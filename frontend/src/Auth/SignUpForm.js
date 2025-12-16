import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoIosContacts } from "react-icons/io";
import { CiPaperplane } from "react-icons/ci";

function SignUpForm({ onSignUp, onShowLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const validatePhone = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      return "Phone number must be exactly 10 digits.";
    }
    return "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setFieldError("");

    const phoneValidationError = validatePhone(phone);
    if (phoneValidationError) {
      setFieldError(phoneValidationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Registration failed");
        setLoading(false);
        return;
      }

      if (typeof onSignUp === "function") {
        onSignUp();
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value) => {
    // allow only digits and spaces for UX, validate on submit
    const cleaned = value.replace(/[^\d\s]/g, "");
    setPhone(cleaned);
    setFieldError("");
  };

  return (
    <div style={s.pageRoot}>
      <div style={s.gridShell}>
        {/* Left info panel */}
        <div style={s.leftPanel}>
          <div style={s.brandRow}>
            <span style={s.brandIcon}>
              <IoIosContacts size={22} />
            </span>
            <span style={s.brandText}>InsurAI</span>
          </div>
          <h2 style={s.leftTitle}>Get started with us</h2>
          <p style={s.leftText}>
            Create your InsurAI account to explore plans, book appointments and
            manage corporate insurance in one modern workspace.
          </p>
        </div>

        {/* Right form card */}
        <div style={s.card}>
          <h1 style={s.title}>Sign Up Account</h1>

          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={handleSignUp} style={s.form}>
            <label style={s.label}>
              <span style={s.labelText}>Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={s.input}
              />
            </label>

            <div style={s.twoCol}>
              <label style={s.label}>
                <span style={s.labelText}>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={s.input}
                />
              </label>

              <label style={s.label}>
                <span style={s.labelText}>Phone</span>
                <input
                  type="tel"
                  placeholder="10 digit number"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  style={{
                    ...s.input,
                    borderColor: fieldError
                      ? "rgba(248,113,113,0.9)"
                      : "rgba(55,65,81,0.9)",
                  }}
                />
                {fieldError && (
                  <span style={s.fieldError}>{fieldError}</span>
                )}
              </label>
            </div>

            <label style={s.label}>
              <span style={s.labelText}>Password</span>
              <div style={s.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ ...s.input, ...s.passwordInput }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={s.eyeButton}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >                  <svg
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
              <span style={s.helper}>Must be at least 8 characters.</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...s.primaryButton,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Creating account..." : "Create account"}
              <CiPaperplane size={18} style={{ marginLeft: 8 }} />
            </button>
          </form>

          <div style={s.dividerRow}>
            <span style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <span style={s.dividerLine} />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={s.googleButton}
          >
            <FcGoogle size={20} style={{ marginRight: 8 }} />
            Google
          </button>

          <p style={s.switchText}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onShowLogin}
              style={s.linkButton}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  pageRoot: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left,#4c1d95 0,#020617 55%,#000000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#f9fafb",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "1.5rem",
  },
  gridShell: {
    width: "100%",
    maxWidth: 1100,
    display: "grid",
    gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1.1fr)",
    borderRadius: 32,
    overflow: "hidden",
    boxShadow: "0 36px 90px rgba(0,0,0,0.9)",
    background:
      "linear-gradient(120deg, rgba(30,64,175,0.3), rgba(15,23,42,1))",
  },
  leftPanel: {
    padding: "3.2rem 3rem",
    background:
      "radial-gradient(circle at top,#7c3aed 0,#4c1d95 35%,#020617 100%)",
    borderRight: "1px solid rgba(148,163,184,0.18)",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "1rem",
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "rgba(15,23,42,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontWeight: 700,
    fontSize: "1.05rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },
  leftTitle: {
    marginTop: "1.5rem",
    fontSize: "1.9rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
  leftText: {
    marginTop: "0.9rem",
    fontSize: "0.92rem",
    color: "#e5e7eb",
    maxWidth: "22rem",
    lineHeight: 1.7,
  },
  card: {
    padding: "2.6rem 2.4rem 2.4rem",
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(3,7,18,1))",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
    marginBottom: "1.4rem",
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
    gap: "1rem",
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
    color: "#c2c6ceff",
    fontSize: "0.9rem",
    outline: "none",
  },
  helper: {
    marginTop: "0.2rem",
    fontSize: "0.78rem",
    color: "#9ca3af",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
    gap: "0.9rem",
  },
  primaryButton: {
    marginTop: "0.6rem",
    borderRadius: 999,
    border: "none",
    padding: "0.8rem 1.6rem",
    width: "100%",
    background:
      "linear-gradient(135deg,#a855f7 0%,#3f4a60ff 100%,#4f6ca7ff 40%)",
    color: "#f9fafb",
    fontWeight: 600,
    fontSize: "0.95rem",
    letterSpacing: "0.06em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 26px rgba(191, 185, 196, 0.8)",
  },
  dividerRow: {
    marginTop: "1.7rem",
    marginBottom: "1.1rem",
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
  switchText: {
    marginTop: "1.2rem",
    fontSize: "0.88rem",
    color: "#9ca3af",
  },
  linkButton: {
    background: "none",
    border: "none",
    padding: 0,
    color: "#60a5fa",
    cursor: "pointer",
    fontWeight: 500,
  },
  fieldError: {
    marginTop: "0.2rem",
    fontSize: "0.78rem",
    color: "#fecaca",
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

export default SignUpForm;




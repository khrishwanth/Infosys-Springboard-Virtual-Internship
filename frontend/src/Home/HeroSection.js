import React from "react";

function HeroSection({
  onLogin,
  onRegister,
  onViewPlans,
  onOpenAssistant,
  onOpenAvailability,
  onOpenScheduling,
  onOpenAppointments,
  onOpenNotifications,
  onOpenProfile,
  onOpenContact,
  onOpenAdmin,
  onGoHome,
  auth
}) {
  const isLoggedIn = !!auth?.token;
  const role = auth?.role;

  const isCustomer = role === "CUSTOMER";
  const isAgent = role === "AGENT";
  const isAdmin = role === "ADMIN";

  return (
    <section style={s.pageRoot}>
      {/* FULL-WIDTH NAVBAR */}
      <div style={s.navShell}>
        <header style={s.navbar}>
          {/* Left: logo + main links */}
          <div style={s.navLeft}>
            <div style={s.logoPill}>
              <div style={s.logoIcon}>🛡️</div>
              <span style={s.logoText}>
                INSU<span style={{ color: "#60a5fa" }}>RAI</span>
              </span>
            </div>

            <nav style={s.linkRow}>
              <button type="button" style={s.navLink} onClick={onGoHome}>
                Home
              </button>
              <button
                type="button"
                style={s.navLink}
                onClick={onViewPlans}
              >
                Plans
              </button>
              <button
                type="button"
                style={s.navLink}
                onClick={onOpenContact}
              >
                Support
              </button>

              {/* My Appointments: common for all logged-in users */}
              {isLoggedIn && (
                <button
                  type="button"
                  style={s.navLink}
                  onClick={onOpenAppointments}
                >
                  My Appointments
                </button>
              )}

              {/* Role-based middle buttons */}
              {isCustomer && (
                <button
                  type="button"
                  style={{ ...s.navLink, ...s.navLinkPrimary }}
                  onClick={onOpenScheduling}
                >
                  Schedule Appointments
                </button>
              )}

              {isAgent && (
                <button
                  type="button"
                  style={{ ...s.navLink, ...s.navLinkPrimary }}
                  onClick={onOpenAvailability}
                >
                  Agent Availability Management
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  style={{ ...s.navLink, ...s.navLinkPrimary }}
                  onClick={onOpenAdmin}
                >
                  Admin
                </button>
              )}
            </nav>
          </div>

          {/* Right: notifications + profile OR auth buttons */}
          <div style={s.navRight}>
            {isLoggedIn && (
              <>
                <button
                  type="button"
                  style={s.iconBadge}
                  onClick={onOpenNotifications}
                  title="Notifications"
                >
                  <span style={s.bellIcon}>🔔</span>
                  <span style={s.badgeDot} />
                </button>

                <button
                  type="button"
                  style={s.profileBadge}
                  onClick={onOpenProfile}
                  title="Account & profile"
                >
                  <span style={s.profileIcon}>👤</span>
                </button>
              </>
            )}
          </div>
        </header>
      </div>

      {/* HERO CONTENT BELOW NAVBAR (can keep existing copy or adjust) */}
      <div style={s.heroContent}>
        <p style={s.kicker}>Corporate insurance · AI powered</p>
        <h1 style={s.heroTitle}>
          Welcome to InsurAI Corporate Insurance
        </h1>
        <p style={s.heroSubtitle}>
          Effortless appointments, powerful agent support, and smart insurance
          workflows—connected through voice, automation and real-time insights
          for modern enterprises.
        </p>

        <div style={s.heroCtas}>
          <button
                  type="button"
                  style={s.getStartedBtn}
                  onClick={onLogin}
                >
                  Get started
                </button>
          <button
            type="button"
            style={s.heroSecondary}
            onClick={onViewPlans}
          >
            View Plans
          </button>
        </div>
      </div>
    </section>
  );
}

const s = {
  pageRoot: {
    padding: "1.1rem 0 3rem",
    background:
      "radial-gradient(circle at top,#020617 0,#020617 45%,#000000 100%)",
    color: "#f9fafb",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  navShell: {
    padding: "0 5vw",
    marginBottom: "2.2rem",
  },
  navbar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.6rem 1.4rem",
    borderRadius: 999,
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(3,7,18,0.98))",
    border: "1px solid rgba(75,85,99,0.8)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.9)",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1.4rem",
  },
  logoPill: {
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    padding: "0.25rem 0.8rem",
    borderRadius: 999,
    background:
      "linear-gradient(135deg,rgba(15,23,42,1),rgba(17,24,39,1))",
    border: "1px solid rgba(55,65,81,0.9)",
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: "999px",
    background:
      "radial-gradient(circle at 30% 0,#60a5fa,#0f172a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
  },
  logoText: {
    fontWeight: 700,
    fontSize: "0.98rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },
  linkRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginLeft: "0.4rem",
  },
  navLink: {
    border: "none",
    background: "transparent",
    color: "#e5e7eb",
    fontSize: "0.86rem",
    padding: "0.45rem 0.9rem",
    borderRadius: 999,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  navLinkPrimary: {
    background:
      "linear-gradient(135deg,#0a2a6aff 0%,#0a2a6aff 45%,#0a2a6aff 100%)",
    boxShadow: "0 0 20px rgba(52, 56, 96, 0.9)",
    fontWeight: 600,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  iconBadge: {
    position: "relative",
    borderRadius: 999,
    border: "1px solid rgba(55,65,81,0.9)",
    background:
      "radial-gradient(circle at 30% 0,#1f2937,#020617)",
    color: "#babec8ff",
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  bellIcon: {
    fontSize: "0.95rem",
  },
  badgeDot: {
    position: "absolute",
    top: 4,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 999,
    background: "#f97373",
    boxShadow: "0 0 6px rgba(248,113,113,0.9)",
  },
  profileBadge: {
    borderRadius: 999,
    border: "1px solid rgba(88,28,135,0.9)",
    background:
      "radial-gradient(circle at 30% 0,#a855f7,#020617)",
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  profileIcon: {
    fontSize: "0.9rem",
  },
  textLink: {
    border: "none",
    background: "transparent",
    color: "#e5e7eb",
    fontSize: "0.86rem",
    cursor: "pointer",
  },
  getStartedBtn: {
    borderRadius: 999,
    border: "none",
    padding: "0.45rem 1.4rem",
    background:
      "linear-gradient(135deg,#0a2a6aff 0%,#0a2a6aff 40%,#0a2a6aff 100%)",
    color: "#f9fafb",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(129,140,248,0.8)",
  },
  heroContent: {
    padding: "0 6vw",
    marginTop: "1.2rem",
    maxWidth: 720,
  },
  kicker: {
    fontSize: "0.85rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: "0.7rem",
  },
  heroTitle: {
    fontSize: "2.2rem",
    lineHeight: 1.25,
    fontWeight: 800,
    marginBottom: "0.8rem",
  },
  heroSubtitle: {
    fontSize: "0.98rem",
    color: "#e5e7eb",
    lineHeight: 1.7,
    maxWidth: "38rem",
  },
  heroCtas: {
    marginTop: "1.5rem",
    display: "flex",
    gap: "0.8rem",
  },
  heroPrimary: {
    borderRadius: 999,
    border: "none",
    padding: "0.7rem 1.6rem",
    background:
      "linear-gradient(135deg,#3b82f6 0%,#6366f1 40%,#8b5cf6 100%)",
    color: "#f9fafb",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  heroSecondary: {
    borderRadius: 999,
    border: "1px solid rgba(75,85,99,1)",
    padding: "0.7rem 1.4rem",
    background: "transparent",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
};

export default HeroSection;



import React from "react";

const FEATURES = [
  {
    key: "appointments",
    title: "Book Appointments Instantly",
    text: "Connect with vetted insurance agents in seconds with live availability.",
    accent: "blue",
  },
  {
    key: "voice",  
    title: "Ask Queries via Voice",
    text: "Use natural speech to ask complex insurance questions—InsurAI handles the rest.",
    accent: "teal",
  },
  {
    key: "compare",
    title: "Compare Plans Smartly",
    text: "Side‑by‑side comparisons of coverage, exclusions and pricing across providers.",
    accent: "purple",
  },
  {
    key: "availability",
    title: "Agent Availability Hub",
    text: "Agents manage slots, holidays and reschedules from a unified calendar.",
    accent: "yellow",
  },
  {
    key: "secure",
    title: "Secure & Compliant",
    text: "Enterprise‑grade security, audit trails and access control for every role.",
    accent: "green",
  },
];


function iconBg(accent) {
  switch (accent) {
    case "blue":
      return { background: "radial-gradient(circle at 30% 0,#60a5fa,#0f172a)" };
    case "teal":
      return { background: "radial-gradient(circle at 30% 0,#2dd4bf,#022c22)" };
    case "purple":
      return { background: "radial-gradient(circle at 30% 0,#a855f7,#111827)" };
    case "yellow":
      return { background: "radial-gradient(circle at 30% 0,#facc15,#7c2d12)" };
    case "green":
      return { background: "radial-gradient(circle at 30% 0,#4ade80,#052e16)" };
    default:
      return {};
  }
}

function FeaturesSection({ onOpenAssistant, onOpenAvailability, 
  onOpenScheduling, onOpenAppointments, onOpenPlans, auth, onOpenContact 
}) {
  const role = auth?.role;

  const visibleFeatures = FEATURES.filter((f) => {
    if (role === "CUSTOMER" && f.key === "availability") return false;
    if (role === "AGENT" && f.key === "appointments") return false;
    return true;
  });

  return (
    <section className="home-section narrow" aria-label="Key features">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <header style={{ maxWidth: "38rem" }}>
          <div className="hero-kicker">Platform capabilities</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.4rem" }}>
            Everything you need in one insurance workspace
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#b0b5bd" }}>
            InsurAI connects customers, agents and admins through a single
            interface—covering queries, appointments, plans and performance.
          </p>
        </header>

        <button
          type="button"
          className="btn-outline"
          onClick={onOpenAppointments}
          style={{ whiteSpace: "nowrap" }}
        >
          Appointments
        </button>
      </div>

      <div className="features-grid">
        {visibleFeatures.map((f) => {
          const isVoice = f.key === "voice";
          const isAvailability = f.key === "availability";
          const isAppointments = f.key === "appointments";
          const isCompare = f.key === "compare";
          const isSecure = f.key === "secure";

          let onClick;
          if (isVoice && onOpenAssistant) onClick = onOpenAssistant;
          if (isAvailability && onOpenAvailability) onClick = onOpenAvailability;
          if (isAppointments && onOpenScheduling) onClick = onOpenScheduling;
          if (isCompare && onOpenPlans) onClick = onOpenPlans;     
          if (isSecure && onOpenContact) onClick = onOpenContact; 

          let extraText = null;
          if (isVoice) extraText = "";
          if (isAvailability) extraText = "";
          if (isAppointments) extraText = "";
          if (isCompare) extraText = "";
          if (isSecure) extraText = "";

          return (
            <article
              key={f.key}
              className="feature-card"
              onClick={onClick}
              role={onClick ? "button" : undefined}
              tabIndex={onClick ? 0 : -1}
              onKeyDown={
                onClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClick();
                      }
                    }
                  : undefined
              }
              style={onClick ? { cursor: "pointer" } : undefined}
            >
              <div className="feature-icon" style={iconBg(f.accent)}>
                <span style={{ fontSize: "0.9rem" }}>★</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
              {extraText && (
                <div
                  style={{
                    marginTop: "0.7rem",
                    fontSize: "0.8rem",
                    color: "#a5b4fc",
                  }}
                >
                  {extraText}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturesSection;

import React, { useRef, useEffect } from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import AboutSection from "./AboutSection";
import FooterSection from "./FooterSection";

function HomePage({ onLogin, onRegister, onViewPlans, onOpenAssistant,
  onOpenAvailability, onOpenScheduling, onOpenAppointments,
  onOpenNotifications, onOpenProfile, onOpenContact, onOpenAdmin, 
  auth, autoScrollToFeatures, onGoHome
}) {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (autoScrollToFeatures) {
      const t = setTimeout(scrollToFeatures, 100);
      return () => clearTimeout(t);
    }
  }, [autoScrollToFeatures]);

  return (
    <div className="home-root app-root">
      <div className="home-topbar">
        <div />
        {/* <button
          type="button"
          className="assistant-icon-btn"
          title="Notifications"
          onClick={onOpenNotifications}
        >
          🔔
        </button>
        <button
          className="assistant-icon-btn"
          title="Profile"
          onClick={onOpenProfile}
        >
          👤
        </button> */}

         {/* {isAdmin && (
            <button
              className="icon-pill icon-pill-admin"
              onClick={onOpenAdmin}
              title="Admin dashboard"
              style={{ ...s.iconPill, ...s.adminPill }}
            >
              Admin
            </button>
          )} */}
      </div> 
      <div ref={featuresRef}>
        <HeroSection
          onGetStarted={onLogin}
          onViewPlans={onViewPlans}
          onOpenAssistant={onOpenAssistant} 
          onOpenAvailability={onOpenAvailability}
          onOpenScheduling={onOpenScheduling}
          onOpenAppointments={onOpenAppointments}
          onOpenPlans={onViewPlans}
          onOpenContact={onOpenContact}
          onOpenProfile={onOpenProfile}
          onOpenNotifications={onOpenNotifications}
          onOpenAdmin={onOpenAdmin}
          onGoHome={onGoHome}
          onLogin={onLogin}
          auth={auth}
        />

        <FeaturesSection onOpenAssistant={onOpenAssistant} 
          onOpenAvailability={onOpenAvailability}
          onOpenScheduling={onOpenScheduling}
          onOpenAppointments={onOpenAppointments}
          onOpenPlans={onViewPlans}
          onOpenContact={onOpenContact}
          auth={auth}
        />
      </div>
      <HowItWorksSection />
      <AboutSection />
      <FooterSection
        onLogin={onLogin}
        onRegister={onRegister}
        onViewPlans={onViewPlans}
        onOpenContact={onOpenContact}
        onOpenAssistant={onOpenAssistant}
      />
    </div>
  );
}

// const s = {
//   heroRoot: {
//     padding: "1.2rem 6vw 3rem",
//     background:
//       "radial-gradient(circle at top left,#1d283a 0,#020617 55%,#000 100%)",
//     color: "#f9fafb",
//     fontFamily:
//       'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
//   },
//   topbar: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: "2rem",
//   },
//   logo: {
//     fontWeight: 700,
//     fontSize: "1.1rem",
//     letterSpacing: "0.18em",
//     textTransform: "uppercase",
//   },
//   right: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.6rem",
//   },
//   iconPill: {
//     borderRadius: 999,
//     border: "1px solid rgba(55,65,81,0.9)",
//     background: "rgba(15,23,42,0.95)",
//     color: "#e5e7eb",
//     padding: "0.35rem 0.8rem",
//     fontSize: "0.8rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.25rem",
//   },
//   adminPill: {
//     borderColor: "rgba(63, 70, 92, 0.85)",
//     boxShadow: "0 0 12px rgba(74, 75, 81, 0.55)",
//     background:
//       "linear-gradient(135deg, rgba(42, 47, 61, 0.95), rgba(46, 55, 84, 0.2))",
//     fontWeight: 600,
//   },
//   linkBtn: {
//     background: "transparent",
//     border: "none",
//     color: "#55585dff",
//     fontSize: "0.9rem",
//     cursor: "pointer",
//   },
//   primaryBtn: {
//     borderRadius: 999,
//     border: "none",
//     padding: "1.1rem 1.1rem",
//     background:
//       "linear-gradient(135deg,#3b82f6 0%,#6366f1 40%,#8b5cf6 100%)",
//     color: "#484b4fff",
//     fontSize: "0.9rem",
//     fontWeight: 600,
//     cursor: "pointer",
//   },
// };

export default HomePage;

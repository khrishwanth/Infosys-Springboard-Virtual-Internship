import React, { useState, useEffect } from "react";
import HomePage from "./Home/HomePage";
import LoginForm from "./Auth/LoginForm";
import SignUpForm from "./Auth/SignUpForm";
import PlansPage from "./Plans/PlansPage";
import AssistantPage from "./Assistant/AssistantPage";
import AgentAvailabilityPage from "./AgentAvailability/AgentAvailabilityPage";
import AppointmentSchedulingPage from "./AppointmentScheduling/AppointmentSchedulingPage";
import AppointmentManagementPage from "./AppointmentManagement/AppointmentManagementPage";
import NotificationPage from "./Notifications/NotificationPage";
import ProfilePage from "./Profile/ProfilePage";
import ContactSupportPage from "./Contact/ContactSupportPage";
import AdminDashboardPage from "./Admin/AdminDashboardPage";
import "./styles/global.css";
import TopNav from "./styles/TopNav";

function App() {
  const [page, setPage] = useState("home");
  const [scrollToFeaturesNext, setScrollToFeaturesNext] = useState(false);
 

const [auth, setAuth] = useState({
  token: null,
  role: null,
  userId: null,
  name: null,
  email: null,
});

const handleLogout = () => {
  clearAuth();
};


useEffect(() => {
  const stored = localStorage.getItem("insurai_auth");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.token && parsed.role) {
        setAuth(parsed);
      }
    } catch {
      setAuth((prev) => ({ ...prev, token: stored }));
    }
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("from") === "google") {
    setScrollToFeaturesNext(true);
    setPage("home");
    window.history.replaceState({}, "", "/");
  }
}, []);

const persistAuth = (data) => {
  setAuth(data);
  localStorage.setItem("insurai_auth", JSON.stringify(data));
  localStorage.setItem("insurai_user", JSON.stringify(data));
};

  const clearAuth = () => {
    setAuth({
      token: null,
      role: null,
      userId: null,
      name: null,
      email: null,
    });
    localStorage.removeItem("insurai_auth");
    setPage("login");
  };

  const goHome = () => {
    setScrollToFeaturesNext(false);
    setPage("home");
  };
  const goHomeToFeatures = () => {
    setScrollToFeaturesNext(true);
    setPage("home");
  };

  const goLogin = () => setPage("login");
  const goSignup = () => setPage("signup");
  const goPlans = () => setPage("plans");
  const goAssistant = () => setPage("assistant");
  const goAvailability = () => setPage("availability");
  const goScheduling = () => setPage("scheduling");
  const goAppointments = () => setPage("appointments");
  const goNotifications = () => setPage("notifications");
  const goProfile = () => setPage("profile");
  const goContact = () => setPage("contact");
  const goAdmin = () => setPage("admin");

  const renderWithNav = (content) => (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#020617 0,#020617 45%,#000000 100%)",
        color: "#f9fafb",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <TopNav
        auth={auth}
        onGoHome={goHome}
        onViewPlans={goPlans}
        onOpenAssistant={goAssistant}
        onOpenAvailability={goAvailability}
        onOpenScheduling={goScheduling}
        onOpenAppointments={goAppointments}
        onOpenNotifications={goNotifications}
        onOpenProfile={goProfile}
        onOpenContact={goContact}
        onOpenAdmin={goAdmin}
        onLogin={goLogin}
        onRegister={goSignup}
        onLogout={handleLogout}
      />
      <div style={{ paddingTop: "0.5rem" }}>{content}</div>
    </div>
  );

  const renderAdminShell = (content) => {
    // if not admin, redirect to home
    if (auth?.role !== "ADMIN") {
      setPage("home");
      return null;
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(100deg, #020617, #0f172a)",
          color: "#e5e7eb",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Admin module content will include its own sticky navbar */}
        {content}
      </div>
    );
  };

  const requireAuth = (allowedRoles, component) => {
    if (!auth.token) {
      setPage("login");
      return (
        <LoginForm
          onShowRegister={goSignup}
          onLoginSuccess={(authData) => {
            persistAuth(authData);
            if (authData.role === "ADMIN") {
              goAdmin();
            } else if (authData.role === "AGENT") {
              goAvailability();
            } else {
              goHomeToFeatures();
            }
          }}
        />
      );
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
      goHome();
      return (
        <HomePage
          onLogin={goLogin}
          onRegister={goSignup}
          onViewPlans={goPlans}
          onOpenAssistant={goAssistant}
          onOpenAvailability={goAvailability}
          onOpenScheduling={goScheduling}
          onOpenAppointments={goAppointments}
          onOpenNotifications={goNotifications}
          onOpenProfile={goProfile}
          onOpenContact={goContact}
          onGoHome={goHomeToFeatures}
          autoScrollToFeatures={scrollToFeaturesNext}
          auth={auth}
          onLogout={clearAuth}
        />
      );
    }

    return component;
  };

  if (page === "login") {
    return (
      <LoginForm
        onShowRegister={goSignup}
        onLoginSuccess={(authData) => {
          persistAuth(authData);
          if (authData.role === "ADMIN") {
            goAdmin();
          } else if (authData.role === "AGENT") {
            goAvailability();
          } else {
            goHomeToFeatures();
          }
        }}
      />
    );
  }

  if (page === "signup") {
    return <SignUpForm onSignUp={goLogin} onShowLogin={goLogin} />;
  }

  if (page === "plans") {
    return renderWithNav(
      <PlansPage
        onGoHome={goHomeToFeatures}
        onGoLogin={goLogin}
        auth={auth}
      />
    );
  }

  if (page === "assistant") {
    return requireAuth(
      ["CUSTOMER", "AGENT", "ADMIN"],
      renderWithNav(
        <AssistantPage onViewPlans={goPlans} onGoHome={goHomeToFeatures} auth={auth} onLogout={clearAuth} />
      )
    );
  }

  if (page === "availability") {
    return requireAuth(
      ["AGENT"],
      renderWithNav(
        <AgentAvailabilityPage onOpenNotifications={goNotifications} onGoHome={goHomeToFeatures} auth={auth} onLogout={clearAuth} />
      )
    );
  }

  if (page === "scheduling") {
    return requireAuth(
      ["CUSTOMER"],
      renderWithNav(
        <AppointmentSchedulingPage onGoHome={goHomeToFeatures} auth={auth} onLogout={clearAuth} />
      )  
    );
  }

  if (page === "appointments") {
    return requireAuth(
      ["CUSTOMER", "AGENT", "ADMIN"],
      renderWithNav(
        <AppointmentManagementPage onGoHome={goHomeToFeatures} auth={auth} onLogout={clearAuth} />
      )  
    );
  }

  if (page === "notifications") {
    return requireAuth(
      ["CUSTOMER", "AGENT", "ADMIN"],
      renderWithNav(
        <NotificationPage onGoHome={goHome} auth={auth} onLogout={clearAuth} />
      )  
    );
  }

  if (page === "profile") {
    return requireAuth(
      ["CUSTOMER", "AGENT", "ADMIN"],
      renderWithNav(
        <ProfilePage onGoHome={goHome} auth={auth} />
      )
    );
  }

  if (page === "contact") {
    return renderWithNav(
      <ContactSupportPage
        onGoHome={goHomeToFeatures}
        auth={auth}
        onLogout={clearAuth}
      />
    );
  }

  if (page === "admin") {
    return requireAuth(
      ["ADMIN"],
      renderAdminShell(
        <AdminDashboardPage 
          onGoHome={goHome} 
          auth={auth} 
          onLogout={clearAuth} 
          onGoNotifications={goNotifications}
          onGoPlans={goPlans}
          onGoAppointments={goAppointments}
          onOpenProfile={goProfile}
        />
      )
    );
  }

  return (
    <HomePage
      onLogin={goLogin}
      onRegister={goSignup}
      onViewPlans={goPlans}
      onOpenAssistant={goAssistant}
      onOpenAvailability={goAvailability}
      onOpenScheduling={goScheduling}
      onOpenAppointments={goAppointments}
      onOpenNotifications={goNotifications}
      onOpenProfile={goProfile}
      onOpenContact={goContact}
      autoScrollToFeatures={scrollToFeaturesNext}
      onOpenAdmin={goAdmin}
      onGoHome={goHomeToFeatures}
      auth={auth}
      onLogout={clearAuth}
    />
  );
}

export default App;
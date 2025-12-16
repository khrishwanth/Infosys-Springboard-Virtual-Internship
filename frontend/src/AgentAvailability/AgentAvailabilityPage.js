import React, { useEffect, useState } from "react";
import AvailabilityTopBar from "./AvailabilityTopBar";
import AvailabilityCalendar from "./AvailabilityCalendar";
import AvailabilitySummary from "./AvailabilitySummary";
import { apiFetch } from "../apiClient";

function AgentAvailabilityPage({ onGoHome, onOpenNotifications }) {
  const [view, setView] = useState("week");

  const getMonday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); 
    const diff = day === 0 ? -6 : 1 - day; 
    d.setDate(d.getDate() + diff);
    return d;
  };

  const [selectedWeekStart, setSelectedWeekStart] = useState(() =>
    getMonday()
  );

  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617, #0f172a)",
      color: "#e5e7eb",
      padding: "80px 24px 40px",
      boxSizing: "border-box",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    shell: { maxWidth: "1200px", margin: "0 auto" },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    title: { fontSize: "24px", fontWeight: 600, letterSpacing: "0.02em" },
    subtitle: { fontSize: "14px", color: "#9ca3af", marginTop: "4px" },
    actions: { display: "flex", gap: "8px" },
    pillButton: {
      borderRadius: "9999px",
      padding: "8px 14px",
      border: "1px solid rgba(148, 163, 184, 0.3)",
      background: "rgba(15, 23, 42, 0.8)",
      color: "#e5e7eb",
      fontSize: "13px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      transition: "background 0.15s ease, border-color 0.15s ease",
    },
    pillButtonPrimary: {
      background: "linear-gradient(135deg, #06b6d4, #2563eb)",
      border: "none",
      color: "#f9fafb",
    },
    layout: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 2.5fr) minmax(0, 1.2fr)",
      gap: "20px",
      alignItems: "flex-start",
      marginTop: "12px",
    },
    card: {
      borderRadius: "18px",
      background:
        "radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0.9))",
      border: "1px solid rgba(148, 163, 184, 0.35)",
      boxShadow: "0 22px 45px rgba(15, 23, 42, 0.7)",
      padding: "18px 18px 16px",
      boxSizing: "border-box",
    },
    error: {
      marginTop: "8px",
      padding: "8px 12px",
      borderRadius: "9999px",
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(248, 113, 113, 0.5)",
      color: "#fecaca",
      fontSize: "13px",
    },
  };

  
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const resp = await apiFetch(
          "http://localhost:8080/api/availability/my"
        );

        if (!isMounted) return;

        const normalized = (resp || []).map((a) => ({
          id: a.id,
          date: a.date,
          startTime: a.startTime,
          endTime: a.endTime,
          status: a.status,
          notes: a.notes || "",
        }));

        setAvailability(normalized);
      } catch (err) {
        console.error("Failed to load availability", err);
        if (isMounted) {
          setError("Failed to load your availability. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateSlot = async ({ date, startTime, endTime, notes }) => {
    try {
      const body = { date, startTime, endTime, notes }; // exactly matches AgentAvailabilityRequest
      const created = await apiFetch("http://localhost:8080/api/availability/my", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setAvailability((prev) => [...prev, created]);
    } catch (err) {
      console.error("Create availability error", err);
      throw err; // let AvailabilityCalendar show the error
    }
  };


  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.title}>Agent availability</div>
            <div style={styles.subtitle}>
              Set when you are available so customers can book appointments.
            </div>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.layout}>
          <div style={styles.card}>
            <AvailabilityTopBar
              view={view}
              setView={setView}
              weekStart={selectedWeekStart}
              setWeekStart={setSelectedWeekStart}
              onOpenNotifications={onOpenNotifications}
            />
            <AvailabilityCalendar
              view={view}
              weekStart={selectedWeekStart}
              availability={availability}
              appointments={appointments}
              onCreateSlot={handleCreateSlot}
              loading={loading}
            />
          </div>

          <div style={styles.card}>
            <AvailabilitySummary
              availability={availability}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentAvailabilityPage;





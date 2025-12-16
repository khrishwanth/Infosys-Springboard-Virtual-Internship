// src/pages/AdminDashboardPage.js
import React, { useEffect, useState } from "react";
import TopNav from "../styles/TopNav";
import { apiFetch } from "../apiClient";
import AdminKpiRow from "./AdminKpiRow";
import AdminChartsPanel from "./AdminChartsPanel";
import AdminManagementPanel from "./AdminManagementPanel";
import AssistantSidePanel from "../Assistant/AssistantSidePanel";

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);

  const [activeSection, setActiveSection] = useState("dashboard"); // dashboard | users | policies | appointments
  const [sidePanelContent, setSidePanelContent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          summaryRes,
          dailyUsersRes,
          dailyApptsRes,
          recentApptsRes,
          latestUsersRes,
        ] = await Promise.all([
          apiFetch(
            "http://localhost:8080/api/admin/users/dashboard/summary"
          ),
          apiFetch(
            "http://localhost:8080/api/admin/users/stats/daily?days=14"
          ),
          apiFetch(
            "http://localhost:8080/api/admin/users/appointments/daily?days=14"
          ),
          apiFetch(
            "http://localhost:8080/api/admin/users/appointments/recent"
          ),
          apiFetch("http://localhost:8080/api/admin/users/latest"),
        ]);

        if (cancelled) return;

        setSummary(summaryRes || null);
        setUserStats(Array.isArray(dailyUsersRes) ? dailyUsersRes : []);
        setAppointmentStats(
          Array.isArray(dailyApptsRes) ? dailyApptsRes : []
        );
        setRecentAppointments(
          Array.isArray(recentApptsRes) ? recentApptsRes : []
        );
        setLatestUsers(Array.isArray(latestUsersRes) ? latestUsersRes : []);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
        if (!cancelled) {
          setError("Could not load dashboard data. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadChartsOnly() {
      try {
        setChartsLoading(true);
        const [dailyUsersRes, dailyApptsRes] = await Promise.all([
          apiFetch(
            "http://localhost:8080/api/admin/users/stats/daily?days=14"
          ),
          apiFetch(
            "http://localhost:8080/api/admin/users/appointments/daily?days=14"
          ),
        ]);
        if (cancelled) return;
        setUserStats(Array.isArray(dailyUsersRes) ? dailyUsersRes : []);
        setAppointmentStats(
          Array.isArray(dailyApptsRes) ? dailyApptsRes : []
        );
      } catch (err) {
        console.error("Failed to refresh charts", err);
      } finally {
        if (!cancelled) setChartsLoading(false);
      }
    }

    loadDashboard();

    const intervalId = setInterval(loadChartsOnly, 60_000); // refresh charts every 60s
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left, rgba(59,130,246,0.14), rgba(15,23,42,1))",
      color: "#e5e7eb",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    },
    main: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "80px 16px 22px",
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: "minmax(0, 3fr) minmax(0, 1.6fr)",
      gap: "14px",
      alignItems: "flex-start",
    },
    leftCol: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    rightCol: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "8px",
      marginBottom: "4px",
      flexWrap: "wrap",
    },
    titleCol: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    title: {
      fontSize: "20px",
      fontWeight: 600,
    },
    subtitle: {
      fontSize: "13px",
      color: "#9ca3af",
    },
    error: {
      margin: "4px 0 0",
      padding: "6px 10px",
      borderRadius: "10px",
      background: "rgba(239, 68, 68, 0.12)",
      border: "1px solid rgba(248, 113, 113, 0.6)",
      color: "#fecaca",
      fontSize: "12px",
    },
    sectionShell: {
      borderRadius: "16px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.96)",
      boxShadow: "0 24px 55px rgba(15,23,42,0.88)",
      padding: "10px 12px",
      boxSizing: "border-box",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
    },
    sectionTitle: {
      fontSize: "13px",
      fontWeight: 600,
    },
    sectionHint: {
      fontSize: "11px",
      color: "#9ca3af",
    },
    tableWrapper: {
      marginTop: "4px",
      borderRadius: "12px",
      border: "1px solid rgba(31,41,55,0.85)",
      background: "rgba(15,23,42,0.98)",
      maxHeight: "260px",
      overflow: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px",
    },
    th: {
      textAlign: "left",
      padding: "8px 10px",
      borderBottom: "1px solid rgba(31,41,55,0.9)",
      color: "#9ca3af",
      fontWeight: 500,
      whiteSpace: "nowrap",
      background:
        "linear-gradient(to right, rgba(15,23,42,1), rgba(30,64,175,0.35))",
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
    td: {
      padding: "7px 10px",
      borderBottom: "1px solid rgba(31,41,55,0.7)",
      whiteSpace: "nowrap",
      cursor: "pointer",
    },
    pillTabs: {
      display: "inline-flex",
      borderRadius: "9999px",
      border: "1px solid rgba(148,163,184,0.5)",
      background: "rgba(15,23,42,0.95)",
      padding: "2px",
      gap: "2px",
      fontSize: "11px",
    },
    pill: (active) => ({
      borderRadius: "9999px",
      padding: "4px 10px",
      border: active
        ? "1px solid rgba(59,130,246,0.9)"
        : "1px solid transparent",
      background: active
        ? "linear-gradient(to right, rgba(37,99,235,0.7), rgba(129,140,248,0.6))"
        : "transparent",
      color: active ? "#e5e7eb" : "#9ca3af",
      cursor: "pointer",
    }),
    empty: {
      padding: "8px 10px",
      fontSize: "12px",
      color: "#9ca3af",
    },
  };

  const kpiStats = summary
    ? {
        appointments: {
          today: summary.todaysAppointments || 0,
          last7Days: summary.last7DaysAppointments || 0,
          allTime: summary.allTimeAppointments || 0,
        },
        customers: summary.totalCustomers || 0,
        agents: summary.totalAgents || 0,
        plans: summary.totalPlans || 0,
      }
    : null;

  const handleAppointmentRowClick = (appt) => {
    setSidePanelContent({
      type: "appointment",
      data: appt,
    });
  };

  const handleUserRowClick = (user) => {
    setSidePanelContent({
      type: "user",
      data: user,
    });
  };

  const renderMainSection = () => {
    if (activeSection === "users") {
      return <AdminManagementPanel mode="users" />;
    }
    if (activeSection === "policies") {
      return <AdminManagementPanel mode="policies" />;
    }
    if (activeSection === "appointments") {
      return <AdminManagementPanel mode="appointments" />;
    }

    // default: dashboard content
    return (
      <>
        <AdminKpiRow
          stats={kpiStats}
          loading={loading}
          onCardClick={(target) => {
            if (target === "appointments") setActiveSection("appointments");
            if (target === "customers") setActiveSection("users");
            if (target === "plans") setActiveSection("policies");
          }}
        />

        <AdminChartsPanel
          userStats={userStats}
          appointmentStats={appointmentStats}
          loading={chartsLoading}
        />

        <div style={styles.sectionShell}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Recent appointments</span>
            <span style={styles.sectionHint}>
              Last 10 created, across all customers and agents.
            </span>
          </div>

          <div style={styles.tableWrapper}>
            {recentAppointments.length === 0 ? (
              <div style={styles.empty}>No recent appointments found.</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Agent</th>
                    <th style={styles.th}>Scheduled</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((a) => (
                    <tr key={a.id} onClick={() => handleAppointmentRowClick(a)}>
                      <td style={styles.td}>{a.id}</td>
                      <td style={styles.td}>{a.customerName || a.customerId}</td>
                      <td style={styles.td}>{a.agentName || a.agentId || "—"}</td>
                      <td style={styles.td}>
                        {a.scheduledAt
                          ? new Date(a.scheduledAt).toLocaleString()
                          : "Not scheduled"}
                      </td>
                      <td style={styles.td}>{a.status || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={styles.page}>
      <TopNav />
      <main style={styles.main}>
        <div style={styles.leftCol}>
          <div style={styles.headerRow}>
            <div style={styles.titleCol}>
              <div style={styles.title}>Admin dashboard</div>
              <div style={styles.subtitle}>
                Monitor customers, agents, plans, and appointments in one place.
              </div>
              {error && <div style={styles.error}>{error}</div>}
            </div>

            <div style={styles.pillTabs}>
              <button
                type="button"
                style={styles.pill(activeSection === "dashboard")}
                onClick={() => setActiveSection("dashboard")}
              >
                Overview
              </button>
              <button
                type="button"
                style={styles.pill(activeSection === "users")}
                onClick={() => setActiveSection("users")}
              >
                Users
              </button>
              <button
                type="button"
                style={styles.pill(activeSection === "policies")}
                onClick={() => setActiveSection("policies")}
              >
                Plans
              </button>
              <button
                type="button"
                style={styles.pill(activeSection === "appointments")}
                onClick={() => setActiveSection("appointments")}
              >
                Appointments
              </button>
            </div>
          </div>

          {renderMainSection()}
        </div>

        <div style={styles.rightCol}>
          <div style={styles.sectionShell}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Latest users</span>
              <span style={styles.sectionHint}>Recently registered accounts.</span>
            </div>

            <div style={styles.tableWrapper}>
              {latestUsers.length === 0 ? (
                <div style={styles.empty}>No users found.</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestUsers.map((u) => (
                      <tr key={u.id} onClick={() => handleUserRowClick(u)}>
                        <td style={styles.td}>{u.name}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>{u.role}</td>
                        <td style={styles.td}>{u.createdAt || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <AssistantSidePanel content={sidePanelContent} />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboardPage;

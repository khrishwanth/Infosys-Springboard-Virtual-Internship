// src/pages/AppointmentManagementPage.js
import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../apiClient";

function AppointmentManagementPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [agentFilter, setAgentFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL"); // ALL | TODAY | NEXT_7 | THIS_MONTH

  // derive quick filter options for agents
  const agentOptions = useMemo(() => {
    const map = new Map();
    appointments.forEach((a) => {
      if (a.agentId && a.agentName) {
        map.set(a.agentId, a.agentName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [appointments]);

  useEffect(() => {
    let cancelled = false;

    async function loadAppointments() {
      try {
        setLoading(true);
        setError("");

        // admin endpoint
        const data = await apiFetch(
          "http://localhost:8080/api/appointments/admin/all"
        );

        if (cancelled) return;
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load appointments", err);
        if (!cancelled) {
          setError("Could not load appointments. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAppointments();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAppointments = useMemo(() => {
    const now = new Date();

    return appointments.filter((a) => {
      // status
      if (statusFilter !== "ALL" && a.status !== statusFilter) return false;

      // agent
      if (agentFilter !== "ALL" && String(a.agentId) !== String(agentFilter))
        return false;

      // date
      if (dateFilter !== "ALL" && a.scheduledAt) {
        const dt = new Date(a.scheduledAt);

        if (dateFilter === "TODAY") {
          const sameDay =
            dt.getFullYear() === now.getFullYear() &&
            dt.getMonth() === now.getMonth() &&
            dt.getDate() === now.getDate();
          if (!sameDay) return false;
        } else if (dateFilter === "NEXT_7") {
          const diffMs = dt - now;
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays < 0 || diffDays > 7) return false;
        } else if (dateFilter === "THIS_MONTH") {
          const sameMonth =
            dt.getFullYear() === now.getFullYear() &&
            dt.getMonth() === now.getMonth();
          if (!sameMonth) return false;
        }
      }

      return true;
    });
  }, [appointments, statusFilter, agentFilter, dateFilter]);

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left, rgba(59,130,246,0.14), rgba(15,23,42,1))",
      color: "#e5e7eb",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    },
    main: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "80px 16px 24px",
      boxSizing: "border-box",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      gap: "8px",
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
    filtersRow: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    select: {
      borderRadius: "9999px",
      border: "1px solid rgba(148,163,184,0.6)",
      background: "rgba(15,23,42,0.96)",
      color: "#e5e7eb",
      fontSize: "12px",
      padding: "6px 10px",
      outline: "none",
    },
    shell: {
      borderRadius: "16px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.96)",
      boxShadow: "0 24px 55px rgba(15,23,42,0.88)",
      padding: "12px 14px",
      boxSizing: "border-box",
    },
    tableWrapper: {
      borderRadius: "12px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.98)",
      overflow: "auto",
      maxHeight: "560px",
      marginTop: "4px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px",
    },
    th: {
      textAlign: "left",
      padding: "10px 12px",
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
      padding: "9px 12px",
      borderBottom: "1px solid rgba(31,41,55,0.7)",
      whiteSpace: "nowrap",
    },
    badge: (colorBg, colorBorder, colorText) => ({
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "9999px",
      padding: "2px 8px",
      border: `1px solid ${colorBorder}`,
      fontSize: "11px",
      color: colorText,
      background: colorBg,
    }),
    empty: {
      padding: "12px",
      fontSize: "12px",
      color: "#9ca3af",
    },
    error: {
      marginTop: "8px",
      padding: "6px 10px",
      borderRadius: "10px",
      background: "rgba(239, 68, 68, 0.12)",
      border: "1px solid rgba(248, 113, 113, 0.6)",
      color: "#fecaca",
      fontSize: "12px",
    },
    loading: {
      padding: "10px 0",
      fontSize: "12px",
      color: "#9ca3af",
    },
  };

  const renderStatusBadge = (status) => {
    if (!status) {
      return (
        <span style={styles.badge("transparent", "rgba(55,65,81,0.8)", "#9ca3af")}>
          N/A
        </span>
      );
    }

    const up = status.toUpperCase();
    if (up === "CONFIRMED") {
      return (
        <span
          style={styles.badge(
            "rgba(34,197,94,0.08)",
            "rgba(34,197,94,0.6)",
            "#bbf7d0"
          )}
        >
          Confirmed
        </span>
      );
    }
    if (up === "PENDING") {
      return (
        <span
          style={styles.badge(
            "rgba(234,179,8,0.08)",
            "rgba(234,179,8,0.7)",
            "#facc15"
          )}
        >
          Pending
        </span>
      );
    }
    if (up === "CANCELLED") {
      return (
        <span
          style={styles.badge(
            "rgba(239,68,68,0.08)",
            "rgba(239,68,68,0.7)",
            "#fecaca"
          )}
        >
          Cancelled
        </span>
      );
    }
    if (up === "COMPLETED") {
      return (
        <span
          style={styles.badge(
            "rgba(59,130,246,0.08)",
            "rgba(59,130,246,0.7)",
            "#bfdbfe"
          )}
        >
          Completed
        </span>
      );
    }

    return (
      <span style={styles.badge("transparent", "rgba(55,65,81,0.8)", "#9ca3af")}>
        {status}
      </span>
    );
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.headerRow}>
          <div style={styles.titleCol}>
            <div style={styles.title}>Appointment Management</div>
            <div style={styles.subtitle}>
              View and filter all customer appointments across agents.
            </div>
          </div>
          <div style={styles.filtersRow}>
            <select
              style={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              style={styles.select}
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="ALL">All agents</option>
              {agentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>

            <select
              style={styles.select}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="ALL">Any date</option>
              <option value="TODAY">Today</option>
              <option value="NEXT_7">Next 7 days</option>
              <option value="THIS_MONTH">This month</option>
            </select>
          </div>
        </div>

        <div style={styles.shell}>
          {loading && <div style={styles.loading}>Loading appointments…</div>}
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.tableWrapper}>
            {filteredAppointments.length === 0 && !loading ? (
              <div style={styles.empty}>No appointments found for selected filters.</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Agent</th>
                    <th style={styles.th}>Scheduled</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((a) => (
                    <tr key={a.id}>
                      <td style={styles.td}>{a.id}</td>
                      <td style={styles.td}>{a.customerName || a.customerId}</td>
                      <td style={styles.td}>{a.agentName || a.agentId || "—"}</td>
                      <td style={styles.td}>
                        {a.scheduledAt
                          ? new Date(a.scheduledAt).toLocaleString()
                          : "Not scheduled"}
                      </td>
                      <td style={styles.td}>{renderStatusBadge(a.status)}</td>
                      <td style={styles.td}>{a.reason || "—"}</td>
                      <td style={styles.td}>{a.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppointmentManagementPage;

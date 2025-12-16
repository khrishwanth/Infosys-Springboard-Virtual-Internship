// src/components/AdminChartsPanel.js
import React from "react";

function AdminChartsPanel({ userStats, appointmentStats, loading }) {
  const styles = {
    row: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
      gap: "10px",
      marginTop: "10px",
    },
    card: {
      borderRadius: "14px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.96)",
      padding: "10px 12px",
      boxSizing: "border-box",
      minHeight: "150px",
    },
    title: {
      fontSize: "13px",
      fontWeight: 600,
      marginBottom: "6px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    subtitle: {
      fontSize: "11px",
      color: "#9ca3af",
    },
    loading: {
      fontSize: "12px",
      color: "#9ca3af",
      paddingTop: "8px",
    },
    empty: {
      fontSize: "12px",
      color: "#6b7280",
      paddingTop: "8px",
    },
    miniRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "4px",
      fontSize: "11px",
      color: "#9ca3af",
    },
    barRow: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginTop: "4px",
      fontSize: "11px",
    },
    barTrack: {
      flex: 1,
      height: "5px",
      borderRadius: "9999px",
      background: "rgba(31,41,55,0.9)",
      overflow: "hidden",
    },
    barFill: (color, ratio) => ({
      width: `${Math.max(0, Math.min(1, ratio)) * 100}%`,
      height: "100%",
      borderRadius: "9999px",
      background: color,
      transition: "width 0.3s ease-out",
    }),
    sparkline: {
      marginTop: "8px",
      fontSize: "11px",
      color: "#6b7280",
    },
  };

  const hasUserStats = Array.isArray(userStats) && userStats.length > 0;
  const hasApptStats =
    Array.isArray(appointmentStats) && appointmentStats.length > 0;

  const lastUserPoint = hasUserStats ? userStats[userStats.length - 1] : null;
  const lastApptPoint = hasApptStats
    ? appointmentStats[appointmentStats.length - 1]
    : null;

  return (
    <div style={styles.row}>
      {/* Users chart */}
      <div style={styles.card}>
        <div style={styles.title}>
          <span>Users trend (last 14 days)</span>
          <span style={styles.subtitle}>New customers & active agents</span>
        </div>

        {loading && <div style={styles.loading}>Loading charts…</div>}

        {!loading && !hasUserStats && (
          <div style={styles.empty}>Not enough data to display user trends yet.</div>
        )}

        {!loading && hasUserStats && (
          <>
            <div style={styles.miniRow}>
              <span>Today new customers</span>
              <span>{lastUserPoint.newCustomers}</span>
            </div>
            <div style={styles.barRow}>
              <span>New</span>
              <div style={styles.barTrack}>
                <div
                  style={styles.barFill(
                    "rgba(59,130,246,0.9)",
                    Math.min(1, lastUserPoint.newCustomers / 10)
                  )}
                />
              </div>
            </div>

            <div style={styles.miniRow}>
              <span>Active agents</span>
              <span>{lastUserPoint.activeAgents}</span>
            </div>
            <div style={styles.barRow}>
              <span>Agents</span>
              <div style={styles.barTrack}>
                <div
                  style={styles.barFill(
                    "rgba(34,197,94,0.9)",
                    Math.min(1, lastUserPoint.activeAgents / 10)
                  )}
                />
              </div>
            </div>

            <div style={styles.sparkline}>
              {userStats.slice(-5).map((p) => p.newCustomers).join(" • ")} new
              customers in last days.
            </div>
          </>
        )}
      </div>

      {/* Appointments chart */}
      <div style={styles.card}>
        <div style={styles.title}>
          <span>Appointments trend (last 14 days)</span>
          <span style={styles.subtitle}>Total vs confirmed</span>
        </div>

        {loading && <div style={styles.loading}>Loading charts…</div>}

        {!loading && !hasApptStats && (
          <div style={styles.empty}>
            Not enough appointment history to display trends yet.
          </div>
        )}

        {!loading && hasApptStats && (
          <>
            <div style={styles.miniRow}>
              <span>Today total</span>
              <span>{lastApptPoint.total}</span>
            </div>
            <div style={styles.barRow}>
              <span>Total</span>
              <div style={styles.barTrack}>
                <div
                  style={styles.barFill(
                    "rgba(96,165,250,0.9)",
                    Math.min(1, lastApptPoint.total / 10)
                  )}
                />
              </div>
            </div>

            <div style={styles.miniRow}>
              <span>Today confirmed</span>
              <span>{lastApptPoint.confirmed}</span>
            </div>
            <div style={styles.barRow}>
              <span>Conf.</span>
              <div style={styles.barTrack}>
                <div
                  style={styles.barFill(
                    "rgba(34,197,94,0.9)",
                    lastApptPoint.total
                      ? Math.min(1, lastApptPoint.confirmed / lastApptPoint.total)
                      : 0
                  )}
                />
              </div>
            </div>

            <div style={styles.sparkline}>
              {appointmentStats
                .slice(-5)
                .map((p) => p.total)
                .join(" • ")}{" "}
              total bookings in recent days.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminChartsPanel;

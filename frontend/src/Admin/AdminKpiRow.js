// src/Admin/AdminKpiRow.js
import React from "react";

function AdminKpiRow({ stats, loading, onCardClick }) {
  const safe = stats || {
    appointments: { today: 0, last7Days: 0, allTime: 0 },
    customers: 0,
    agents: 0,
    plans: 0,
  };

  const { appointments, customers, agents, plans } = safe;
  const { today, last7Days, allTime } = appointments || {
    today: 0,
    last7Days: 0,
    allTime: 0,
  };

  const styles = {
    row: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "12px",
      marginBottom: "14px",
    },
    card: (clickable) => ({
      borderRadius: "16px",
      padding: "10px 12px",
      background:
        "radial-gradient(circle at top left, rgba(59,130,246,0.18), rgba(15,23,42,0.98))",
      border: "1px solid rgba(148,163,184,0.55)",
      boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
      cursor: clickable ? "pointer" : "default",
      transition: "transform 0.1s ease, box-shadow 0.1s ease, border-color 0.1s",
    }),
    label: {
      fontSize: "11px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#9ca3af",
      marginBottom: "4px",
    },
    value: {
      fontSize: "22px",
      fontWeight: 600,
      color: "#e5e7eb",
    },
    sub: {
      marginTop: "4px",
      fontSize: "11px",
      color: "#9ca3af",
    },
  };

  const handle = (key) => {
    if (!onCardClick) return;
    onCardClick(key);
  };

  const clickable = !loading;

  return (
    <div style={styles.row}>
      <div
        style={styles.card(clickable)}
        onClick={() => clickable && handle("appointments")}
      >
        <div style={styles.label}>Appointments</div>
        <div style={styles.value}>{today}</div>
        <div style={styles.sub}>
          Today • {last7Days} last 7 days • {allTime} all time
        </div>
      </div>

      <div
        style={styles.card(clickable)}
        onClick={() => clickable && handle("customers")}
      >
        <div style={styles.label}>Customers</div>
        <div style={styles.value}>{customers}</div>
        <div style={styles.sub}>Active registered customers</div>
      </div>

      <div
        style={styles.card(clickable)}
        onClick={() => clickable && handle("agents")}
      >
        <div style={styles.label}>Agents</div>
        <div style={styles.value}>{agents}</div>
        <div style={styles.sub}>Active agents with access</div>
      </div>

      <div
        style={styles.card(clickable)}
        onClick={() => clickable && handle("plans")}
      >
        <div style={styles.label}>Plans</div>
        <div style={styles.value}>{plans}</div>
        <div style={styles.sub}>Active policy plans</div>
      </div>
    </div>
  );
}

export default AdminKpiRow;

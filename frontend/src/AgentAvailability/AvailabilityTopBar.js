import React from "react";

function formatWeekRange(weekStart) {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  end.setDate(start.getDate() + 6);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
}

function AvailabilityTopBar({ view, setView, weekStart, setWeekStart }) {
  const goPrevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const goNextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    setWeekStart(d);
  };

  const styles = {
    bar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    left: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    title: {
      fontSize: "16px",
      fontWeight: 600,
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      color: "#a5b4fc",
    },
    range: {
      fontSize: "13px",
      color: "#9ca3af",
    },
    controls: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    button: {
      borderRadius: "9999px",
      border: "1px solid rgba(148, 163, 184, 0.5)",
      background: "rgba(15, 23, 42, 0.9)",
      color: "#e5e7eb",
      padding: "4px 10px",
      fontSize: "12px",
      cursor: "pointer",
    },
    pill: {
      borderRadius: "9999px",
      border: "1px solid rgba(148, 163, 184, 0.5)",
      background: "rgba(15, 23, 42, 0.9)",
      color: "#e5e7eb",
      padding: "4px 10px",
      fontSize: "12px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    pillActive: {
      background: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(96, 165, 250, 0.9)",
      color: "#bfdbfe",
    },
  };

  const isWeek = view === "week";

  return (
    <div style={styles.bar}>
      <div style={styles.left}>
        <div style={styles.title}>Availability hub</div>
        <div style={styles.range}>{formatWeekRange(weekStart)}</div>
      </div>
      <div style={styles.controls}>
        <button type="button" style={styles.button} onClick={goPrevWeek}>
          ◀ Prev
        </button>
        <button type="button" style={styles.button} onClick={goToday}>
          Today
        </button>
        <button type="button" style={styles.button} onClick={goNextWeek}>
          Next ▶
        </button>
        <button
          type="button"
          style={{
            ...styles.pill,
            ...(isWeek ? styles.pillActive : {}),
          }}
          onClick={() => setView("week")}
        >
          Week view
        </button>
      </div>
    </div>
  );
}

export default AvailabilityTopBar;



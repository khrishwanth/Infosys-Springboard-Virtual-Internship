import React from "react";

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StepAgentSelect({
  openSlots,
  selectedSlot,
  onSelectSlot,
  loadingSlots,
  slotError,
  onNext,
}) {
  const styles = {
    wrapper: { display: "flex", flexDirection: "column", gap: "10px" },
    helper: { fontSize: "12px", color: "#9ca3af" },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "4px",
      maxHeight: "260px",
      overflowY: "auto",
    },
    card: (active) => ({
      borderRadius: "14px",
      border: active
        ? "1px solid rgba(59,130,246,0.9)"
        : "1px solid rgba(31,41,55,0.9)",
      background: active
        ? "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(15,23,42,0.98))"
        : "rgba(15,23,42,0.95)",
      padding: "10px 10px 9px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      cursor: "pointer",
    }),
    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    name: { fontSize: "13px", fontWeight: 600 },
    date: { fontSize: "11px", color: "#9ca3af" },
    meta: { fontSize: "11px", color: "#9ca3af" },
    notes: { fontSize: "11px", color: "#e5e7eb", marginTop: "2px" },
    error: { fontSize: "12px", color: "#fecaca", marginTop: "4px" },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "8px",
      gap: "8px",
    },
    primaryBtn: {
      borderRadius: "9999px",
      padding: "6px 12px",
      fontSize: "13px",
      cursor: "pointer",
      border: "none",
      background: "linear-gradient(135deg, #06b6d4, #2563eb)",
      color: "#f9fafb",
    },
  };

  const handleNext = () => {
    if (!selectedSlot) {
      alert("Please select an agent and slot to continue.");
      return;
    }
    onNext();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.helper}>
        Choose from the list of available agents and time slots below.
      </div>

      {slotError && <div style={styles.error}>{slotError}</div>}
      {loadingSlots && (
        <div style={styles.helper}>Loading available agents and slots…</div>
      )}

      <div style={styles.list}>
        {!loadingSlots && openSlots.length === 0 && (
          <div style={styles.helper}>No open slots found for the next days.</div>
        )}

        {openSlots.map((slot) => {
          const active =
            selectedSlot && selectedSlot.id === slot.id;

          return (
            <div
              key={slot.id}
              style={styles.card(active)}
              onClick={() => onSelectSlot(slot)}
            >
              <div style={styles.titleRow}>
                <div style={styles.name}>{slot.agentName || "Agent"}</div>
                <div style={styles.date}>{formatDateLabel(slot.date)}</div>
              </div>
              <div style={styles.meta}>
                Time: {slot.start}–{slot.end}
              </div>
              {slot.notes && (
                <div style={styles.notes}>Note: {slot.notes}</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={styles.footer}>
        <button type="button" style={styles.primaryBtn} onClick={handleNext}>
          Next: Pick slot →
        </button>
      </div>
    </div>
  );
}

export default StepAgentSelect;




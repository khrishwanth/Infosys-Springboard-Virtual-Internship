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

function StepSlotSelect({
  selectedAgent,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  slotsByDate,
  loadingSlots,
  slotError,
  onBack,
  onNext,
}) {
  const availableDates = Object.keys(slotsByDate).sort();
  const slots = selectedDate ? slotsByDate[selectedDate] || [] : [];

  const styles = {
    wrapper: { display: "flex", flexDirection: "column", gap: "10px" },
    label: { fontSize: "12px", color: "#9ca3af" },
    dateList: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginTop: "6px",
    },
    dateButton: (active) => ({
      borderRadius: "9999px",
      padding: "5px 10px",
      fontSize: "12px",
      cursor: "pointer",
      border: active
        ? "1px solid rgba(59,130,246,0.9)"
        : "1px solid rgba(31,41,55,0.9)",
      background: active
        ? "rgba(30,64,175,0.8)"
        : "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
    }),
    slotsGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "8px",
    },
    slotButton: (active) => ({
      borderRadius: "9999px",
      padding: "5px 10px",
      fontSize: "12px",
      cursor: "pointer",
      border: active
        ? "1px solid rgba(34,197,94,0.9)"
        : "1px solid rgba(31,41,55,0.9)",
      background: active
        ? "rgba(22,163,74,0.9)"
        : "rgba(15,23,42,0.95)",
      color: active ? "#ecfdf5" : "#e5e7eb",
    }),
    helper: { fontSize: "12px", color: "#9ca3af", marginTop: "4px" },
    error: { fontSize: "12px", color: "#fecaca", marginTop: "4px" },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
      gap: "8px",
    },
    secondaryBtn: {
      borderRadius: "9999px",
      padding: "6px 12px",
      fontSize: "13px",
      cursor: "pointer",
      border: "1px solid rgba(148,163,184,0.7)",
      background: "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
    },
    primaryBtn: {
      borderRadius: "9999px",
      padding: "6px 12px",
      fontSize: "13px",
      cursor: "pointer",
      border: "none",
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      color: "#f9fafb",
    },
  };

  const handleNext = () => {
    if (!selectedSlot) {
      alert("Please select a time slot to continue.");
      return;
    }
    onNext();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.label}>
        Viewing availability for{" "}
        <strong>{selectedAgent?.name || "an agent"}</strong>.
      </div>

      <div style={styles.label}>1. Choose a date</div>
      <div style={styles.dateList}>
        {availableDates.map((d) => (
          <button
            key={d}
            type="button"
            style={styles.dateButton(d === selectedDate)}
            onClick={() => {
              setSelectedDate(d);
              setSelectedSlot(null);
            }}
          >
            {formatDateLabel(d)}
          </button>
        ))}
      </div>

      <div style={styles.label}>2. Pick an open slot</div>

      {slotError && <div style={styles.error}>{slotError}</div>}
      {loadingSlots && <div style={styles.helper}>Loading slots…</div>}

      <div style={styles.slotsGrid}>
        {!loadingSlots && slots.length === 0 && (
          <span style={styles.helper}>
            No open slots for the selected date.
          </span>
        )}

        {slots.map((s) => {
          const active =
            selectedSlot &&
            selectedSlot.start === s.start &&
            selectedSlot.end === s.end;
          return (
            <button
              key={s.id}
              type="button"
              style={styles.slotButton(active)}
              onClick={() => setSelectedSlot(s)}
            >
              {s.start}–{s.end}
            </button>
          );
        })}
      </div>

      <div style={styles.footer}>
        <button type="button" style={styles.secondaryBtn} onClick={onBack}>
          ← Back to agents
        </button>
        <button type="button" style={styles.primaryBtn} onClick={handleNext}>
          Next: Details →
        </button>
      </div>
    </div>
  );
}

export default StepSlotSelect;




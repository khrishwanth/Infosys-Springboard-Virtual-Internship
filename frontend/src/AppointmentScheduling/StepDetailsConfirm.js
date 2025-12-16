import React from "react";

function StepDetailsConfirm({
  selectedAgent,
  selectedDate,
  selectedSlot,
  details,
  setDetails,
  onBack,
  onConfirm,     // parent handles API + state
  isConfirming,
}) {
  const handleChange = (field, value) =>
    setDetails((prev) => ({ ...prev, [field]: value }));

  const handleConfirmClick = () => {
    if (!details.reason.trim()) {
      alert("Please provide a brief reason for the appointment.");
      return;
    }
    onConfirm();
  };

  const styles = {
    wrapper: { display: "flex", flexDirection: "column", gap: "10px" },
    row: { display: "flex", flexDirection: "column", gap: "4px" },
    label: { fontSize: "12px", color: "#9ca3af" },
    valueBox: {
      borderRadius: "12px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.95)",
      padding: "8px 10px",
      fontSize: "13px",
    },
    textarea: {
      borderRadius: "12px",
      border: "1px solid rgba(148,163,184,0.6)",
      background: "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
      fontSize: "13px",
      padding: "7px 10px",
      minHeight: "70px",
      resize: "vertical",
      outline: "none",
    },
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
      opacity: isConfirming ? 0.7 : 1,
    },
  };

  const summaryText = selectedSlot
    ? `${selectedDate} · ${selectedSlot.start}–${selectedSlot.end}`
    : selectedDate || "Not selected";

  return (
    <div style={styles.wrapper}>
      <div style={styles.row}>
        <div style={styles.label}>Agent</div>
        <div style={styles.valueBox}>{selectedAgent?.name || "Any agent"}</div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Date & time</div>
        <div style={styles.valueBox}>{summaryText}</div>
      </div>

      <div style={styles.row}>
        <div style={styles.label}>Reason for appointment</div>
        <textarea
          style={styles.textarea}
          value={details.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Briefly describe what you want to discuss…"
        />
      </div>

      <div style={styles.footer}>
        <button type="button" style={styles.secondaryBtn} onClick={onBack}>
          ← Back
        </button>
        <button
          type="button"
          style={styles.primaryBtn}
          onClick={handleConfirmClick}
          disabled={isConfirming}
        >
          {isConfirming ? "Booking…" : "Confirm appointment →"}
        </button>
      </div>
    </div>
  );
}

export default StepDetailsConfirm;


import React, { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
  "20:00",
];

function AvailabilityCalendar({
  view,
  weekStart,
  availability,
  appointments,
  onCreateSlot,
  loading,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    date: "",
    startTime: "10:00",
    endTime: "12:00",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const styles = {
    wrapper: {
      borderRadius: "14px",
      background: "rgba(15, 23, 42, 0.9)",
      border: "1px solid rgba(148, 163, 184, 0.35)",
      overflow: "hidden",
      fontSize: "12px",
    },
    headerRow: {
      display: "grid",
      gridTemplateColumns: "70px repeat(7, 1fr)",
      background: "rgba(15, 23, 42, 0.95)",
      borderBottom: "1px solid rgba(31, 41, 55, 0.85)",
    },
    timeHeader: {
      padding: "8px 10px",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.09em",
      fontSize: "11px",
    },
    dayHeader: {
      padding: "8px 10px",
      textAlign: "center",
      color: "#9ca3af",
      borderLeft: "1px solid rgba(31, 41, 55, 0.85)",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "70px repeat(7, 1fr)",
      borderTop: "1px solid rgba(31, 41, 55, 0.85)",
    },
    timeCell: {
      padding: "6px 10px",
      color: "#6b7280",
    },
    gridCell: {
      borderLeft: "1px solid rgba(31, 41, 55, 0.85)",
      height: "28px",
      position: "relative",
      cursor: "pointer",
      transition: "background 0.12s ease",
    },
    cellBase: {
      width: "100%",
      height: "100%",
    },
    cellAvail: {
      background: "linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.12))",
      boxShadow: "0 0 0 1px rgba(34,197,94,0.3)",
    },
    cellBooked: {
      background: "linear-gradient(135deg, rgba(248,113,113,0.25), rgba(220,38,38,0.12))",
      boxShadow: "0 0 0 1px rgba(248,113,113,0.4)",
    },
    addButtonRow: {
      padding: "8px 10px",
      borderTop: "1px solid rgba(31, 41, 55, 0.85)",
      display: "flex",
      justifyContent: "flex-end",
    },
    addButton: {
      borderRadius: "9999px",
      padding: "4px 10px",
      fontSize: "12px",
      border: "1px solid rgba(96, 165, 250, 0.7)",
      background: "rgba(15, 23, 42, 0.9)",
      color: "#bfdbfe",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    helper: {
      padding: "6px 10px 8px",
      fontSize: "11px",
      color: "#6b7280",
    },
    modalBackdrop: {
      position: "fixed",
      inset: "0",
      background: "rgba(15, 23, 42, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "40",
    },
    modal: {
      width: "100%",
      maxWidth: "420px",
      background:
        "radial-gradient(circle at top left, rgba(56,189,248,0.18), rgba(15,23,42,0.98))",
      borderRadius: "18px",
      border: "1px solid rgba(148, 163, 184, 0.5)",
      boxShadow: "0 24px 60px rgba(15, 23, 42, 0.9)",
      padding: "18px 18px 14px",
      color: "#e5e7eb",
    },
    modalHeader: {
      fontSize: "16px",
      fontWeight: 600,
      marginBottom: "10px",
    },
    modalRow: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      marginBottom: "10px",
    },
    label: {
      fontSize: "12px",
      color: "#9ca3af",
    },
    input: {
      borderRadius: "9999px",
      border: "1px solid rgba(148, 163, 184, 0.7)",
      background: "rgba(15, 23, 42, 0.95)",
      color: "#e5e7eb",
      fontSize: "13px",
      padding: "6px 10px",
      outline: "none",
    },
    textarea: {
      borderRadius: "12px",
      border: "1px solid rgba(148, 163, 184, 0.7)",
      background: "rgba(15, 23, 42, 0.95)",
      color: "#e5e7eb",
      fontSize: "13px",
      padding: "6px 10px",
      outline: "none",
      resize: "vertical",
      minHeight: "60px",
    },
    modalFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
      marginTop: "6px",
    },
    modalBtn: {
      borderRadius: "9999px",
      padding: "6px 12px",
      fontSize: "13px",
      cursor: "pointer",
      border: "1px solid rgba(148, 163, 184, 0.6)",
      background: "rgba(15, 23, 42, 0.95)",
      color: "#e5e7eb",
    },
    modalBtnPrimary: {
      borderRadius: "9999px",
      padding: "6px 12px",
      fontSize: "13px",
      cursor: "pointer",
      border: "none",
      background: "linear-gradient(135deg, #22c55e, #10b981)",
      color: "#f9fafb",
    },
    error: {
      marginTop: "4px",
      fontSize: "12px",
      color: "#fecaca",
    },
  };

  const getDayDate = (dayIndex) => {
    const d = new Date(weekStart);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + dayIndex);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // 0-based
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  // AvailabilityCalendar.js

const openAddModal = (dayIndex, time) => {
  const dateStr = getDayDate(dayIndex);

  // Compute a sensible default end time = start + 30 minutes
  const [h, m] = time.split(":").map(Number);
  const startDate = new Date(0, 0, 1, h, m);
  startDate.setMinutes(startDate.getMinutes() + 30);
  const endH = String(startDate.getHours()).padStart(2, "0");
  const endM = String(startDate.getMinutes()).padStart(2, "0");
  const defaultEnd = `${endH}:${endM}`;

  setModalData({ date: dateStr, startTime: time, endTime: defaultEnd, notes: "" });
  setError("");
  setModalOpen(true);
};

const handleSave = async () => {
  const { date, startTime, endTime, notes } = modalData;
  if (!date || !startTime || !endTime) {
    setError("Please fill date and time range.");
    return;
  }

  // compare times properly
  const toMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  if (toMin(endTime) <= toMin(startTime)) {
    setError("End time must be after start time.");
    return;
  }

  try {
    setSaving(true);
    setError("");
    await onCreateSlot({ date, startTime, endTime, notes });
    setModalOpen(false);
  } catch (err) {
    // you can surface backend message if present
    setError(err.message || "Failed to save slot. Try again.");
  } finally {
    setSaving(false);
  }
};


  const findSlotsForCell = (dateStr, time) => {
    const avail = availability.filter((a) => a.date === dateStr);
    const booked = appointments.filter((a) => a.date === dateStr);

    const inAvail = avail.some(
      (a) => a.startTime === time || a.endTime === time
    );
    const inBooked = booked.some(
      (b) => b.start === time && b.end === time
    );

    return { inAvail, inBooked };
  };

  // const handleSave = async () => {
  //   const { date, startTime, endTime, notes } = modalData;

  //   if (!date || !startTime || !endTime) {
  //     setError("Please fill date and time range.");
  //     return;
  //   }

  //   if (endTime <= startTime) {
  //     setError("End time must be after start time.");
  //     return;
  //   }

  //   try {
  //     setSaving(true);
  //     setError("");
  //     await onCreateSlot({ date, startTime, endTime, notes });
  //     setModalOpen(false);
  //   } catch (err) {
  //     setError("Failed to save slot. Try again.");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const closeModal = () => {
    if (!saving) setModalOpen(false);
  };

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.headerRow}>
          <div style={styles.timeHeader}>Time</div>
          {DAYS.map((d) => (
            <div key={d} style={styles.dayHeader}>
              {d}
            </div>
          ))}
        </div>

        {TIMES.map((t) => (
          <div key={t} style={styles.row}>
            <div style={styles.timeCell}>{t}</div>
            {DAYS.map((d, idx) => {
              const dateStr = getDayDate(idx);
              const { inAvail, inBooked } = findSlotsForCell(dateStr, t);

              let cellStyle = { ...styles.cellBase };
              if (inAvail) cellStyle = { ...cellStyle, ...styles.cellAvail };
              if (inBooked) cellStyle = { ...cellStyle, ...styles.cellBooked };

              return (
                <div
                  key={d}
                  style={styles.gridCell}
                  onClick={() => openAddModal(idx, t)}
                >
                  <div style={cellStyle} />
                </div>
              );
            })}
          </div>
        ))}

        <div style={styles.addButtonRow}>
          <button
            type="button"
            style={styles.addButton}
            onClick={() => setModalOpen(true)}
          >
            + Add availability
          </button>
        </div>

        <div style={styles.helper}>
          Click anywhere in the grid to quickly prefill date and start time,
          then adjust the range in the dialog.
        </div>
      </div>

      {modalOpen && (
        <div style={styles.modalBackdrop} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>Add availability slot</div>

            <div style={styles.modalRow}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={modalData.date}
                style={styles.input}
                onChange={(e) =>
                  setModalData((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <div style={{ flex: "1" }}>
                <label style={styles.label}>Start time</label>
                <input
                  type="time"
                  value={modalData.startTime}
                  style={styles.input}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div style={{ flex: "1" }}>
                <label style={styles.label}>End time</label>
                <input
                  type="time"
                  value={modalData.endTime}
                  style={styles.input}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div style={styles.modalRow}>
              <label style={styles.label}>Notes (optional)</label>
              <textarea
                value={modalData.notes}
                style={styles.textarea}
                onChange={(e) =>
                  setModalData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.modalFooter}>
              <button
                type="button"
                style={styles.modalBtn}
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                style={styles.modalBtnPrimary}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AvailabilityCalendar;




import React from "react";

function totalHours(availability) {
  let minutes = 0;
  availability.forEach((a) => {
    const [sh, sm] = a.startTime.split(":").map(Number);
    const [eh, em] = a.endTime.split(":").map(Number);
    minutes += (eh * 60 + em) - (sh * 60 + sm);
  });
  return (minutes / 60).toFixed(1);
}

function AvailabilitySummary({ availability, loading }) {
  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    title: {
      fontSize: "16px",
      fontWeight: 600,
      marginBottom: "4px",
    },
    line: {
      fontSize: "13px",
      color: "#d1d5db",
    },
    label: {
      color: "#9ca3af",
      marginRight: "4px",
    },
    hint: {
      marginTop: "8px",
      fontSize: "12px",
      color: "#9ca3af",
      lineHeight: 1.5,
    },
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.title}>Availability overview</div>
        <div style={styles.line}>Loading...</div>
      </div>
    );
  }

  const openSlots = availability.filter(
    (a) => !a.status || a.status.toUpperCase() === "OPEN"
  );
  const bookedSlots = availability.filter(
    (a) => a.status && a.status.toUpperCase() === "BOOKED"
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>Availability overview</div>

      <div style={styles.line}>
        <span style={styles.label}>Open slots</span>
        {openSlots.length}
      </div>
      <div style={styles.line}>
        <span style={styles.label}>Booked slots</span>
        {bookedSlots.length}
      </div>
      <div style={styles.line}>
        <span style={styles.label}>Total hours open</span>
        {totalHours(openSlots)} h
      </div>

      <div style={styles.hint}>
        Use the weekly grid to add or adjust your available slots. Customers
        can only book against slots marked as OPEN.
      </div>
    </div>
  );
}

export default AvailabilitySummary;



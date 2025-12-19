import React, { useState, useEffect } from "react";
import { apiFetch } from "../apiClient";
import StepAgentSelect from "./StepAgentSelect";
import StepSlotSelect from "./StepSlotSelect";
import StepDetailsConfirm from "./StepDetailsConfirm";



function AppointmentSchedulingPage({ onGoHome, auth, onLogout, selectedPlan }) {
  const [step, setStep] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [details, setDetails] = useState({
    type: "",
    reason: "",
    plan: "",
    mode: "Call",
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);

  const [slotsByDate, setSlotsByDate] = useState({});
  const [slotError, setSlotError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [openSlots, setOpenSlots] = useState([]);

  const [browseStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const BROWSE_DAYS = 7;

  const toDateString = (d) => d.toISOString().slice(0, 10);

  const handleConfirm = async () => {
  if (!selectedSlot || !selectedAgent) {
    alert("Missing agent or slot.");
    return;
  }

  setIsConfirming(true);
  setError("");

  const body = {
    agentId: selectedAgent.id,
    availabilityId: selectedSlot.id,
    scheduledAt: null,
    reason: details.reason,
    notes: details.notes || "",
  };

  try {
    const resp = await apiFetch(
      "http://localhost:8080/api/appointments/schedule",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    // remove booked slot from UI and show success
    setOpenSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
    setSlotsByDate((prev) => {
      const copy = { ...prev };
      const list = copy[selectedSlot.date] || [];
      copy[selectedSlot.date] = list.filter((s) => s.id !== selectedSlot.id);
      return copy;
    });

    setSuccessInfo({ id: resp.id });
    setStep(1);
    setSelectedAgent(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setDetails({ type: "", reason: "", plan: "", mode: "Call" });
  } catch (e) {
    console.error("Failed to schedule appointment", e);
    setError("Could not schedule appointment. Please try another slot.");
  } finally {
    setIsConfirming(false);
  }
};


  // const loadSlotsForDate = async (dateStr) => {
  //   try {
  //     setLoadingSlots(true);
  //     setSlotError("");
  //     const url = `http://localhost:8080/api/availability/public?date=${dateStr}`;
  //     const list = await apiFetch(url); // list of AgentAvailabilityResponse
  //     setSlotsByDate((prev) => ({
  //       ...prev,
  //       [dateStr]: (list || []).map((a) => ({
  //         id: a.id,
  //         start: a.startTime,
  //         end: a.endTime,
  //       })),
  //     }));
  //   } catch (err) {
  //     console.error("Failed to load public slots", err);
  //     setSlotError("Could not load available slots. Please try again.");
  //   } finally {
  //     setLoadingSlots(false);
  //   }
  // };

  useEffect(() => {
  const datesToFetch = [];
  for (let i = 0; i < BROWSE_DAYS; i++) {
    const d = new Date(browseStart);
    d.setDate(browseStart.getDate() + i);
    datesToFetch.push(toDateString(d));
  }

  const fetchAll = async () => {
    try {
      setLoadingSlots(true);
      setSlotError("");
      const allSlots = [];
      const byDate = {};

      for (const dateStr of datesToFetch) {
        const url = `http://localhost:8080/api/availability/public?date=${dateStr}`;
        const list = await apiFetch(url); // List<AgentAvailabilityResponse>

        const mapped = (list || []).map((a) => ({
          id: a.id,
          date: a.date,
          start: a.startTime,
          end: a.endTime,
          status: a.status,
          notes: a.notes || "",
          agentId: a.agentId,
          agentName: a.agentName,
        }));

        byDate[dateStr] = mapped;
        allSlots.push(...mapped);
      }

      setSlotsByDate(byDate);
      setOpenSlots(allSlots);
      setSelectedDate(toDateString(browseStart));
    } catch (err) {
      console.error("Failed to load public slots", err);
      setSlotError("Could not load available slots. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  };

  fetchAll();
}, [browseStart]);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617, #0f172a)",
      color: "#e5e7eb",
      padding: "80px 24px 40px",
      boxSizing: "border-box",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    shell: { maxWidth: "1100px", margin: "0 auto" },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
    },
    titleBlock: {},
    title: { fontSize: "24px", fontWeight: 600, letterSpacing: "0.02em" },
    subtitle: { fontSize: "14px", color: "#9ca3af", marginTop: "4px" },
    pillButton: {
      borderRadius: "9999px",
      padding: "8px 14px",
      border: "1px solid rgba(148,163,184,0.4)",
      background: "rgba(15,23,42,0.9)",
      color: "#e5e7eb",
      fontSize: "13px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      transition: "background 0.15s ease, border-color 0.15s ease",
    },
    layout: { display: "grid", gridTemplateColumns: "minmax(0, 2fr)", gap: "16px" },
    card: {
      borderRadius: "18px",
      background:
        "radial-gradient(circle at top left, rgba(59,130,246,0.16), rgba(15,23,42,0.96))",
      border: "1px solid rgba(148,163,184,0.45)",
      boxShadow: "0 24px 55px rgba(15,23,42,0.85)",
      padding: "18px 18px 16px",
      boxSizing: "border-box",
    },
    stepHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px",
    },
    stepLabel: {
      fontSize: "13px",
      color: "#9ca3af",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      marginBottom: "4px",
    },
    stepTitle: { fontSize: "18px", fontWeight: 600 },
    stepBadges: { display: "flex", gap: "6px", fontSize: "11px" },
    badge: {
      borderRadius: "9999px",
      padding: "3px 9px",
      border: "1px solid rgba(148,163,184,0.5)",
      color: "#9ca3af",
    },
    footerRow: {
      marginTop: "12px",
      fontSize: "12px",
      color: "#6b7280",
      display: "flex",
      justifyContent: "space-between",
    },
    success: {
      marginTop: "10px",
      padding: "8px 10px",
      borderRadius: "12px",
      background: "rgba(22,163,74,0.12)",
      border: "1px solid rgba(34,197,94,0.5)",
      fontSize: "13px",
      color: "#bbf7d0",
    },
  };

  const pillHover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.background = "rgba(30,64,175,0.85)";
      e.currentTarget.style.borderColor = "rgba(129,140,248,0.9)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = "rgba(15,23,42,0.9)";
      e.currentTarget.style.borderColor = "rgba(148,163,184,0.4)";
    },
  };

  // const handleConfirm = () => {
  //   setIsConfirming(true);
  //   setTimeout(() => {
  //     setIsConfirming(false);
  //     setSuccessInfo({
  //       id: "APT-" + Math.floor(Math.random() * 900000 + 100000),
  //     });
  //     setStep(1);
  //     setSelectedAgent(null);
  //     setSelectedDate("");
  //     setSelectedSlot(null);
  //     setDetails({ type: "", reason: "", plan: "", mode: "Call" });
  //   }, 1000);
  // };

  const currentStepTitle =
    step === 1
      ? "Choose your specialist"
      : step === 2
      ? "Pick a date & slot"
      : "Review & confirm";

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.headerRow}>
          <div style={styles.titleBlock}>
            <div style={styles.title}>Book an appointment</div>
            <div style={styles.subtitle}>
              Follow the three simple steps to schedule a consultation with an
              InsurAI agent.
            </div>
          </div>
          <button
            type="button"
            style={styles.pillButton}
            onClick={onGoHome}
            {...pillHover}
          >
            ⬅ Back to home
          </button>
        </div>

        <div style={styles.layout}>
          <div style={styles.card}>
            <div style={styles.stepHeader}>
              <div>
                <div style={styles.stepLabel}>Step {step} of 3</div>
                <div style={styles.stepTitle}>{currentStepTitle}</div>
              </div>
              <div style={styles.stepBadges}>
                <span style={styles.badge}>
                  {selectedAgent ? selectedAgent.name : "No agent selected"}
                </span>
                {selectedDate && selectedSlot && (
                  <span style={styles.badge}>
                    {selectedDate} · {selectedSlot.start}–{selectedSlot.end}
                  </span>
                )}
              </div>
            </div>

            {step === 1 && (
              <StepAgentSelect
                openSlots={openSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => {
                  setSelectedSlot(slot);
                  setSelectedAgent({
                    id: slot.agentId,
                    name: slot.agentName,
                  });
                  setSelectedDate(slot.date);
                }}
                loadingSlots={loadingSlots}
                slotError={slotError}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <StepSlotSelect
                selectedAgent={selectedAgent}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                slotsByDate={slotsByDate}      
                loadingSlots={loadingSlots}    
                slotError={slotError}          
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <StepDetailsConfirm
                selectedAgent={selectedAgent}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                details={details}
                setDetails={setDetails}
                onBack={() => setStep(2)}
                onConfirm={handleConfirm}
                isConfirming={isConfirming}
              />
            )}

            <div style={styles.footerRow}>
              <span>
                Appointments are free and confirmation details are shared over
                email.
              </span>
              <span>Need help? Contact support from the Help menu.</span>
            </div>

            {successInfo && (
              <div style={styles.success}>
                Appointment booked successfully. Your reference ID is{" "}
                <strong>{successInfo.id}</strong>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentSchedulingPage;

import React from "react";

const STEPS = [
  {
    label: "Step 01",
    title: "Sign up as customer or agent",
    text: "Create your InsurAI profile, set your role and basic preferences.",
  },
  {
    label: "Step 02",
    title: "Discover agents & plans",
    text: "Search by expertise, location, insurer or coverage type.",
  },
  {
    label: "Step 03",
    title: "Book and manage appointments",
    text: "Pick a time that works, reschedule in clicks and keep everyone aligned.",
  },
  {
    label: "Step 04",
    title: "Compare & finalize policies",
    text: "Use AI‑driven comparisons and recommendations to select the right cover.",
  },
  {
    label: "Step 05",
    title: "Track everything in one place",
    text: "Keep documents, renewals, queries and history inside your InsurAI hub.",
  },
];

function HowItWorksSection() {
  return (
    <section className="home-section dark-slab">
      <div className="timeline-root">
        <div>
          <div className="hero-kicker">How it works</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.6rem" }}>
            From query to coverage in a few steps
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#b0b5bd", maxWidth: "28rem" }}>
            InsurAI streamlines the entire journey—from the first question to a
            signed policy and every renewal after—so teams stay focused on
            decisions, not paperwork.
          </p>
        </div>

        <div className="timeline-steps">
          {STEPS.map((s) => (
            <div key={s.label} className="timeline-step">
              <div className="timeline-dot" />
              <div className="step-label">{s.label}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-text">{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;

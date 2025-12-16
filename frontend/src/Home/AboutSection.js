import React from "react";

function AboutSection() {
  return (
    <section className="home-section narrow">
      <div className="two-col">
        <div>
          <div className="badge-pill">
            <span>Since 2025</span>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.9rem 0" }}>
            About InsurAI
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#d1d5db", lineHeight: 1.7 }}>
            InsurAI was built to remove friction from corporate insurance. Our
            team blends experience across underwriting, broking and AI systems
            to provide a single, intuitive workspace for customers, agents and
            admins.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginTop: "0.7rem" }}>
            Rather than forcing users into legacy forms and emails, InsurAI
            starts with voice, modern APIs and clear timelines—so every
            appointment, endorsement and claim is traceable and transparent.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="glass-card" style={{ padding: "1.1rem 1.2rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
              What our customers say
            </div>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: "0.6rem" }}>
              “We reduced email back‑and‑forth by over 60% in the first quarter.
              Our teams finally have a single source of truth for policy and
              appointment history.”
            </p>
            <div style={{ fontSize: "0.8rem", color: "#e5e7eb" }}>
              ★★★★★ &nbsp; Risk &amp; Compliance Lead, Global Manufacturing
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;

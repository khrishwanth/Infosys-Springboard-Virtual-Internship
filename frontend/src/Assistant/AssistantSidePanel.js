import React from "react";

function AssistantSidePanel({ onViewPlans, onSchedule }) {
  return (
    <aside className="assistant-side-panel glass-card">
      <h3 className="assistant-side-title">Quick actions</h3>
      <p className="assistant-side-sub">
        Jump straight to the most common tasks.
      </p>

      <div className="assistant-side-cards">
        <button
          className="assistant-side-card"
          type="button"
          onClick={onViewPlans}
        >
          <div className="assistant-side-icon">🚗</div>
          <div>
            <div className="assistant-side-card-title">
              Show car insurance plans
            </div>
            <div className="assistant-side-card-text">
              View curated plans and coverage options.
            </div>
          </div>
        </button>

        <button
          className="assistant-side-card"
          type="button"
        >
          <div className="assistant-side-icon">📊</div>
          <div>
            <div className="assistant-side-card-title">Compare plans</div>
            <div className="assistant-side-card-text">
              Compare coverage and pricing across companies.
            </div>
          </div>
        </button>

        <button
          className="assistant-side-card"
          type="button"
          onClick={onSchedule}
        >
          <div className="assistant-side-icon">📅</div>
          <div>
            <div className="assistant-side-card-title">
              Book an appointment
            </div>
            <div className="assistant-side-card-text">
              Connect with an agent for a dedicated consultation.
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}

export default AssistantSidePanel;

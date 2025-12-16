import React from "react";
import "../styles/global.css"

function AssistantTopBar({ onGoHome }) {
  return (
    <header className="assistant-topbar">
      <div className="assistant-top-left">
        <span className="assistant-title">Assistant / Help Center</span>
      </div>

      <div className="assistant-top-center">
        <span className="assistant-status-pill">
          <span className="assistant-status-dot" />
          Online
        </span>
      </div>

      <div className="assistant-top-right">
        <button
          className="assistant-icon-btn"
          title="Home"
          onClick={onGoHome}
        >
          🏠
        </button>
      </div>
    </header>
  );
}

export default AssistantTopBar;


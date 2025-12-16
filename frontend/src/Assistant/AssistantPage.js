import React, { useRef } from "react";
import AssistantTopBar from "./AssistantTopBar";
import AssistantChatPanel from "./AssistantChatPanel";
import AssistantSidePanel from "./AssistantSidePanel";

import "../styles/global.css";

function AssistantPage({ onGoHome, onViewPlans, onGoLogin, onGoNotifications }) {
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  return (
    <div className="assistant-root app-root">
      <AssistantTopBar onGoHome={onGoHome} onGoProfile={onGoLogin} 
      onGoNotifications={onGoNotifications} />
      <div className="assistant-main">
        <AssistantChatPanel
          chatRef={chatRef}
          scrollToBottom={scrollToBottom}
          onViewPlans={onViewPlans}
        />
        <AssistantSidePanel
          onViewPlans={onViewPlans}
          onSchedule={() => {}}
        />
      </div>
    </div>
  );
}

export default AssistantPage;


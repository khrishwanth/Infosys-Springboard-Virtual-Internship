import React, { useState, useEffect } from "react";

const initialMessages = [
  {
    id: 1,
    sender: "assistant",
    text: "Hi! I’m the InsurAI assistant. Ask anything about your corporate insurance, appointments or plans.",
    time: "Now",
  },
];

function AssistantChatPanel({ chatRef, scrollToBottom, onViewPlans }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const addMessage = (sender, text) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender, text, time },
    ]);
  };

  const fakeAssistantReply = (userText) => {
    setIsTyping(true);
    setTimeout(() => {
      let reply =
        "Here’s what I found. This is a demo response—backend integration will refine this answer.";
      if (userText.toLowerCase().includes("car")) {
        reply =
          "There are several car insurance plans available. You can view a curated list by using the 'View Plans' button below.";
      } else if (userText.toLowerCase().includes("appointment")) {
        reply =
          "You can schedule an appointment with an agent. Soon this button will open the Appointment Scheduling page.";
      }

      addMessage("assistant", reply);
      setIsTyping(false);
    }, 900);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage("user", text);
    setInput("");
    fakeAssistantReply(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMessage(
        "assistant",
        "Voice recognition is not supported in this browser. Please type your question instead."
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = () => {
      addMessage(
        "assistant",
        "Sorry, I couldn’t catch that. Please try speaking again or type your message."
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="assistant-chat-card glass-card">
      <div className="assistant-chat-header">
        <div>
          <div className="hero-kicker">Ask the assistant</div>
          <h2 className="assistant-chat-title">How can InsurAI help today?</h2>
          <p className="assistant-chat-subtitle">
            Ask about plans, appointments, renewals or anything else regarding
            your corporate cover.
          </p>
        </div>
      </div>

      <div className="assistant-chat-messages" ref={chatRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.sender === "user"
                ? "assistant-msg-row right"
                : "assistant-msg-row left"
            }
          >
            <div
              className={
                m.sender === "user"
                  ? "assistant-bubble user"
                  : "assistant-bubble bot"
              }
            >
              <div className="assistant-bubble-text">{m.text}</div>
              <div className="assistant-bubble-meta">
                {m.sender === "user" ? "You" : "InsurAI Assistant"} · {m.time}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="assistant-msg-row left">
            <div className="assistant-bubble bot">
              <span className="typing-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="assistant-chat-actions">
        <button
          className="btn-outline"
          type="button"
          onClick={onViewPlans}
        >
          View Plans
        </button>
      </div>

      <div className="assistant-input-row">
        <button
          className="assistant-attach-btn"
          type="button"
          title="Attach file (future use)"
        >
          📎
        </button>
        <textarea
          className="assistant-input"
          rows={1}
          placeholder="Type your question here…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={
            "assistant-mic-btn" + (isListening ? " listening" : "")
          }
          title="Speak your question"
          onClick={handleMicClick}
        >
          🎙
        </button>
        <button
          type="button"
          className="assistant-send-btn"
          onClick={handleSend}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default AssistantChatPanel;


import React from "react";

function FooterSection({ onViewPlans, onOpenContact, onOpenAssistant }) {
  return (
    <footer className="footer-root">
      <div className="footer-links">
        <a href="#plans" onClick={onViewPlans}>Plans</a>
        <a href="#faq" onClick={onOpenAssistant}>FAQ</a>
        <a href="#contact" onClick={onOpenContact}>Contact</a>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} InsurAI Corporate Insurance. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;

import React, { useState } from "react";
import "../styles/global.css";

const CATEGORIES = [
  "Appointment Issue",
  "Plan / Policy Question",
  "Account / Login Problem",
  "Feedback / Suggestion",
  "Other",
];

function ContactSupportPage({ onGoHome, onGoAppointments, onGoPlans, onGoFaq }) {
  const [form, setForm] = useState({
    subject: "",
    category: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Please describe your issue or question.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 900);
  };

  const clearForm = () => {
    setForm({
      subject: "",
      category: "",
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setFile(null);
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="contact-root app-root">
      <header className="contact-topbar">
        <div>
          <div className="contact-title">Contact &amp; Support</div>
          <div className="contact-subtitle">
            Reach out for help with appointments, plans, or technical issues.
          </div>
        </div>
      </header>

      <main className="contact-main">
        <section className="contact-form glass-card">
          <form onSubmit={handleSubmit}>
            <label className="contact-label">
              <span>Subject</span>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className={errors.subject ? "contact-input error" : "contact-input"}
                placeholder="Issue with appointment booking, question about car plan, etc."
              />
              {errors.subject && <div className="contact-error">{errors.subject}</div>}
            </label>

            <label className="contact-label">
              <span>Category</span>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={errors.category ? "contact-input error" : "contact-input"}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <div className="contact-error">{errors.category}</div>}
            </label>

            <label className="contact-label">
              <span>Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="contact-input"
                placeholder="Your name"
              />
            </label>

            <label className="contact-label">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={errors.email ? "contact-input error" : "contact-input"}
                placeholder="you@example.com"
              />
              {errors.email && <div className="contact-error">{errors.email}</div>}
            </label>

            <label className="contact-label">
              <span>Phone (optional)</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="contact-input"
                placeholder="For callback if needed"
              />
            </label>

            <label className="contact-label">
              <span>Message</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className={errors.message ? "contact-input error" : "contact-input"}
                placeholder="Describe your issue or question in detail…"
              />
              {errors.message && <div className="contact-error">{errors.message}</div>}
            </label>

            <label className="contact-label">
              <span>Attachment (optional)</span>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="contact-file"
              />
              {file && (
                <div className="contact-file-info">
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </label>

            {success && (
              <div className="contact-success">
                Your request has been submitted. We will contact you using the email or phone you provided.
              </div>
            )}

            <div className="contact-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={clearForm}
              >
                Clear form
              </button>
            </div>
          </form>
        </section>

        <aside className="contact-side">
          <div className="glass-card contact-side-card">
            <h3>Support information</h3>
            <p>Support hours: Mon–Sat, 9:00 AM – 6:00 PM IST</p>
            <p>Typical response time: within 24 hours.</p>
            <p>Email: support@insurai.example</p>
            <p>Phone / WhatsApp: +91-90000-00000</p>
          </div>

          <div className="glass-card contact-side-card">
            <h3>Quick links</h3>
            <button
              type="button"
              className="btn-outline"
              onClick={onGoFaq}
            >
              View FAQ / Assistant
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={onGoAppointments}
            >
              Check Appointment Status
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={onGoPlans}
            >
              Browse Plans
            </button>
          </div>

          <div className="glass-card contact-side-card">
            <h3>System status</h3>
            <p>All systems operational.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default ContactSupportPage;

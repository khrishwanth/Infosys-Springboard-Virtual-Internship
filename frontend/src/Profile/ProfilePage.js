import React, { useEffect, useState } from "react";
import { apiFetch } from "../apiClient";

function ProfilePage({ onGoHome, auth }) {
  const [tab, setTab] = useState("Profile");

  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const role = auth?.role || profile?.role || "CUSTOMER";

  // Load profile + settings on mount
  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    setLoadError("");
    try {
      const [pJson, sJson] = await Promise.all([
        apiFetch("http://localhost:8080/api/profile/me"),
        apiFetch("http://localhost:8080/api/profile/settings"),
      ]);
      if (!cancelled) {
        setProfile(pJson);
        setSettings(sJson);
      }
    } catch (err) {
      console.error("Profile load error", err);
      if (!cancelled) {
        setLoadError(err.message || "Failed to load profile");
      }
    }
  };

  load();
  return () => {
    cancelled = true;
  };
}, []);

  const handleProfileField = (field, value) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSaveMessage("");
    setSaveError("");
  };

  const handleSettingsField = (field, value) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSaveMessage("");
    setSaveError("");
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSavingProfile(true);
    setSaveError("");
    setSaveMessage("");

    const body = {
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      experienceYears: profile.experienceYears,
      companyName: profile.companyName,
      specialties: profile.specialties,
    };

    try {
      const updated = await apiFetch("http://localhost:8080/api/profile/me", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setProfile(updated);

      setSaveMessage("Profile saved successfully.");
    } catch (err) {
      setSaveError(err.message || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    setSaveError("");
    setSaveMessage("");

    const body = {
      notifyApptInApp: settings.notifyApptInApp,
      notifyApptEmail: settings.notifyApptEmail,
      notifyApptSms: settings.notifyApptSms,
      notifyPromoEmail: settings.notifyPromoEmail,
      accentColor: settings.accentColor,
      dateFormat: settings.dateFormat,
      timeFormat: settings.timeFormat,
    };

    try {
      const updated = await apiFetch("http://localhost:8080/api/profile/settings", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setSettings(updated);
      setSaveMessage("Preferences saved successfully.");
    } catch (err) {
      console.error("Save settings error", err);
      setSaveError(err.message || "Failed to save preferences.");
    } finally {
      setSavingSettings(false);
    }
  };

  const isLoading = !profile || !settings;

  const roleLabel =
    role === "ADMIN" ? "Admin" : role === "AGENT" ? "Agent" : "Customer";

  return (
    <div style={s.pageRoot}>
      <div style={s.topBar}>
        <h1 style={s.topTitle}>Account &amp; Profile</h1>
        <span style={s.rolePill}>{roleLabel}</span>
      </div>

      {loadError && <div style={s.errorBanner}>{loadError}</div>}

      <div style={s.shell}>
        <div style={s.tabRow}>
          {["Profile", "Security", "Preferences"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setSaveMessage("");
                setSaveError("");
              }}
              style={
                tab === t ? { ...s.tabBtn, ...s.tabBtnActive } : s.tabBtn
              }
            >
              {t === "Profile"
                ? "Profile overview"
                : t === "Security"
                ? "Security"
                : "Notifications & UI"}
            </button>
          ))}
        </div>

        <div style={s.card}>
          {isLoading ? (
            <p style={s.muted}>Loading profile…</p>
          ) : (
            <>
              {tab === "Profile" && (
                <ProfileTab
                  profile={profile}
                  role={role}
                  onFieldChange={handleProfileField}
                  onSave={handleSaveProfile}
                  saving={savingProfile}
                />
              )}

              {tab === "Security" && <SecurityTab />}

              {tab === "Preferences" && (
                <PreferencesTab
                  settings={settings}
                  onFieldChange={handleSettingsField}
                  onSave={handleSaveSettings}
                  saving={savingSettings}
                />
              )}

              {(saveMessage || saveError) && (
                <div
                  style={
                    saveError
                      ? { ...s.saveBanner, ...s.saveBannerError }
                      : { ...s.saveBanner, ...s.saveBannerSuccess }
                  }
                >
                  {saveError || saveMessage}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ profile, role, onFieldChange, onSave, saving }) {
  const isAgent = role === "AGENT";
  const isCustomer = role === "CUSTOMER";

  return (
    <section>
      <h2 style={s.sectionTitle}>Personal information</h2>

      {isAgent && (
        <p style={s.infoBadge}>
          As an agent, your profile is visible to customers when they book
          appointments.
        </p>
      )}

      <div style={s.formGrid}>
        <label style={s.field}>
          <span style={s.fieldLabel}>Full name</span>
          <input
            style={s.input}
            value={profile.name || ""}
            onChange={(e) => onFieldChange("name", e.target.value)}
          />
        </label>

        <label style={s.field}>
          <span style={s.fieldLabel}>Email</span>
          <input style={s.input} value={profile.email || ""} disabled />
        </label>

        <label style={s.field}>
          <span style={s.fieldLabel}>Phone</span>
          <input
            style={s.input}
            value={profile.phone || ""}
            onChange={(e) => onFieldChange("phone", e.target.value)}
          />
        </label>

        <label style={s.field}>
          <span style={s.fieldLabel}>Location</span>
          <input
            style={s.input}
            value={profile.location || ""}
            onChange={(e) => onFieldChange("location", e.target.value)}
          />
        </label>

        <label style={{ ...s.field, gridColumn: "1 / -1" }}>
          <span style={s.fieldLabel}>Short bio</span>
          <textarea
            style={s.textarea}
            rows={3}
            value={profile.bio || ""}
            onChange={(e) => onFieldChange("bio", e.target.value)}
          />
        </label>

        {isAgent && (
          <>
            <label style={s.field}>
              <span style={s.fieldLabel}>Years of experience</span>
              <input
                type="number"
                min="0"
                style={s.input}
                value={profile.experienceYears ?? ""}
                onChange={(e) =>
                  onFieldChange(
                    "experienceYears",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            </label>

            <label style={{ ...s.field, gridColumn: "1 / -1" }}>
              <span style={s.fieldLabel}>Specialties</span>
              <input
                style={s.input}
                placeholder="e.g. Group Health, Motor Fleet"
                value={profile.specialties || ""}
                onChange={(e) => onFieldChange("specialties", e.target.value)}
              />
            </label>
          </>
        )}

        {isCustomer && (
          <label style={s.field}>
            <span style={s.fieldLabel}>Company name</span>
            <input
              style={s.input}
              value={profile.companyName || ""}
              onChange={(e) => onFieldChange("companyName", e.target.value)}
            />
          </label>
        )}
      </div>

      <button
        type="button"
        style={s.primarySaveBtn}
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </section>
  );
}

function SecurityTab() {
  return (
    <section>
      <h2 style={s.sectionTitle}>Security</h2>
      <h3 style={s.subTitle}>Login activity</h3>
      <p style={s.bodyText}>
        Last login: Today, 10:12 AM from Hyderabad, India.
      </p>
      <p style={s.muted}>
        Future enhancement: show recent devices, revoke sessions, and enable
        two‑factor authentication.
      </p>
    </section>
  );
}

function PreferencesTab({ settings, onFieldChange, onSave, saving }) {
  const toggle = (field) =>
    onFieldChange(field, !settings[field]);

  const setAccent = (value) => onFieldChange("accentColor", value);
  const setDate = (value) => onFieldChange("dateFormat", value);
  const setTime = (value) => onFieldChange("timeFormat", value);

  return (
    <section>
      <h2 style={s.sectionTitle}>Notification &amp; UI preferences</h2>

      <h3 style={s.subTitle}>Notification preferences</h3>

      <ToggleRow
        title="Appointment Updates"
        description="Reminders, new bookings, reschedules and cancellations."
        active={!!settings.notifyApptInApp}
        onToggle={() => toggle("notifyApptInApp")}
      />

      <ToggleRow
        title="Appointment Emails"
        description="Receive appointment updates via email."
        active={!!settings.notifyApptEmail}
        onToggle={() => toggle("notifyApptEmail")}
      />

      <ToggleRow
        title="Appointment SMS"
        description="Last‑minute reminders and critical updates."
        active={!!settings.notifyApptSms}
        onToggle={() => toggle("notifyApptSms")}
      />

      <ToggleRow
        title="Promotional emails"
        description="New plans, offers and product updates."
        active={!!settings.notifyPromoEmail}
        onToggle={() => toggle("notifyPromoEmail")}
      />

      <h3 style={{ ...s.subTitle, marginTop: "1.8rem" }}>
        UI preferences
      </h3>

      <div style={s.uiRow}>
        <div>
          <div style={s.fieldLabel}>Accent color</div>
          <p style={s.muted}>
            Personalize highlight color in the interface.
          </p>
        </div>
        <div style={s.accentRow}>
          {["teal", "blue", "purple", "green"].map((c) => (
            <button
              key={c}
              type="button"
              style={{
                ...s.accentDot,
                ...(settings.accentColor === c ? s.accentDotActive : null),
                background:
                  c === "teal"
                    ? "#14b8a6"
                    : c === "blue"
                    ? "#3b82f6"
                    : c === "purple"
                    ? "#a855f7"
                    : "#22c55e",
              }}
              onClick={() => setAccent(c)}
            />
          ))}
        </div>
      </div>

      <div style={s.uiRow}>
        <div>
          <div style={s.fieldLabel}>Date format</div>
          <p style={s.muted}>How dates appear across the app.</p>
        </div>
        <select
          style={s.select}
          value={settings.dateFormat || "DD-MM-YYYY"}
          onChange={(e) => setDate(e.target.value)}
        >
          <option value="DD-MM-YYYY">DD-MM-YYYY</option>
          <option value="MM-DD-YYYY">MM-DD-YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div style={s.uiRow}>
        <div>
          <div style={s.fieldLabel}>Time format</div>
          <p style={s.muted}>How times appear across the app.</p>
        </div>
        <select
          style={s.select}
          value={settings.timeFormat || "24h"}
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="24h">24-hour</option>
          <option value="12h">12-hour</option>
        </select>
      </div>

      <button
        type="button"
        style={s.primarySaveBtn}
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save preferences"}
      </button>
    </section>
  );
}

function ToggleRow({ title, description, active, onToggle }) {
  return (
    <div style={s.toggleRow}>
      <div>
        <div style={s.toggleTitle}>{title}</div>
        <p style={s.muted}>{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        style={active ? { ...s.toggleBtn, ...s.toggleBtnOn } : s.toggleBtn}
      >
        {active ? "On" : "Off"}
      </button>
    </div>
  );
}

// ---- Inline styles (same aesthetic as previous answer) ----

const s = {
  pageRoot: {
    minHeight: "100vh",
    padding: "1.8rem 6vw 3rem",
    background:
      "radial-gradient(circle at top, #111827 0, #020617 45%, #000000 100%)",
    color: "#f9fafb",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.6rem",
  },
  backBtn: {
    borderRadius: 999,
    border: "1px solid rgba(55,65,81,0.9)",
    padding: "0.45rem 1rem",
    background: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  topTitle: {
    fontSize: "1.6rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  rolePill: {
    borderRadius: 999,
    padding: "0.3rem 0.9rem",
    fontSize: "0.8rem",
    background: "rgba(37,99,235,0.18)",
    border: "1px solid rgba(59,130,246,0.7)",
    color: "#bfdbfe",
  },
  shell: {
    marginTop: "0.6rem",
  },
  tabRow: {
    display: "inline-flex",
    padding: "0.25rem",
    borderRadius: 999,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(55,65,81,0.9)",
    marginBottom: "1.3rem",
  },
  tabBtn: {
    border: "none",
    borderRadius: 999,
    padding: "0.4rem 1.1rem",
    fontSize: "0.8rem",
    background: "transparent",
    color: "#9ca3af",
    cursor: "pointer",
  },
  tabBtnActive: {
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(129,140,248,0.9))",
    color: "#f9fafb",
    boxShadow: "0 0 18px rgba(37,99,235,0.7)",
  },
  card: {
    marginTop: "0.4rem",
    padding: "1.8rem 2rem 2rem",
    borderRadius: 24,
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(31,41,55,0.9)",
    boxShadow: "0 30px 70px rgba(0,0,0,0.9)",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "1.2rem",
  },
  subTitle: {
    fontSize: "1rem",
    fontWeight: 500,
    marginTop: "0.8rem",
    marginBottom: "0.4rem",
  },
  infoBadge: {
    fontSize: "0.85rem",
    color: "#bbf7d0",
    background: "rgba(22,163,74,0.12)",
    border: "1px solid rgba(34,197,94,0.6)",
    padding: "0.4rem 0.7rem",
    borderRadius: 10,
    marginBottom: "1rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem 1.4rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  fieldLabel: {
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#9ca3af",
  },
  input: {
    borderRadius: 12,
    border: "1px solid rgba(55,65,81,0.9)",
    padding: "0.6rem 0.85rem",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    outline: "none",
  },
  textarea: {
    borderRadius: 14,
    border: "1px solid rgba(55,65,81,0.9)",
    padding: "0.7rem 0.9rem",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    resize: "vertical",
    minHeight: 80,
  },
  bodyText: {
    fontSize: "0.9rem",
    color: "#e5e7eb",
  },
  muted: {
    fontSize: "0.82rem",
    color: "#9ca3af",
  },
  toggleRow: {
    marginTop: "0.8rem",
    padding: "0.75rem 0.9rem",
    borderRadius: 16,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(31,41,55,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.2rem",
  },
  toggleTitle: {
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  toggleBtn: {
    borderRadius: 999,
    border: "1px solid rgba(75,85,99,0.9)",
    padding: "0.32rem 0.9rem",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  toggleBtnOn: {
    background:
      "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)",
    borderColor: "transparent",
    color: "#052e16",
  },
  uiRow: {
    marginTop: "1rem",
    padding: "0.9rem 0.9rem",
    borderRadius: 16,
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(31,41,55,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
  },
  accentRow: {
    display: "flex",
    gap: "0.6rem",
  },
  accentDot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    border: "2px solid transparent",
    cursor: "pointer",
  },
  accentDotActive: {
    boxShadow: "0 0 12px rgba(96,165,250,0.9)",
    borderColor: "#e5e7eb",
  },
  select: {
    borderRadius: 999,
    border: "1px solid rgba(55,65,81,0.9)",
    padding: "0.45rem 0.9rem",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "0.86rem",
  },
  primarySaveBtn: {
    marginTop: "1.4rem",
    borderRadius: 999,
    border: "none",
    padding: "0.75rem 1.4rem",
    background:
      "linear-gradient(135deg, #3b82f6 0%, #6366f1 40%, #8b5cf6 100%)",
    color: "#f9fafb",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  errorBanner: {
    marginBottom: "0.8rem",
    padding: "0.7rem 0.9rem",
    borderRadius: 10,
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.6)",
    color: "#fecaca",
    fontSize: "0.84rem",
  },
  saveBanner: {
    marginTop: "1.3rem",
    padding: "0.6rem 0.9rem",
    borderRadius: 10,
    fontSize: "0.84rem",
  },
  saveBannerSuccess: {
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.7)",
    color: "#bbf7d0",
  },
  saveBannerError: {
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.7)",
    color: "#fecaca",
  },
};

export default ProfilePage;



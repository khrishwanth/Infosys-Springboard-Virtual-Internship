import React, { useEffect, useState } from "react";
import { apiFetch } from "../apiClient";

function NotificationsPage({ onGoHome, auth }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selected, setSelected] = useState(null);

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
    shell: { maxWidth: "1400px", margin: "0 auto" },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
    },
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
    layout: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 2.4fr) minmax(0, 1.3fr)",
      gap: "16px",
      alignItems: "flex-start",
    },
    card: {
      borderRadius: "18px",
      background:
        "radial-gradient(circle at top left, rgba(59,130,246,0.16), rgba(15,23,42,0.96))",
      border: "1px solid rgba(148,163,184,0.45)",
      boxShadow: "0 24px 55px rgba(15,23,42,0.85)",
      padding: "16px 16px 12px",
      boxSizing: "border-box",
    },
    filtersRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "10px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    input: {
      flex: "1 1 220px",
      borderRadius: "9999px",
      border: "1px solid rgba(148,163,184,0.5)",
      background: "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
      fontSize: "13px",
      padding: "7px 11px",
      outline: "none",
    },
    select: {
      borderRadius: "9999px",
      border: "1px solid rgba(148,163,184,0.5)",
      background: "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
      fontSize: "13px",
      padding: "7px 11px",
      outline: "none",
    },
    notificationsList: {
      borderRadius: "14px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.95)",
      overflow: "auto",
      fontSize: "13px",
      maxHeight: "600px",
    },
    notificationRow: (isUnread, isSelected) => ({
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: "10px",
      padding: "12px 14px",
      borderBottom: "1px solid rgba(31,41,55,0.9)",
      cursor: "pointer",
      background: isSelected
        ? "rgba(59,130,246,0.2)"
        : isUnread
        ? "rgba(59,130,246,0.08)"
        : "transparent",
      transition: "background 0.15s ease",
      alignItems: "center",
    }),
    notificationIcon: {
      width: "36px",
      height: "36px",
      minWidth: "36px",
      borderRadius: "9999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
    },
    notificationCenter: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      minWidth: "0",
    },
    notificationTitle: {
      fontSize: "13px",
      fontWeight: 600,
      color: "#e5e7eb",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    notificationMessage: {
      fontSize: "12px",
      color: "#9ca3af",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    notificationTime: {
      fontSize: "11px",
      color: "#6b7280",
    },
    unreadDot: {
      width: "8px",
      height: "8px",
      borderRadius: "9999px",
      background: "#3b82f6",
      boxShadow: "0 0 10px rgba(59,130,246,0.8)",
    },
    emptyState: {
      padding: "30px",
      textAlign: "center",
      color: "#9ca3af",
      fontSize: "14px",
    },
    error: {
      marginTop: "8px",
      padding: "6px 10px",
      borderRadius: "10px",
      background: "rgba(239, 68, 68, 0.12)",
      border: "1px solid rgba(248, 113, 113, 0.6)",
      color: "#fecaca",
      fontSize: "13px",
    },
    sideTitle: { fontSize: "14px", fontWeight: 600, marginBottom: "8px" },
    sideLabel: { fontSize: "11px", color: "#9ca3af", marginTop: "8px" },
    sideValue: { fontSize: "13px", marginTop: "3px", color: "#e5e7eb" },
    sideBadge: {
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "9999px",
      padding: "3px 9px",
      border: "1px solid rgba(148,163,184,0.5)",
      color: "#9ca3af",
      fontSize: "11px",
      marginRight: "6px",
      marginTop: "4px",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      cursor: "pointer",
    },
    checkbox: {
      width: "16px",
      height: "16px",
      borderRadius: "4px",
      border: "1px solid rgba(148,163,184,0.5)",
      cursor: "pointer",
    },
  };

  // Load notifications on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const url = "http://localhost:8080/api/notifications/me";
        const list = await apiFetch(url);

        if (cancelled) return;

        const mapped = (list || []).map((n) => ({
          id: n.id,
          type: n.type || "INFO",
          title: n.title || "Notification",
          message: n.message || "",
          createdAt: n.createdAt,
          isRead: n.read || false,
          data: n.data || {},
        }));

        setNotifications(mapped);
        if (mapped.length > 0) {
          setSelected(mapped[0]);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
        if (!cancelled) {
          setError("Could not load notifications. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getTypeColor = (type) => {
    const t = (type || "INFO").toUpperCase();
    if (t === "APPOINTMENT") return "#3b82f6";
    if (t === "APPOINTMENT_STATUS_CHANGED") return "#f59e0b";
    if (t === "PROMOTION") return "#f59e0b";
    if (t === "ALERT") return "#ef4444";
    if (t === "SUCCESS") return "#10b981";
    return "#6b7280";
  };

  const getTypeIcon = (type) => {
    const t = (type || "INFO").toUpperCase();
    if (t === "APPOINTMENT") return "📅";
    if (t === "APPOINTMENT_STATUS_CHANGED") return "📋";
    if (t === "PROMOTION") return "🎁";
    if (t === "ALERT") return "⚠️";
    if (t === "SUCCESS") return "✅";
    return "ℹ️";
  };

  const formatTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const filtered = notifications.filter((n) => {
    const q = search.trim().toLowerCase();
    const textMatch =
      !q ||
      (n.title || "").toLowerCase().includes(q) ||
      (n.message || "").toLowerCase().includes(q);
    const typeMatch =
      typeFilter === "All"
        ? true
        : (n.type || "").toUpperCase() === typeFilter.toUpperCase();
    const readMatch = unreadOnly ? !n.isRead : true;
    return textMatch && typeMatch && readMatch;
  });

  const markNotificationAsRead = async (notificationId) => {
    try {
      const body = { notificationId };
      await apiFetch("http://localhost:8080/api/notifications/mark-read", {
        method: "POST",
        body: JSON.stringify(body),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );

      setSelected((prev) =>
        prev && prev.id === notificationId
          ? { ...prev, isRead: true }
          : prev
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleRowClick = (notif) => {
    setSelected(notif);
    if (!notif.isRead) {
      markNotificationAsRead(notif.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiFetch("http://localhost:8080/api/notifications/mark-all-read", {
        method: "POST",
        body: JSON.stringify({}),
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setSelected((prev) =>
        prev ? { ...prev, isRead: true } : prev
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
      alert("Could not mark all as read. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.title}>Notifications</div>
            <div style={styles.subtitle}>
              Stay updated with appointments, promotions, and important alerts.
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              style={styles.pillButton}
              onClick={handleMarkAllAsRead}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(30,64,175,0.85)";
                e.currentTarget.style.borderColor = "rgba(129,140,248,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(15,23,42,0.9)";
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.4)";
              }}
            >
              ✓ Mark all read
            </button>
          </div>
        </div>

        <div style={styles.layout}>
          {/* Left: Notifications list */}
          <div style={styles.card}>
            <div style={styles.filtersRow}>
              <input
                style={styles.input}
                placeholder="Search notifications…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                style={styles.select}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All types</option>
                <option value="APPOINTMENT">Appointments</option>
                <option value="PROMOTION">Promotions</option>
                <option value="ALERT">Alerts</option>
                <option value="SUCCESS">Success</option>
              </select>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                />
                Unread only
              </label>
            </div>

            <div style={styles.notificationsList}>
              {loading ? (
                <div style={styles.emptyState}>Loading notifications…</div>
              ) : filtered.length === 0 ? (
                <div style={styles.emptyState}>No notifications found.</div>
              ) : (
                filtered.map((n) => {
                  const isSelected = selected && selected.id === n.id;
                  const isUnread = !n.isRead;
                  return (
                    <div
                      key={n.id}
                      style={styles.notificationRow(isUnread, isSelected)}
                      onClick={() => handleRowClick(n)}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background =
                            "rgba(31,41,55,0.6)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = isUnread
                            ? "rgba(59,130,246,0.08)"
                            : "transparent";
                        }
                      }}
                    >
                      <div
                        style={{
                          ...styles.notificationIcon,
                          background: getTypeColor(n.type) + "22",
                          color: getTypeColor(n.type),
                        }}
                      >
                        {getTypeIcon(n.type)}
                      </div>

                      <div style={styles.notificationCenter}>
                        <div style={styles.notificationTitle}>
                          {n.title}
                        </div>
                        <div style={styles.notificationMessage}>
                          {n.message}
                        </div>
                        <div style={styles.notificationTime}>
                          {formatTime(n.createdAt)}
                        </div>
                      </div>

                      {!n.isRead && <div style={styles.unreadDot} />}
                    </div>
                  );
                })
              )}
            </div>

            {error && <div style={styles.error}>{error}</div>}
          </div>

          {/* Right: Notification details */}
          <div style={styles.card}>
            <div style={styles.sideTitle}>
              Notification details
              {selected && (
                <span style={styles.sideBadge}>ID {selected.id}</span>
              )}
            </div>
            {selected ? (
              <>
                <div style={styles.sideLabel}>Type</div>
                <div style={styles.sideValue}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      background: getTypeColor(selected.type) + "22",
                      color: getTypeColor(selected.type),
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {getTypeIcon(selected.type)} {selected.type || "INFO"}
                  </span>
                </div>

                <div style={styles.sideLabel}>Title</div>
                <div style={styles.sideValue}>{selected.title}</div>

                <div style={styles.sideLabel}>Message</div>
                <div style={styles.sideValue}>
                  {selected.message || "No message provided"}
                </div>

                <div style={styles.sideLabel}>Time</div>
                <div style={styles.sideValue}>
                  {new Date(selected.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div style={styles.sideLabel}>Status</div>
                <div style={styles.sideValue}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 8px",
                      borderRadius: "9999px",
                      background: selected.isRead
                        ? "rgba(107,114,128,0.2)"
                        : "rgba(59,130,246,0.2)",
                      color: selected.isRead ? "#9ca3af" : "#3b82f6",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "9999px",
                        background: selected.isRead ? "#9ca3af" : "#3b82f6",
                      }}
                    />
                    {selected.isRead ? "Read" : "Unread"}
                  </span>
                </div>

                {selected.data && Object.keys(selected.data).length > 0 && (
                  <>
                    <div style={styles.sideLabel}>Additional info</div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        marginTop: "4px",
                        padding: "8px",
                        borderRadius: "8px",
                        background: "rgba(15,23,42,0.95)",
                        maxHeight: "120px",
                        overflowY: "auto",
                      }}
                    >
                      <pre
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          color: "#d1d5db",
                        }}
                      >
                        {JSON.stringify(selected.data, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                Select a notification to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;

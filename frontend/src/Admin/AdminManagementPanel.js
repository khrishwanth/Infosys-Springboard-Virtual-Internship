import React, { useEffect, useState } from "react";
import { apiFetch } from "../apiClient";

function AdminManagementPanel({ mode = "users", onSelectItem }) {
  const [activeTab, setActiveTab] = useState(mode); // "users" | "policies"
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [roleUpdateLoadingId, setRoleUpdateLoadingId] = useState(null);
  const [statusUpdateLoadingId, setStatusUpdateLoadingId] = useState(null);
  const [planEdit, setPlanEdit] = useState(null); // {id?, name, category, premiumAmount, coverageAmount, active, description}
  const [planSaving, setPlanSaving] = useState(false);

  const [userStats, setUserStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const [planFile, setPlanFile] = useState(null);


  const styles = {
    shell: {
      marginTop: "16px",
      borderRadius: "18px",
      background:
        "radial-gradient(circle at top left, rgba(59,130,246,0.16), rgba(15,23,42,0.96))",
      border: "1px solid rgba(148,163,184,0.45)",
      boxShadow: "0 24px 55px rgba(15,23,42,0.85)",
      padding: "14px 16px 12px",
      boxSizing: "border-box",
      color: "#e5e7eb",
      fontSize: "13px",
    },
    tabsRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "10px",
    },
    tab: (active) => ({
      borderRadius: "9999px",
      padding: "6px 12px",
      fontSize: "13px",
      border: active
        ? "1px solid rgba(59,130,246,0.9)"
        : "1px solid rgba(148,163,184,0.5)",
      background: active ? "rgba(37,99,235,0.35)" : "rgba(15,23,42,0.95)",
      color: active ? "#e5e7eb" : "#9ca3af",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    }),
    tableWrapper: {
      borderRadius: "14px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.95)",
      overflow: "auto",
      maxHeight: "520px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px",
    },
    th: {
      textAlign: "left",
      padding: "14px 12px",
      borderBottom: "1px solid rgba(31,41,55,0.9)",
      color: "#9ca3af",
      fontWeight: 500,
      whiteSpace: "nowrap",
    },
    td: {
      padding: "9px 12px",
      borderBottom: "1px solid rgba(31,41,55,0.7)",
      whiteSpace: "nowrap",
    },
    badge: (color) => ({
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "9999px",
      padding: "2px 8px",
      border: `1px solid ${color}`,
      fontSize: "11px",
      color,
    }),
    pillButton: {
      borderRadius: "9999px",
      padding: "4px 10px",
      border: "1px solid rgba(148,163,184,0.6)",
      background: "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
      fontSize: "11px",
      cursor: "pointer",
    },
    error: {
      marginTop: "6px",
      padding: "6px 10px",
      borderRadius: "10px",
      background: "rgba(239, 68, 68, 0.12)",
      border: "1px solid rgba(248, 113, 113, 0.6)",
      color: "#fecaca",
      fontSize: "12px",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
    },
    sectionTitle: {
      fontSize: "13px",
      fontWeight: 600,
    },
    smallText: {
      fontSize: "11px",
      color: "#9ca3af",
    },
    input: {
      width: "100%",
      borderRadius: "9999px",
      border: "1px solid rgba(148,163,184,0.5)",
      background: "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
      fontSize: "12px",
      padding: "6px 10px",
      outline: "none",
      marginBottom: "6px",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      borderRadius: "10px",
      border: "1px solid rgba(148,163,184,0.5)",
      background: "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
      fontSize: "12px",
      padding: "6px 10px",
      outline: "none",
      marginBottom: "6px",
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "60px",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      marginBottom: "6px",
    },
    formActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
      marginTop: "4px",
    },
    toggle: {
      cursor: "pointer",
      borderRadius: "9999px",
      padding: "3px 8px",
      border: "1px solid rgba(148,163,184,0.6)",
      fontSize: "11px",
      background: "rgba(15,23,42,0.95)",
      color: "#e5e7eb",
    },
    disabledButton: {
      opacity: 0.5,
      cursor: "default",
    },
    chartCard: {
      marginTop: "16px",
      borderRadius: "14px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.95)",
      padding: "12px 14px",
      boxSizing: "border-box",
    },
    chartTitle: {
      fontSize: "13px",
      fontWeight: 600,
      marginBottom: "6px",
    },
    chartCanvas: {
      position: "relative",
      width: "100%",
      height: "120px",
    },
    chartSvg: {
      width: "100%",
      height: "100%",
    },
    chartLine: {
      fill: "none",
      strokeWidth: 2,
    },
    chartAxisLabel: {
      fontSize: "10px",
      fill: "#6b7280",
    },
  };

  const visibleUsers =
    activeTab === "users"
      ? users
      : users.filter((u) => u.role === "AGENT");

  useEffect(() => {
    let cancelled = false;
    setActiveTab(mode);
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        if (mode === "users") {
          const data = await apiFetch("http://localhost:8080/api/admin/users");
          if (cancelled) return;
          setUsers(Array.isArray(data) ? data : []);
        } else {
          const data = await apiFetch("http://localhost:8080/api/admin/policies");
          if (cancelled) return;
          setPlans(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load admin data", err);
        if (!cancelled) setError("Could not load admin data. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const handleRoleChange = async (user, newRole) => {
    if (newRole === user.role) return;
    try {
      setRoleUpdateLoadingId(user.id);
      setError("");
      const body = { role: newRole };
      const updated = await apiFetch(
        `http://localhost:8080/api/admin/users/${user.id}/role`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
    } catch (err) {
      console.error("Failed to update role", err);
      setError("Could not update user role. Please try again.");
    } finally {
      setRoleUpdateLoadingId(null);
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      setStatusUpdateLoadingId(user.id);
      setError("");
      const body = { enabled: !user.enabled };
      const updated = await apiFetch(
        `http://localhost:8080/api/admin/users/${user.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Could not update user status. Please try again.");
    } finally {
      setStatusUpdateLoadingId(null);
    }
  };

  const startCreatePlan = () => {
    setPlanEdit({
      id: null,
      name: "",
      category: "",
      premiumAmount: "",
      coverageAmount: "",
      active: true,
      description: "",
    });
    setPlanFile(null);
  };

  const startEditPlan = (plan) => {
    setPlanEdit({
      id: plan.id,
      name: plan.name || "",
      category: plan.category || "",
      premiumAmount: plan.premiumAmount ?? "",
      coverageAmount: plan.coverageAmount ?? "",
      active: plan.active ?? true,
      description: plan.description || "",
    });
    setPlanFile(null);
  };

  const cancelPlanEdit = () => {
    setPlanEdit(null);
    setPlanFile(null);
  };

  const savePlan = async () => {
    if (!planEdit) return;
    const payload = {
      name: planEdit.name.trim(),
      category: planEdit.category.trim(),
      premiumAmount: Number(planEdit.premiumAmount) || 0,
      coverageAmount: Number(planEdit.coverageAmount) || 0,
      active: !!planEdit.active,
      description: planEdit.description.trim(),
    };
    if (!payload.name) {
      setError("Plan name is required.");
      return;
    }
    try {
      setPlanSaving(true);
      setError("");
      let url = "http://localhost:8080/api/admin/policies";
      let method = "POST";
      if (planEdit.id != null) {
        url = `http://localhost:8080/api/admin/policies/${planEdit.id}`;
        method = "PUT";
      }
      const saved = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setPlans((prev) => {
        const exists = prev.some((p) => p.id === saved.id);
        if (exists) {
          return prev.map((p) => (p.id === saved.id ? saved : p));
        }
        return [...prev, saved];
      });
      setPlanEdit(null);
    } catch (err) {
      console.error("Failed to save plan", err);
      setError("Could not save policy plan. Please try again.");
    } finally {
      setPlanSaving(false);
    }
  };

  const togglePlanStatus = async (plan) => {
    try {
      setError("");
      const url = `http://localhost:8080/api/admin/policies/${plan.id}/status?active=${!plan.active}`;
      const saved = await apiFetch(url, { method: "PUT" });
      setPlans((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    } catch (err) {
      console.error("Failed to update plan status", err);
      setError("Could not update policy status. Please try again.");
    }
  };

  const renderUsersTable = () => (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td style={styles.td} colSpan={6}>
                No users found.
              </td>
            </tr>
          ) : (
            visibleUsers.map((u) => (
              <tr 
                key={u.id}
                onClick={() => onSelectItem && onSelectItem(u)}
                style={{ cursor: "pointer" }}
              >
                <td style={styles.td}>{u.id}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.name || "-"}</td>
                <td style={styles.td}>
                  <span
                    style={styles.badge(
                      u.role === "ADMIN"
                        ? "#f97316"
                        : u.role === "AGENT"
                        ? "#22c55e"
                        : "#60a5fa"
                    )}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={styles.td}>
                  <span
                    style={styles.badge(u.enabled ? "#22c55e" : "#ef4444")}
                  >
                    {u.enabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u, e.target.value)
                      }
                      disabled={roleUpdateLoadingId === u.id}
                      style={{
                        ...styles.toggle,
                        padding: "3px 6px",
                        minWidth: "80px",
                      }}
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="AGENT">AGENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(u)}
                      disabled={statusUpdateLoadingId === u.id}
                      style={{
                        ...styles.pillButton,
                        ...(statusUpdateLoadingId === u.id
                          ? styles.disabledButton
                          : {}),
                      }}
                    >
                      {statusUpdateLoadingId === u.id
                        ? "Saving..."
                        : u.enabled
                        ? "Disable"
                        : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderPlansTable = () => (
    <div>
      {planEdit && (
        <div style={{ marginBottom: "10px" }}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>
              {planEdit.id ? "Edit Policy Plan" : "Create Policy Plan"}
            </div>
          </div>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              placeholder="Plan name"
              value={planEdit.name}
              onChange={(e) =>
                setPlanEdit((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              style={styles.input}
              placeholder="Category (e.g. Car, Life)"
              value={planEdit.category}
              onChange={(e) =>
                setPlanEdit((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            />
          </div>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              placeholder="Premium amount"
              type="number"
              value={planEdit.premiumAmount}
              onChange={(e) =>
                setPlanEdit((prev) => ({
                  ...prev,
                  premiumAmount: e.target.value,
                }))
              }
            />
            <input
              style={styles.input}
              placeholder="Coverage amount"
              type="number"
              value={planEdit.coverageAmount}
              onChange={(e) =>
                setPlanEdit((prev) => ({
                  ...prev,
                  coverageAmount: e.target.value,
                }))
              }
            />
          </div>
          <textarea
            style={styles.textarea}
            placeholder="Description"
            value={planEdit.description}
            onChange={(e) =>
              setPlanEdit((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <div style={{ marginTop: "8px", marginBottom: "4px" }}>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
              }}
            >
              <span>Attach policy document (optional)</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPlanFile(file);
                }}
                style={{ fontSize: "11px" }}
              />
            </label>
            {planFile && (
              <div style={{ marginTop: "4px", fontSize: "11px", color: "#9ca3af" }}>
                Selected: {planFile.name}
              </div>
            )}
          </div>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              marginTop: "2px",
            }}
          >
            <input
              type="checkbox"
              checked={!!planEdit.active}
              onChange={(e) =>
                setPlanEdit((prev) => ({
                  ...prev,
                  active: e.target.checked,
                }))
              }
            />
            Active
          </label>
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={cancelPlanEdit}
              style={styles.pillButton}
              disabled={planSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={savePlan}
              style={{
                ...styles.pillButton,
                background: "rgba(37,99,235,0.8)",
                borderColor: "rgba(37,99,235,1)",
              }}
              disabled={planSaving}
            >
              {planSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitle}>Policy plans</div>
        <button
          type="button"
          onClick={startCreatePlan}
          style={styles.pillButton}
        >
          + New Plan
        </button>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr
              // key={u.id}
              // onClick={() => onSelectItem && onSelectItem(u)}
              // style={{ cursor: "pointer" }}
            >
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Premium</th>
              <th style={styles.th}>Coverage</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan={7}>
                  No policy plans found.
                </td>
              </tr>
            ) : (
              plans.map((p) => (
                <tr 
                  key={p.id}
                  onClick={() => onSelectItem && onSelectItem(p)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={styles.td}>{p.id}</td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category || "-"}</td>
                  <td style={styles.td}>{p.premiumAmount}</td>
                  <td style={styles.td}>{p.coverageAmount}</td>
                  <td style={styles.td}>
                    <span
                      style={styles.badge(p.active ? "#22c55e" : "#6b7280")}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        style={styles.pillButton}
                        onClick={() => startEditPlan(p)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={styles.pillButton}
                        onClick={() => togglePlanStatus(p)}
                      >
                        {p.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

    const buildLinePath = (points, width, height, padding) => {
    if (!points || points.length === 0) return "";
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    const innerW = width - padding * 2;
    const innerH = height - padding * 2;

    const toSvg = (p) => {
      const xNorm = (p.x - minX) / spanX;
      const yNorm = (p.y - minY) / spanY;
      const x = padding + xNorm * innerW;
      const y = padding + (1 - yNorm) * innerH;
      return { x, y };
    };

    return points
      .map((p, idx) => {
        const { x, y } = toSvg(p);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const buildChartData = () => {
    if (!userStats || userStats.length === 0) return null;
    const width = 360;
    const height = 110;
    const padding = 16;

    const withIndex = userStats.map((d, idx) => ({
      idx,
      date: d.date,
      newCustomers: d.newCustomers,
      activeAgents: d.activeAgents,
    }));

    const customerPoints = withIndex.map((d) => ({
      x: d.idx,
      y: d.newCustomers,
    }));
    const agentPoints = withIndex.map((d) => ({
      x: d.idx,
      y: d.activeAgents,
    }));

    const customerPath = buildLinePath(customerPoints, width, height, padding);
    const agentPath = buildLinePath(agentPoints, width, height, padding);

    const xLabels = withIndex.map((d) => ({
      idx: d.idx,
      date: d.date,
    }));

    return {
      width,
      height,
      padding,
      customerPath,
      agentPath,
      xLabels,
    };
  };

  return (
    <div style={styles.shell}>
      <div style={styles.sectionHeader}>
        <div>
          <div style={styles.sectionTitle}>Management</div>
          <div style={styles.smallText}>
            Admin-only controls for users and policy plans.
          </div>
        </div>
      </div>

      {/* <div style={styles.tabsRow}>
        <button
          type="button"
          style={styles.tab(activeTab === "users")}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          type="button"
          style={styles.tab(activeTab === "policies")}
          onClick={() => setActiveTab("policies")}
        >
          Policies
        </button>
      </div> */}

      {loading && (
        <div style={styles.smallText}>&nbsp;&nbsp;Loading...</div>
      )}

      {error && <div style={styles.error}>{error}</div>}

            {activeTab === "users" ? (
        <>
          {renderUsersTable()}
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>
              New customers per day (last 14 days)
            </div>
            {statsLoading && (
              <div style={styles.smallText}>Loading stats...</div>
            )}
            {!statsLoading && (!userStats || userStats.length === 0) && (
              <div style={styles.smallText}>No stats available.</div>
            )}
            {!statsLoading && userStats && userStats.length > 0 && (
              <div style={styles.chartCanvas}>
                {(() => {
                  const data = buildChartData();
                  if (!data) return null;
                  return (
                    <svg
                      style={styles.chartSvg}
                      viewBox={`0 0 ${data.width} ${data.height}`}
                    >
                      <path
                        d={data.customerPath}
                        style={{
                          ...styles.chartLine,
                          stroke: "#3b82f6",
                        }}
                      />
                      {/* x-axis labels (every few days to avoid clutter) */}
                      {data.xLabels.map((l, i) =>
                        i % 3 === 0 ? (
                          <text
                            key={l.idx}
                            x={
                              data.padding +
                              (l.idx /
                                Math.max(data.xLabels.length - 1, 1)) *
                                (data.width - data.padding * 2)
                            }
                            y={data.height - 2}
                            textAnchor="middle"
                            style={styles.chartAxisLabel}
                          >
                            {l.date.slice(5)}
                          </text>
                        ) : null
                      )}
                    </svg>
                  );
                })()}
              </div>
            )}
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>
              Active agents per day
            </div>
            {statsLoading && (
              <div style={styles.smallText}>Loading stats...</div>
            )}
            {!statsLoading && (!userStats || userStats.length === 0) && (
              <div style={styles.smallText}>No stats available.</div>
            )}
            {!statsLoading && userStats && userStats.length > 0 && (
              <div style={styles.chartCanvas}>
                {(() => {
                  const data = buildChartData();
                  if (!data) return null;
                  return (
                    <svg
                      style={styles.chartSvg}
                      viewBox={`0 0 ${data.width} ${data.height}`}
                    >
                      <path
                        d={data.agentPath}
                        style={{
                          ...styles.chartLine,
                          stroke: "#22c55e",
                        }}
                      />
                      {data.xLabels.map((l, i) =>
                        i % 3 === 0 ? (
                          <text
                            key={l.idx}
                            x={
                              data.padding +
                              (l.idx /
                                Math.max(data.xLabels.length - 1, 1)) *
                                (data.width - data.padding * 2)
                            }
                            y={data.height - 2}
                            textAnchor="middle"
                            style={styles.chartAxisLabel}
                          >
                            {l.date.slice(5)}
                          </text>
                        ) : null
                      )}
                    </svg>
                  );
                })()}
              </div>
            )}
          </div>
        </>
      ) : (
        renderPlansTable()
      )}
    </div>
  );
}

export default AdminManagementPanel;


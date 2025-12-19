// src/pages/AdminChartsPanel.js
import React from "react";

function AdminChartsPanel({ userStats, appointmentStats, loading }) {
  const styles = {
    shell: {
      borderRadius: "16px",
      border: "1px solid rgba(31,41,55,0.9)",
      background: "rgba(15,23,42,0.96)",
      boxShadow: "0 24px 55px rgba(15,23,42,0.88)",
      padding: "10px 12px",
      boxSizing: "border-box",
      marginTop: "10px",
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
    sectionHint: {
      fontSize: "11px",
      color: "#9ca3af",
    },
    chartsRow: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      gap: "10px",
      marginTop: "6px",
    },
    chartCard: {
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
    smallText: {
      fontSize: "11px",
      color: "#9ca3af",
    },
  };

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

  const buildUserChartData = () => {
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

    const customerPath = buildLinePath(
      customerPoints,
      width,
      height,
      padding
    );
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

  const buildAppointmentChartData = () => {
    if (!appointmentStats || appointmentStats.length === 0) return null;

    const width = 360;
    const height = 110;
    const padding = 16;

    const withIndex = appointmentStats.map((d, idx) => ({
      idx,
      date: d.date,
      count: d.newUsers ?? d.count ?? d.newAppointments ?? d.total, // be flexible
    }));

    const points = withIndex.map((d) => ({
      x: d.idx,
      y: d.count || 0,
    }));

    const path = buildLinePath(points, width, height, padding);
    const xLabels = withIndex.map((d) => ({
      idx: d.idx,
      date: d.date,
    }));

    return {
      width,
      height,
      padding,
      path,
      xLabels,
    };
  };

  const renderUserCharts = () => {
    if (loading) {
      return <div style={styles.smallText}>Loading charts...</div>;
    }
    if (!userStats || userStats.length === 0) {
      return <div style={styles.smallText}>No user stats available.</div>;
    }

    const data = buildUserChartData();
    if (!data) {
      return <div style={styles.smallText}>No user stats available.</div>;
    }

    return (
      <div style={styles.chartsRow}>
        {/* New customers per day */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>
            New customers per day (last 14 days)
          </div>
          <div style={styles.chartCanvas}>
            <svg
              style={styles.chartSvg}
              viewBox={`0 0 ${data.width} ${data.height}`}
            >
              {data.customerPath && (
                <path
                  d={data.customerPath}
                  style={{ ...styles.chartLine, stroke: "#3b82f6" }}
                />
              )}
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
                    {l.date?.slice(5)}
                  </text>
                ) : null
              )}
            </svg>
          </div>
        </div>

        {/* Active agents per day */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Active agents per day</div>
          <div style={styles.chartCanvas}>
            <svg
              style={styles.chartSvg}
              viewBox={`0 0 ${data.width} ${data.height}`}
            >
              {data.agentPath && (
                <path
                  d={data.agentPath}
                  style={{ ...styles.chartLine, stroke: "#22c55e" }}
                />
              )}
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
                    {l.date?.slice(5)}
                  </text>
                ) : null
              )}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentChart = () => {
    if (loading) {
      return <div style={styles.smallText}>Loading charts...</div>;
    }
    if (!appointmentStats || appointmentStats.length === 0) {
      return (
        <div style={styles.smallText}>
          No appointment stats available.
        </div>
      );
    }

    const data = buildAppointmentChartData();
    if (!data) {
      return (
        <div style={styles.smallText}>
          No appointment stats available.
        </div>
      );
    }

    return (
      <div style={{ ...styles.chartCard, marginTop: "10px" }}>
        <div style={styles.chartTitle}>
          Appointments created per day (last 14 days)
        </div>
        <div style={styles.chartCanvas}>
          <svg
            style={styles.chartSvg}
            viewBox={`0 0 ${data.width} ${data.height}`}
          >
            {data.path && (
              <path
                d={data.path}
                style={{ ...styles.chartLine, stroke: "#f97316" }}
              />
            )}
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
                  {l.date?.slice(5)}
                </text>
              ) : null
            )}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.shell}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>Trends</span>
        <span style={styles.sectionHint}>
          Customers, agents, and appointments over time.
        </span>
      </div>
      {renderUserCharts()}
      {renderAppointmentChart()}
    </div>
  );
}

export default AdminChartsPanel;

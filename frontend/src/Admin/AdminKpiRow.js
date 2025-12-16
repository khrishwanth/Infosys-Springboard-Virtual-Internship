import React from "react";

function KpiCard({ label, value, icon, trend }) {
  return (
    <div className="admin-kpi-card glass-card">
      <div className="admin-kpi-icon">{icon}</div>
      <div className="admin-kpi-main">
        <div className="admin-kpi-value">{value}</div>
        <div className="admin-kpi-label">{label}</div>
      </div>
      {trend && <div className="admin-kpi-trend">{trend}</div>}
    </div>
  );
}

function AdminKpiRow({ stats, loading, onCardClick }) {
  const safe = stats || {
    appointments: { today: 0, last7Days: 0, allTime: 0 },
    customers: 0,
    agents: 0,
    plans: 0,
  };

  const { appointments, customers, agents, plans } = safe;
  const { today, last7Days, allTime } = appointments;

  const handleCardClick = (target) => {
    if (onCardClick) onCardClick(target);
  };

  // then use safe.* instead of stats.* below
  // e.g. safe.customers, safe.agents, safe.plans, safe.appointments.today, etc.
}


export default AdminKpiRow;

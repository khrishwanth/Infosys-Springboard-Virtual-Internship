import React, { useState } from "react";
import "../styles/global.css";

const MOCK_PLANS = [
  {
    id: 1,
    name: "HDFC Comprehensive Car Protect",
    provider: "HDFC Insurance",
    category: "CAR",
    basePremium: 6000,
    coverageAmount: 1000000,
    features: ["Zero Depreciation", "Roadside Assistance", "Cashless Garages"],
    isBestValue: true,
    brochureUrl: "#",
  },
  {
    id: 2,
    name: "ICICI Budget Bike Shield",
    provider: "ICICI Lombard",
    category: "BIKE",
    basePremium: 2200,
    coverageAmount: 300000,
    features: ["24/7 Support"],
    isBestValue: false,
    brochureUrl: "#",
  },
  {
    id: 3,
    name: "Axis Home Secure",
    provider: "Axis Insurance",
    category: "HOUSE",
    basePremium: 8500,
    coverageAmount: 2500000,
    features: ["Natural Disaster Cover", "Fire & Theft"],
    isBestValue: true,
    brochureUrl: "#",
  },
  {
    id: 4,
    name: "Max Life Group Protect",
    provider: "Max Life",
    category: "LIFE",
    basePremium: 12000,
    coverageAmount: 5000000,
    features: ["Group Life", "Accidental Death Benefit"],
    isBestValue: false,
    brochureUrl: "#",
  },
];

const CATEGORY_TABS = ["All", "Car", "Bike", "House", "Life"];
const SORT_OPTIONS = [
  "Price (Low→High)",
  "Price (High→Low)",
  "Coverage",
  "Most Popular",
];

function PlansPage({ onGoHome, onGoScheduling }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [detailPlan, setDetailPlan] = useState(null);

  const toggleCompare = (id) => {
    setSelectedPlans((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filtered = MOCK_PLANS
    .filter((p) =>
      activeCategory === "All"
        ? true
        : p.category === activeCategory.toUpperCase()
    )
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "Price (Low→High)") return a.basePremium - b.basePremium;
      if (sortBy === "Price (High→Low)") return b.basePremium - a.basePremium;
      if (sortBy === "Coverage") return b.coverageAmount - a.coverageAmount;
      return b.isBestValue - a.isBestValue; // Most Popular (mock)
    });

  const comparePlans = MOCK_PLANS.filter((p) =>
    selectedPlans.includes(p.id)
  );

  return (
    <div className="plans-root app-root">
      <header className="plans-topbar">
        <div className="plans-top-left">
          <div className="plans-title">Plans &amp; Offers</div>
          <div className="plans-subtitle">
            Explore and compare InsurAI-supported insurance plans.
          </div>
        </div>
        <div className="plans-top-center">
          <div className="plans-tabs">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                className={
                  "plans-tab" + (activeCategory === tab ? " active" : "")
                }
                onClick={() => setActiveCategory(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="plans-top-right">
          <input
            type="text"
            className="plans-search"
            placeholder="Search by provider or plan name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="plans-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                Sort by: {opt}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="plans-main">
        <section className="plans-grid">
          {filtered.map((p) => (
            <article key={p.id} className="plan-card glass-card">
              <div className="plan-card-top">
                <div className="plan-icon">
                  {p.category === "CAR" && "🚗"}
                  {p.category === "BIKE" && "🏍"}
                  {p.category === "HOUSE" && "🏠"}
                  {p.category === "LIFE" && "❤️"}
                </div>
                <div>
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-provider">{p.provider}</div>
                </div>
                {p.isBestValue && (
                  <div className="plan-badge">Best Value</div>
                )}
              </div>
              <div className="plan-body">
                <div className="plan-row">
                  <span>Premium</span>
                  <strong>₹{p.basePremium.toLocaleString()} / year</strong>
                </div>
                <div className="plan-row">
                  <span>Coverage</span>
                  <strong>Up to ₹{(p.coverageAmount / 100000).toFixed(1)} Lakh</strong>
                </div>
                <div className="plan-row">
                  <span>Category</span>
                  <strong>{p.category}</strong>
                </div>
                <div className="plan-features">
                  {p.features.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
              </div>
              <div className="plan-actions">
                <button
                  className="btn-outline"
                  type="button"
                  onClick={() => setDetailPlan(p)}
                >
                  View Details
                </button>
                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => onGoScheduling && onGoScheduling()}
                >
                  Contact Agent
                </button>
                <button
                  className="plan-download"
                  type="button"
                  onClick={() => window.open(p.brochureUrl, "_blank")}
                >
                  📄 Brochure
                </button>
              </div>
              <label className="plan-compare-row">
                <input
                  type="checkbox"
                  checked={selectedPlans.includes(p.id)}
                  onChange={() => toggleCompare(p.id)}
                />
                <span>Add to Compare</span>
              </label>
            </article>
          ))}
        </section>

        {/* comparison bar */}
        {comparePlans.length >= 2 && (
          <div className="plans-compare-bar glass-card">
            <span>{comparePlans.length} plans selected for comparison</span>
            <button
              className="btn-primary"
              type="button"
              onClick={() => {
                document
                  .getElementById("plans-compare-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Compare Now
            </button>
          </div>
        )}

        {/* comparison section */}
        {comparePlans.length >= 2 && (
          <section
            id="plans-compare-section"
            className="plans-compare glass-card"
          >
            <h2>Compare plans</h2>
            <div className="plans-compare-grid">
              {comparePlans.map((p) => (
                <div key={p.id} className="plans-compare-column">
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-provider">{p.provider}</div>
                  <div className="compare-row">
                    <span>Category</span>
                    <strong>{p.category}</strong>
                  </div>
                  <div className="compare-row">
                    <span>Premium</span>
                    <strong>₹{p.basePremium.toLocaleString()} / year</strong>
                  </div>
                  <div className="compare-row">
                    <span>Coverage Limit</span>
                    <strong>₹{p.coverageAmount.toLocaleString()}</strong>
                  </div>
                  <div className="compare-row">
                    <span>Key Features</span>
                    <div className="compare-features">
                      {p.features.map((f) => (
                        <span key={f}>✔ {f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="compare-row">
                    <span>Best for</span>
                    <div className="compare-best">
                      {p.isBestValue
                        ? "Great balance of coverage and price."
                        : "Suited for specific coverage needs."}
                    </div>
                  </div>
                  <div className="compare-actions">
                    <button
                      className="btn-primary"
                      type="button"
                      onClick={() => onGoScheduling && onGoScheduling()}
                    >
                      Choose &amp; Contact Agent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* detail modal */}
        {detailPlan && (
          <div className="plans-modal-backdrop">
            <div className="plans-modal glass-card">
              <h2>{detailPlan.name}</h2>
              <div className="plan-provider">{detailPlan.provider}</div>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                Category: {detailPlan.category} · Premium: ₹
                {detailPlan.basePremium.toLocaleString()} / year · Coverage: ₹
                {detailPlan.coverageAmount.toLocaleString()}
              </p>
              <h4>Highlights</h4>
              <ul style={{ fontSize: "0.85rem" }}>
                {detailPlan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="plans-modal-actions">
                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => onGoScheduling && onGoScheduling()}
                >
                  Book Appointment for this Plan
                </button>
                <button
                  className="btn-outline"
                  type="button"
                  onClick={() => setDetailPlan(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PlansPage;

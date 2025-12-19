// src/Plans/PlansPage.js
import React, { useEffect, useMemo, useState } from "react";
import "../styles/global.css";
import { apiFetch } from "../apiClient";

const CATEGORY_TABS = ["All", "Car", "Bike", "House", "Life", "Health", "Other"];
const SORT_OPTIONS = ["Most Popular", "Price Low–High", "Price High–Low", "Coverage"];

function PlansPage({ onGoHome, onGoScheduling, onGoLogin, auth }) {
  const [plans, setPlans] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [detailPlan, setDetailPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPlans() {
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch("http://localhost:8080/api/plans");
        if (cancelled) return;
        setPlans(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load plans", err);
        if (!cancelled) {
          setError("Could not load plans. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPlans();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleCompare = (id) => {
    setSelectedPlans((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    let arr = plans;

    if (activeCategory !== "All") {
      arr = arr.filter(
        (p) =>
          (p.category || "").toUpperCase() === activeCategory.toUpperCase()
      );
    }

    if (q) {
      arr = arr.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.provider || "").toLowerCase().includes(q)
      );
    }

    arr = [...arr].sort((a, b) => {
      if (sortBy === "Price Low–High") {
        return (a.basePremium || 0) - (b.basePremium || 0);
      }
      if (sortBy === "Price High–Low") {
        return (b.basePremium || 0) - (a.basePremium || 0);
      }
      if (sortBy === "Coverage") {
        return (b.coverageAmount || 0) - (a.coverageAmount || 0);
      }
      // Most Popular – use isBestValue as proxy
      return (b.isBestValue ? 1 : 0) - (a.isBestValue ? 1 : 0);
    });

    return arr;
  }, [plans, activeCategory, search, sortBy]);

  const comparePlans = useMemo(
    () => plans.filter((p) => selectedPlans.includes(p.id)),
    [plans, selectedPlans]
  );

  const handleContactOrBook = (plan) => {
    if (!auth || !auth.token) {
      if (onGoLogin) onGoLogin();
      return;
    }
    if (onGoScheduling) {
      onGoScheduling(plan);
    }
  };

  const isAgent = auth?.role === "AGENT";
  const isCustomer = auth?.role === "CUSTOMER";

  return (
    <div className="plans-root app-root">
      <header className="plans-topbar">
        <div className="plans-top-left">
          <div className="plans-title">Plans &amp; Offers</div>
          <div className="plans-subtitle">
            Explore and compare InsurAI-supported insurance plans.
            {isAgent && (
              <span style={{ marginLeft: 8, color: "#a5b4fc", fontSize: "0.8rem" }}>
                Agent view: select a plan to recommend or book for customers.
              </span>
            )}
          </div>
        </div>

        <div className="plans-top-center">
          <div className="plans-tabs">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                className={`plans-tab ${activeCategory === tab ? "active" : ""}`}
                onClick={() => setActiveCategory(tab)}
                type="button"
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
            placeholder="Search by provider or plan name"
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
                Sort by {opt}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="plans-main">
        {loading && (
          <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Loading plans…</p>
        )}
        {error && (
          <p style={{ color: "#fecaca", fontSize: "0.85rem" }}>{error}</p>
        )}

        <section className="plans-grid">
          {filtered.map((p) => (
            <article key={p.id} className="plan-card glass-card">
              <div className="plan-card-top">
                <div className="plan-icon">
                  {p.category === "CAR" && "🚗"}
                  {p.category === "BIKE" && "🏍️"}
                  {p.category === "HOUSE" && "🏠"}
                  {p.category === "LIFE" && "🛡️"}
                  {!["CAR", "BIKE", "HOUSE", "LIFE"].includes(p.category || "") &&
                    "📄"}
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
                  <strong>
                    ₹{(p.basePremium || 0).toLocaleString("en-IN")}/year
                  </strong>
                </div>
                <div className="plan-row">
                  <span>Coverage</span>
                  <strong>
                    Up to ₹{(p.coverageAmount || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="plan-row">
                  <span>Category</span>
                  <strong>{p.category}</strong>
                </div>
                <div className="plan-features">
                  {(p.features || []).map((f) => (
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
                  onClick={() => handleContactOrBook(p)}
                >
                  {isAgent ? "Book for Customer" : "Contact Agent"}
                </button>

                {p.brochureUrl && (
                  <button
                    className="plan-download"
                    type="button"
                    onClick={() => window.open(p.brochureUrl, "_blank")}
                  >
                    Brochure
                  </button>
                )}
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

          {filtered.length === 0 && !loading && (
            <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              No plans match your filters.
            </p>
          )}
        </section>

        {comparePlans.length >= 2 && (
          <section className="plans-compare-bar glass-card">
            <span>{comparePlans.length} plans selected for comparison</span>
            <button
              className="btn-primary"
              type="button"
              onClick={() =>
                document
                  .getElementById("plans-compare-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Compare Now
            </button>
          </section>
        )}

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
                    <strong>
                      ₹{(p.basePremium || 0).toLocaleString("en-IN")}/year
                    </strong>
                  </div>
                  <div className="compare-row">
                    <span>Coverage Limit</span>
                    <strong>
                      ₹{(p.coverageAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="compare-row">
                    <span>Key Features</span>
                    <div className="compare-features">
                      {(p.features || []).map((f) => (
                        <span key={f}>{f}</span>
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
                      onClick={() => handleContactOrBook(p)}
                    >
                      {isAgent ? "Book for Customer" : "Choose & Contact Agent"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {detailPlan && (
          <section className="plans-modal-backdrop">
            <div className="plans-modal glass-card">
              <h2>{detailPlan.name}</h2>
              <div className="plan-provider">{detailPlan.provider}</div>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                Category: {detailPlan.category} • Premium: ₹
                {(detailPlan.basePremium || 0).toLocaleString("en-IN")}/year •
                Coverage: ₹
                {(detailPlan.coverageAmount || 0).toLocaleString("en-IN")}
              </p>

              <h4>Highlights</h4>
              <ul style={{ fontSize: "0.85rem" }}>
                {(detailPlan.features || []).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <div className="plans-modal-actions">
                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => handleContactOrBook(detailPlan)}
                >
                  {isAgent ? "Book Appointment for Customer" : "Book Appointment for this Plan"}
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
          </section>
        )}
      </main>
    </div>
  );
}

export default PlansPage;

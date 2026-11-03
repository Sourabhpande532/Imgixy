import { useState, type FormEvent } from "react";
import API from "../services/api";

type ItineraryDay = { day: number; plan: string };

type PlanData = {
  destination: string;
  best_time: string;
  duration_days: number;
  top_attractions?: string[];
  sample_itinerary?: ItineraryDay[];
  estimated_budget_eur?: {
    low?: number | string;
    mid?: number | string;
    high?: number | string;
  };
  local_tips?: string[];
};

const PHOTO_STYLES = [
  "Cinematic",
  "Cyberpunk",
  "Moody Portrait",
  "Ethereal Landscape",
  "Vintage/Retro",
  "Ultra-Minimalist",
  "Glassmorphic Art",
  "Street Documentary",
];

const ALBUM_THEMES = [
  "Travel Diary",
  "Wedding Spark",
  "Nature & Wildlife",
  "Neon Cityscape",
  "Monochromatic Vibe",
  "Ethereal Fantasy",
  "Cozy Family",
];

const Planner = () => {
  const [form, setForm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const country = params.get("country");
    const days = params.get("days");
    return {
      city: city || "Cinematic",
      country: country || "Neon Cityscape",
      days: days ? Number(days) : 3,
    };
  });
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("Analyzing...");
  const [data, setData] = useState<PlanData | null>(null);
  const [error, setError] = useState("");

  async function processSSEResponse(res: Response) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/event-stream")) {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let resultData = null;
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const lines = part.split("\n");
          let eventType = "";
          let dataStr = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.substring(7).trim();
            else if (line.startsWith("data: ")) dataStr = line.substring(6).trim();
          }
          if (eventType === "done" && dataStr) {
            resultData = JSON.parse(dataStr).data;
          } else if (eventType === "error" && dataStr) {
            throw new Error(
              JSON.parse(dataStr).error || JSON.parse(dataStr).text,
            );
          } else if (eventType === "status" && dataStr) {
            setStatusText(JSON.parse(dataStr).text);
          }
        }
      }
      if (resultData) setData(resultData);
    } else {
      const result = await res.json();
      if (!res.ok)
        throw new Error((result && result.error) || "Something went wrong");
      setData(result as PlanData);
    }
  }

  function handleSelectChange(name: string, value: string | number) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatusText("Analyzing...");
    setError("");
    setData(null);
    try {
      const baseUrl = API.defaults.baseURL || "https://imgixy.vercel.app";
      const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
      const res = await fetch(`${cleanBaseUrl}/ai/chat/sdk/plan/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await processSSEResponse(res);

      window.history.pushState(
        {},
        "",
        `?city=${encodeURIComponent(form.city)}&country=${encodeURIComponent(form.country)}&days=${form.days}`,
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to generate response right now. Please try again after some time.",
        );
      }
    } finally {
      setLoading(false);
      setStatusText("Analyzing...");
    }
  }

  return (
    <div className="container pt-4 pb-2">
      <div
        className="glass-card p-4 p-md-5 mb-3 position-relative overflow-hidden"
        style={{
          borderRadius: "20px",
          border: "1px solid var(--glass-border)",
        }}
      >
        {/* Decorative warm background glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "280px",
            height: "280px",
            background:
              "radial-gradient(circle, rgba(217, 119, 6, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="row align-items-center mb-3">
          <div className="col-12 col-md-9">
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span
                className="px-3 py-1"
                style={{
                  background: "var(--accent-subtle)",
                  border: "1px solid var(--accent-border)",
                  color: "var(--accent-text)",
                  borderRadius: "30px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                <i className="fas fa-magic me-1" /> Imgixy AI
              </span>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                Creative Studio v2.0
              </span>
            </div>
            <h2
              className="fw-bold mb-1"
              style={{ color: "var(--text-h)", fontSize: "1.65rem" }}
            >
              AI Creative Director
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              Choose your photo aesthetic and album theme to generate a bespoke visual direction, lighting setup, and shot-by-shot composition plan.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label htmlFor="planner-style-select" className="kx-label mb-1">
                Photo Style &amp; Aesthetic
              </label>
              <select
                id="planner-style-select"
                className="kx-select form-select"
                value={form.city}
                onChange={(e) => handleSelectChange("city", e.target.value)}
              >
                {PHOTO_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="planner-theme-select" className="kx-label mb-1">
                Album Theme &amp; Subject
              </label>
              <select
                id="planner-theme-select"
                className="kx-select form-select"
                value={form.country}
                onChange={(e) => handleSelectChange("country", e.target.value)}
              >
                {ALBUM_THEMES.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-2">
              <label htmlFor="planner-slots-select" className="kx-label mb-1">
                Showcase Slots
              </label>
              <select
                id="planner-slots-select"
                className="kx-select form-select"
                value={form.days}
                onChange={(e) =>
                  handleSelectChange("days", Number(e.target.value))
                }
              >
                <option value={3}>3 Slots</option>
                <option value={5}>5 Slots</option>
                <option value={7}>7 Slots</option>
                <option value={10}>10 Slots</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-2 d-flex align-items-end">
              <button
                type="submit"
                id="generate-plan-btn"
                className="kx-btn-primary w-100 d-flex align-items-center justify-content-center gap-2 px-2"
                disabled={loading}
                style={{
                  minHeight: "42px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.84rem",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm flex-shrink-0"
                      role="status"
                      aria-hidden="true"
                    />
                    <span
                      className="text-truncate fw-medium"
                      style={{ fontSize: "0.82rem" }}
                      title={statusText}
                    >
                      {statusText}
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic flex-shrink-0" />
                    <span className="text-truncate">Generate Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ERROR STATE */}
        {error && (
          <div
            className="mt-4 p-3 d-flex align-items-center gap-3"
            role="alert"
            style={{
              background: "var(--danger-bg)",
              color: "var(--danger-text)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--danger-border)",
              fontSize: "0.88rem",
            }}
          >
            <i className="fas fa-exclamation-circle fs-5" />
            <div>{error}</div>
          </div>
        )}
      </div>

      {/* RESULTS STATE */}
      {data && (
        <div style={{ animation: "fadeSlideUp 0.45s ease both" }}>
          {/* Header Concept Block */}
          <div
            className="glass-card p-4 p-md-5 mb-4 position-relative overflow-hidden"
            style={{ borderRadius: "20px" }}
          >
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
              <span
                className="text-uppercase fw-bold"
                style={{
                  letterSpacing: "0.08em",
                  fontSize: "0.75rem",
                  color: "var(--accent-text)",
                }}
              >
                Bespoke Creative Vision
              </span>
              <button
                type="button"
                className="kx-btn-cancel"
                style={{ padding: "0.28rem 0.75rem", fontSize: "0.76rem" }}
                onClick={() => setData(null)}
              >
                <i className="fas fa-times me-1" />
                Dismiss Plan
              </button>
            </div>

            <div className="row g-4 align-items-center">
              <div className="col-12 col-md-8">
                <h3
                  className="h3 fw-bold mb-3"
                  style={{ color: "var(--text-h)" }}
                >
                  {data.destination}
                </h3>
                <div className="d-flex flex-wrap gap-2">
                  <div
                    className="d-flex align-items-center gap-2 px-3 py-2"
                    style={{
                      background: "var(--surface-subtle)",
                      borderRadius: "10px",
                      border: "1px solid var(--glass-border)",
                      fontSize: "0.84rem",
                      color: "var(--text)",
                    }}
                  >
                    <i
                      className="fas fa-camera"
                      style={{ color: "var(--warning)" }}
                    />
                    <span>
                      <strong style={{ color: "var(--text-h)" }}>
                        Lighting/Setup:
                      </strong>{" "}
                      {data.best_time}
                    </span>
                  </div>
                  <div
                    className="d-flex align-items-center gap-2 px-3 py-2"
                    style={{
                      background: "var(--surface-subtle)",
                      borderRadius: "10px",
                      border: "1px solid var(--glass-border)",
                      fontSize: "0.84rem",
                      color: "var(--text)",
                    }}
                  >
                    <i
                      className="fas fa-images"
                      style={{ color: "var(--info)" }}
                    />
                    <span>
                      <strong style={{ color: "var(--text-h)" }}>
                        Showcase Slots:
                      </strong>{" "}
                      {data.duration_days} Photos
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 text-md-end">
                <div
                  className="p-3 d-inline-block text-start"
                  style={{
                    background: "var(--accent-subtle)",
                    borderRadius: "16px",
                    border: "1px solid var(--accent-border)",
                    width: "100%",
                    maxWidth: "280px",
                  }}
                >
                  <span
                    className="fw-bold d-block mb-1"
                    style={{
                      letterSpacing: "0.05em",
                      fontSize: "0.72rem",
                      color: "var(--accent-text)",
                    }}
                  >
                    EST. PRODUCTION COST
                  </span>
                  <div className="d-flex align-items-baseline gap-1">
                    <span
                      className="h4 fw-bold mb-0"
                      style={{ color: "var(--text-h)" }}
                    >
                      €{data.estimated_budget_eur?.mid || 0}
                    </span>
                    <span
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      avg
                    </span>
                  </div>
                  <span
                    className="d-block mt-1"
                    style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}
                  >
                    Range: €{data.estimated_budget_eur?.low || 0} (Low) – €
                    {data.estimated_budget_eur?.high || 0} (High)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Left Column: Workflow Timeline */}
            <div className="col-12 col-lg-8">
              <div
                className="glass-card p-4 p-md-5"
                style={{ borderRadius: "20px" }}
              >
                <h4
                  className="fw-bold mb-4 d-flex align-items-center gap-2"
                  style={{ color: "var(--text-h)", fontSize: "1.15rem" }}
                >
                  <i
                    className="fas fa-list-ol"
                    style={{ color: "var(--accent)" }}
                  />
                  <span>Creative Workflow &amp; Curation Plan</span>
                </h4>

                <div
                  className="position-relative ps-3"
                  style={{ borderLeft: "2px solid var(--accent-border)" }}
                >
                  {data.sample_itinerary?.map((day, i) => (
                    <div key={i} className="mb-3 position-relative">
                      <div
                        className="position-absolute"
                        style={{
                          left: "-23px",
                          top: "6px",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: "var(--accent)",
                          boxShadow: "0 0 8px var(--accent-glow)",
                        }}
                      />

                      <div
                        className="p-3 p-md-4 ms-2"
                        style={{
                          background: "var(--surface-subtle)",
                          border: "1px solid var(--glass-border)",
                          borderRadius: "14px",
                        }}
                      >
                        <h5
                          className="fw-bold mb-2"
                          style={{
                            color: "var(--text-h)",
                            fontSize: "0.95rem",
                          }}
                        >
                          Slot #{day.day}: Creative Execution
                        </h5>
                        <p
                          className="mb-0"
                          style={{
                            color: "var(--text)",
                            fontSize: "0.86rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {day.plan}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Aesthetics & Tips */}
            <div className="col-12 col-lg-4">
              <div className="d-flex flex-column gap-4">
                {/* Composition Techniques */}
                <div className="glass-card p-4" style={{ borderRadius: "20px" }}>
                  <h4
                    className="fw-bold mb-2 d-flex align-items-center gap-2"
                    style={{ color: "var(--text-h)", fontSize: "1.08rem" }}
                  >
                    <i
                      className="fas fa-crop-alt"
                      style={{ color: "var(--accent)" }}
                    />
                    <span>Composition Guide</span>
                  </h4>
                  <p
                    className="mb-3"
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Key techniques to align framing &amp; visual interest.
                  </p>
                  <div className="d-flex flex-column gap-2">
                    {data.top_attractions?.map((item, i) => (
                      <div
                        key={i}
                        className="d-flex align-items-center gap-2 p-2"
                        style={{
                          background: "var(--surface-subtle)",
                          borderRadius: "10px",
                          border: "1px solid var(--glass-border)",
                        }}
                      >
                        <i
                          className="fas fa-check"
                          style={{
                            color: "var(--accent)",
                            fontSize: "0.75rem",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.84rem",
                            color: "var(--text-h)",
                            fontWeight: 500,
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="glass-card p-4" style={{ borderRadius: "20px" }}>
                  <h4
                    className="fw-bold mb-2 d-flex align-items-center gap-2"
                    style={{ color: "var(--text-h)", fontSize: "1.08rem" }}
                  >
                    <i
                      className="fas fa-star"
                      style={{ color: "var(--warning)" }}
                    />
                    <span>Imgixy Pro Tips</span>
                  </h4>
                  <p
                    className="mb-3"
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Workflows to elevate color grading &amp; filtering in Imgixy.
                  </p>
                  <div className="d-flex flex-column gap-3">
                    {data.local_tips?.map((tip, i) => (
                      <div key={i} className="d-flex align-items-start gap-2">
                        <div
                          className="p-2"
                          style={{
                            background: "var(--accent-subtle)",
                            color: "var(--accent-text)",
                            borderRadius: "8px",
                            border: "1px solid var(--accent-border)",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className="fas fa-magic"
                            style={{ fontSize: "0.75rem" }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "0.84rem",
                            color: "var(--text)",
                            lineHeight: 1.45,
                          }}
                        >
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;

import { useState, useEffect, type FormEvent } from "react"

type ItineraryDay = { day: number; plan: string };

type PlanData = {
    destination: string;
    best_time: string;
    duration_days: number;
    top_attractions?: string[];
    sample_itinerary?: ItineraryDay[];
    estimated_budget_eur?: { low?: number | string; mid?: number | string; high?: number | string };
    local_tips?: string[];
};

const BASE_URL = import.meta.env.VITE_API_URL || "https://imgixy.vercel.app";

const PHOTO_STYLES = [
    "Cinematic",
    "Cyberpunk",
    "Moody Portrait",
    "Ethereal Landscape",
    "Vintage/Retro",
    "Ultra-Minimalist",
    "Glassmorphic Art",
    "Street Documentary"
];

const ALBUM_THEMES = [
    "Travel Diary",
    "Wedding Spark",
    "Nature & Wildlife",
    "Neon Cityscape",
    "Monochromatic Vibe",
    "Ethereal Fantasy",
    "Cozy Family"
];

const Planner = () => {
    const [form, setForm] = useState({ city: "Cinematic", country: "Neon Cityscape", days: 3 });
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
                const parts = buffer.split('\n\n');
                buffer = parts.pop() || "";
                for (const part of parts) {
                    const lines = part.split('\n');
                    let eventType = '';
                    let dataStr = '';
                    for (const line of lines) {
                        if (line.startsWith('event: ')) eventType = line.substring(7).trim();
                        else if (line.startsWith('data: ')) dataStr = line.substring(6).trim();
                    }
                    if (eventType === 'done' && dataStr) {
                        resultData = JSON.parse(dataStr).data;
                    } else if (eventType === 'error' && dataStr) {
                        throw new Error(JSON.parse(dataStr).error || JSON.parse(dataStr).text);
                    } else if (eventType === 'status' && dataStr) {
                        setStatusText(JSON.parse(dataStr).text);
                    }
                }
            }
            if (resultData) setData(resultData);
        } else {
            const result = await res.json();
            if (!res.ok) throw new Error((result && result.error) || "Something went wrong");
            setData(result as PlanData);
        }
    }

    function handleSelectChange(name: string, value: string | number) {
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setStatusText("Analyzing...");
        setError("");
        setData(null);
        try {
            const res = await fetch(`${BASE_URL}/ai/chat/sdk/plan/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            await processSSEResponse(res);
            
            // Sync with URL query parameters for user sharing/bookmarks
            window.history.pushState(
                {},
                "",
                `?city=${encodeURIComponent(form.city)}&country=${encodeURIComponent(form.country)}&days=${form.days}`,
            );
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unable to generate response right now. Please try again after some time.");
            }
        } finally {
            setLoading(false);
            setStatusText("Analyzing...");
        }
    }

    // 🔹 On page load → check URL params and populate, but DO NOT auto-generate
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const city = params.get("city");
        const country = params.get("country");
        const days = params.get("days");

        if (city || country || days) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                city: city || "Cinematic",
                country: country || "Neon Cityscape",
                days: Number(days) || 3
            });
        }
    }, []);

    return (
        <div className="container py-4">
            <style>{`
                .hover-scale {
                    transition: all 0.22s ease-in-out;
                }
                .hover-scale:hover {
                    transform: translateY(-2px);
                    border-color: rgba(168, 85, 247, 0.25) !important;
                    box-shadow: 0 4px 20px rgba(168, 85, 247, 0.1) !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                }
                .bg-white-5 {
                    background: rgba(255, 255, 255, 0.04) !important;
                }
                .tracking-wider {
                    letter-spacing: 0.05em;
                }
                .fs-7 {
                    font-size: 0.875rem !important;
                }
                .fs-8 {
                    font-size: 0.775rem !important;
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="glass-card p-4 p-md-5 mb-5 shadow-lg position-relative overflow-hidden" style={{ borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                {/* Decorative background glow */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />
                
                <div className="row align-items-center mb-4">
                    <div className="col-12 col-md-8">
                        <div className="d-flex align-items-center mb-2">
                            <span className="badge bg-purple-glow text-purple me-2 px-3 py-2 fs-7" style={{ 
                                background: 'rgba(168, 85, 247, 0.15)', 
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                color: '#c084fc',
                                borderRadius: '30px',
                                fontWeight: 600
                            }}>
                                <i className="fas fa-magic me-1"></i> Imgixy AI
                            </span>
                            <span className="text-muted fs-8">Creative Studio v2.0</span>
                        </div>
                        <h2 className="display-6 fw-bold mb-2" style={{ background: 'linear-gradient(135deg, #f8fafc 30%, #a855f7 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            AI Creative Director
                        </h2>
                        <p className="text-muted-custom fs-6 mb-0" style={{ color: 'var(--text-muted)' }}>
                            Choose your photo aesthetic and album theme. Our neural model will craft a bespoke visual direction, shooting tips, and pro composition guidelines.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-4">
                            <label className="kx-label mb-2">Photo Style & Aesthetic</label>
                            <select 
                                className="kx-input form-select"
                                value={form.city}
                                onChange={(e) => handleSelectChange("city", e.target.value)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text)',
                                    borderRadius: '12px',
                                    padding: '10px 14px'
                                }}
                            >
                                {PHOTO_STYLES.map(style => (
                                    <option key={style} value={style} style={{ background: '#16161e', color: '#fff' }}>{style}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-4">
                            <label className="kx-label mb-2">Album Theme & Subject</label>
                            <select 
                                className="kx-input form-select"
                                value={form.country}
                                onChange={(e) => handleSelectChange("country", e.target.value)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text)',
                                    borderRadius: '12px',
                                    padding: '10px 14px'
                                }}
                            >
                                {ALBUM_THEMES.map(theme => (
                                    <option key={theme} value={theme} style={{ background: '#16161e', color: '#fff' }}>{theme}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-2">
                            <label className="kx-label mb-2">Showcase Slots</label>
                            <select 
                                className="kx-input form-select"
                                value={form.days}
                                onChange={(e) => handleSelectChange("days", Number(e.target.value))}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text)',
                                    borderRadius: '12px',
                                    padding: '10px 14px'
                                }}
                            >
                                <option value={3} style={{ background: '#16161e', color: '#fff' }}>3 Slots</option>
                                <option value={5} style={{ background: '#16161e', color: '#fff' }}>5 Slots</option>
                                <option value={7} style={{ background: '#16161e', color: '#fff' }}>7 Slots</option>
                                <option value={10} style={{ background: '#16161e', color: '#fff' }}>10 Slots</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-2 d-flex align-items-end mt-3 mt-md-0">
                            <button 
                                type="submit" 
                                className="kx-btn-primary w-100 d-flex align-items-center justify-content-center gap-2 px-2"
                                disabled={loading}
                                style={{
                                    minHeight: '46px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                    border: 'none',
                                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                                    transition: 'all 0.2s ease',
                                    overflow: 'hidden'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm flex-shrink-0" role="status" aria-hidden="true"></span>
                                        <span className="text-truncate fw-medium" style={{ fontSize: '0.85rem' }} title={statusText}>{statusText}</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-magic flex-shrink-0"></i>
                                        <span className="text-truncate py-1">Generate Plan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* ERROR STATE */}
                {error && (
                    <div className="alert alert-danger mt-4 d-flex align-items-center gap-3 border-0 shadow-sm" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#fca5a5', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.25) !important' }}>
                        <i className="fas fa-exclamation-circle fs-5 text-danger"></i>
                        <div>{error}</div>
                    </div>
                )}
            </div>

            {/* RESULTS STATE */}
            {data && (
                <div className="fade-in-up" style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
                    {/* Header Concept Block */}
                    <div className="glass-card p-4 p-md-5 mb-4 position-relative overflow-hidden" style={{ borderRadius: '20px' }}>
                        <div className="row g-4 align-items-center">
                            <div className="col-12 col-md-8">
                                <span className="text-muted fs-7 text-uppercase fw-semibold tracking-wider d-block mb-1" style={{ letterSpacing: '1px' }}>
                                    BESPOKE CREATIVE VISION
                                </span>
                                <h3 className="h2 fw-bold text-white mb-3" style={{ background: 'linear-gradient(135deg, #c084fc, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {data.destination}
                                </h3>
                                <div className="d-flex flex-wrap gap-3">
                                    <div className="d-flex align-items-center gap-2 bg-white-5 px-3 py-2" style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                        <i className="fas fa-camera text-warning"></i>
                                        <span className="fs-7"><strong style={{ color: 'var(--text-h)' }}>Lighting/Setup:</strong> {data.best_time}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 bg-white-5 px-3 py-2" style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                        <i className="fas fa-images text-info"></i>
                                        <span className="fs-7"><strong style={{ color: 'var(--text-h)' }}>Showcase Slots:</strong> {data.duration_days} Photos</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-12 col-md-4 text-md-end">
                                <div className="p-3 bg-purple-glow d-inline-block text-start" style={{ background: 'rgba(168, 85, 247, 0.08)', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.2)', width: '100%', maxWidth: '280px' }}>
                                    <span className="fs-8 text-purple fw-semibold tracking-wider d-block mb-1" style={{ letterSpacing: '0.5px', color: '#c084fc' }}>EST. PRODUCTION COST</span>
                                    <div className="d-flex align-items-baseline gap-1">
                                        <span className="h4 fw-bold text-white mb-0">€{data.estimated_budget_eur?.mid || 0}</span>
                                        <span className="fs-8 text-muted">avg</span>
                                    </div>
                                    <span className="fs-8 text-muted d-block mt-1">Range: €{data.estimated_budget_eur?.low || 0} (Low) - €{data.estimated_budget_eur?.high || 0} (High)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mb-5">
                        {/* Left Column: Workflow Timeline */}
                        <div className="col-12 col-lg-8">
                            <div className="glass-card p-4 p-md-5" style={{ borderRadius: '20px' }}>
                                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <i className="fas fa-list-ol text-purple" style={{ color: '#a855f7' }}></i>
                                    <span>Creative Workflow & Curation Plan</span>
                                </h4>
                                
                                <div className="position-relative ps-3" style={{ borderLeft: '2px solid rgba(168, 85, 247, 0.15)' }}>
                                    {data.sample_itinerary?.map((day, i) => (
                                        <div key={i} className="mb-4 position-relative" style={{ animationDelay: `${i * 0.1}s` }}>
                                            {/* Bullet dot */}
                                            <div className="position-absolute" style={{ 
                                                left: '-24px', 
                                                top: '4px', 
                                                width: '14px', 
                                                height: '14px', 
                                                borderRadius: '50%', 
                                                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                                                boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                                                border: '2px solid #0a0a0f'
                                            }} />
                                            
                                            <div className="glass-card p-3 p-md-4 ms-2 hover-scale" style={{ 
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                borderRadius: '16px',
                                                transition: 'all 0.2s ease-in-out'
                                            }}>
                                                <h5 className="fw-bold fs-6 text-white mb-2">Slot #{day.day}: Creative Execution</h5>
                                                <p className="text-muted-custom fs-7 mb-0" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
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
                                <div className="glass-card p-4" style={{ borderRadius: '20px' }}>
                                    <h4 className="fw-bold fs-5 mb-3 d-flex align-items-center gap-2">
                                        <i className="fas fa-crop-alt text-purple" style={{ color: '#a855f7' }}></i>
                                        <span>Composition Guide</span>
                                    </h4>
                                    <p className="text-muted fs-8 mb-3">Key techniques to align framing & visual interest.</p>
                                    <div className="d-flex flex-column gap-2">
                                        {data.top_attractions?.map((item, i) => (
                                            <div key={i} className="d-flex align-items-center gap-2 bg-white-5 p-2" style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                                <i className="fas fa-check text-purple fs-8" style={{ color: '#a855f7' }}></i>
                                                <span className="fs-7 text-white">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pro Tips */}
                                <div className="glass-card p-4" style={{ borderRadius: '20px' }}>
                                    <h4 className="fw-bold fs-5 mb-3 d-flex align-items-center gap-2">
                                        <i className="fas fa-star text-warning"></i>
                                        <span>Imgixy Pro Tips</span>
                                    </h4>
                                    <p className="text-muted fs-8 mb-3">Expert workflows to elevate color grading & filtering in Imgixy.</p>
                                    <div className="d-flex flex-column gap-3">
                                        {data.local_tips?.map((tip, i) => (
                                            <div key={i} className="d-flex align-items-start gap-3">
                                                <div className="p-2 bg-warning-glow" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', flexShrink: 0 }}>
                                                    <i className="fas fa-magic fs-8"></i>
                                                </div>
                                                <span className="fs-7 text-muted-custom" style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>{tip}</span>
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
    )
}

export default Planner
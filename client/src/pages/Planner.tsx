import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"

type ItineraryDay = { day: number; plan: string };

type PlanData = {
    destination: string;
    best_time: string;
    duration_days: number;
    top_attractions?: string[];
    sample_itinerary?: ItineraryDay[];
    estimated_budget_eur?: { low?: string; mid?: string; high?: string };
    local_tips?: string[];
};

const Planner = () => {
    const [form, setForm] = useState({ city: "", country: "", days: 3 })
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PlanData | null>(null);
    const [error, setError] = useState("");

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "days" ? Number(value) : value,
        } as typeof form);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setData(null);
        try {
            const res = await fetch("https://imgixy.vercel.app/ai/chat/sdk/plan/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const result = await res.json() as { error?: string };
            if (!res.ok) throw new Error((result && result.error) || "Something went wrong");
            setData(result as PlanData);
            // Update URL (sync with GET)
            window.history.pushState(
                {},
                "",
                `?city=${form.city}&country=${form.country}&days=${form.days}`,
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    // 🔹 GET (Query Params Auto Load)
    const fetchPlanGET = async (city: string, country: string, days: string) => {
        setLoading(true);
        setError("");
        setData(null);

        try {
            const res = await fetch(
                `https://imgixy.vercel.app/ai/chat/sdk/plan?city=${city}&country=${country}&days=${days}`,
            );
            const result = await res.json() as { error?: string };
            if (!res.ok) throw new Error((result && result.error) || "Failed");
            setData(result as PlanData);
            // sync form
            setForm({ city, country, days: Number(days) });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };
    // 🔹 On page load → check URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const city = params.get("city");
        const country = params.get("country");
        const days = params.get("days");

        if (city && country && days) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchPlanGET(city, country, days);
        }
    }, [])

    return (
        <div className="container py-5">
            <h2>AI Planner</h2>
            <form className='card p-4 shadow' onSubmit={handleSubmit}>
                <div className='row g-3'>
                    <div className='col-md-4'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='City'
                            name='city'
                            value={form.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='col-md-4'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Country'
                            name='country'
                            value={form.country}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='col-md-2'>
                        <input
                            type='number'
                            className='form-control'
                            name='days'
                            value={form.days}
                            onChange={handleInputChange}
                            min='1'
                        />
                    </div>

                    <div className='col-md-2 d-grid'>
                        <button className='btn btn-primary'>
                            {loading ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </div>
            </form>
            {/* ERROR */}
            {error && <div className='alert alert-danger mt-4'>{error}</div>}

            {/* RESULT */}
            {data && (
                <div className='mt-5'>
                    <h3>{data.destination}</h3>
                    <p>
                        <strong>Best Time:</strong> {data.best_time}
                    </p>
                    <p>
                        <strong>Duration:</strong> {data.duration_days} days
                    </p>

                    <h5 className='mt-3'>Top Attractions</h5>
                    <ul>
                        {data.top_attractions?.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>

                    <h5 className='mt-3'>Itinerary</h5>
                    {data.sample_itinerary?.map((day, i) => (
                        <div key={i} className='card mb-2 p-2'>
                            <strong>Day {day.day}:</strong> {day.plan}
                        </div>
                    ))}

                    <h5 className='mt-3'>Budget (EUR)</h5>
                    <p>
                        Low: {data.estimated_budget_eur?.low} | Mid:{" "}
                        {data.estimated_budget_eur?.mid} | High:{" "}
                        {data.estimated_budget_eur?.high}
                    </p>

                    <h5 className='mt-3'>Local Tips</h5>
                    <ul>
                        {data.local_tips?.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Planner
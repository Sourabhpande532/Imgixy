import { useState, useEffect } from "react"

const Planner = () => {
    const [form, setForm] = useState({ city: "", country: "", days: 3 })
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    function handleSubmit(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleChange() {

    }
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='col-md-2'>
                        <input
                            type='number'
                            className='form-control'
                            name='days'
                            value={form.days}
                            onChange={handleChange}
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
        </div>
    )
}

export default Planner
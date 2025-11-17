import { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

function ProjectSetup() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", agency: "", county: "", state: "", project_number: "", address: "" });
  const [rates, setRates] = useState([{ craft: "Electrician", base_rate: 50, fringe_rate: 15, apprentice_factor: 0.6 }] );
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch(`${API}/projects`);
    const data = await res.json();
    setProjects(data);
  }
  useEffect(() => { load(); }, []);

  const addRate = () => setRates([...rates, { craft: "", base_rate: 0, fringe_rate: 0, apprentice_factor: 0.6 }]);
  const updateRate = (i, k, v) => {
    const next = [...rates];
    next[i][k] = k.includes("rate") || k === 'apprentice_factor' ? Number(v) : v;
    setRates(next);
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, wage_templates: rates };
    await fetch(`${API}/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setForm({ name: "", agency: "", county: "", state: "", project_number: "", address: "" });
    setRates([{ craft: "", base_rate: 0, fringe_rate: 0, apprentice_factor: 0.6 }]);
    await load();
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">New Project</h2>
        <form onSubmit={submit} className="grid gap-3">
          <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Project name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Agency" value={form.agency} onChange={e=>setForm({...form, agency:e.target.value})}/>
            <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Project #" value={form.project_number} onChange={e=>setForm({...form, project_number:e.target.value})}/>
            <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="County" value={form.county} onChange={e=>setForm({...form, county:e.target.value})}/>
            <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="State" value={form.state} onChange={e=>setForm({...form, state:e.target.value})}/>
            <input className="bg-slate-900/60 text-white rounded px-3 py-2 md:col-span-2" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-blue-200">Wage Templates</h3>
              <button type="button" onClick={addRate} className="text-sm text-white/80 bg-blue-600 hover:bg-blue-500 rounded px-3 py-1">Add Craft</button>
            </div>
            <div className="space-y-2">
              {rates.map((r,i)=> (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Craft" value={r.craft} onChange={e=>updateRate(i,'craft',e.target.value)}/>
                  <input type="number" className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Base Rate" value={r.base_rate} onChange={e=>updateRate(i,'base_rate',e.target.value)}/>
                  <input type="number" className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Fringe Rate" value={r.fringe_rate} onChange={e=>updateRate(i,'fringe_rate',e.target.value)}/>
                  <input type="number" className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Apprentice Factor" value={r.apprentice_factor} onChange={e=>updateRate(i,'apprentice_factor',e.target.value)}/>
                </div>
              ))}
            </div>
          </div>
          <button disabled={loading} className="mt-3 bg-green-600 hover:bg-green-500 text-white rounded px-4 py-2 w-max">{loading? 'Saving...' : 'Save Project'}</button>
        </form>
      </div>

      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Projects</h2>
        <div className="grid gap-2">
          {projects.map(p => (
            <div key={p._id} className="flex items-center justify-between bg-slate-900/50 rounded px-4 py-2">
              <div>
                <div className="text-white font-medium">{p.name}</div>
                <div className="text-blue-300/60 text-sm">{p.agency || '—'} • {p.county || ''} {p.state || ''}</div>
              </div>
              <div className="text-xs text-blue-300/60">{(p.wage_templates||[]).length} crafts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectSetup;
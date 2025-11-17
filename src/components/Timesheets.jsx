import { useEffect, useMemo, useState } from "react";
const API = import.meta.env.VITE_BACKEND_URL || "";

function Timesheets(){
  const [projectId, setProjectId] = useState("");
  const [weekEnding, setWeekEnding] = useState("");
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ employee_name: "", date: "", craft: "", hours: 8, apprentice: false });

  const loadInit = async () => {
    const [p] = await Promise.all([
      fetch(`${API}/projects`).then(r=>r.json()),
    ]);
    setProjects(p);
    if(p[0]?._id) setProjectId(p[0]._id);
  };
  useEffect(()=>{ loadInit(); },[]);

  const addEntry = () => {
    if(!projectId || !weekEnding) return alert('Pick project and week ending');
    setEntries([...entries, { ...form, project_id: projectId, week_ending: weekEnding }]);
  }

  const upload = async () => {
    if(entries.length===0) return;
    await fetch(`${API}/timesheets/bulk`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ entries }) });
    setEntries([]);
    alert('Uploaded');
  }

  const crafts = useMemo(()=>{
    const proj = projects.find(p=>p._id===projectId);
    return (proj?.wage_templates||[]).map(r=>r.craft)
  },[projectId, projects]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 grid gap-3">
        <h2 className="text-white font-semibold">Timesheet Entry</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <select value={projectId} onChange={e=>setProjectId(e.target.value)} className="bg-slate-900/60 text-white rounded px-3 py-2">
            <option value="">Select project</option>
            {projects.map(p=> <option value={p._id} key={p._id}>{p.name}</option>)}
          </select>
          <input type="date" value={weekEnding} onChange={e=>setWeekEnding(e.target.value)} className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Week ending"/>
          <input value={form.employee_name} onChange={e=>setForm({...form, employee_name:e.target.value})} className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Employee name"/>
          <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="bg-slate-900/60 text-white rounded px-3 py-2"/>
          <select value={form.craft} onChange={e=>setForm({...form, craft:e.target.value})} className="bg-slate-900/60 text-white rounded px-3 py-2">
            <option value="">Craft</option>
            {crafts.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" value={form.hours} onChange={e=>setForm({...form, hours:Number(e.target.value)})} className="bg-slate-900/60 text-white rounded px-3 py-2"/>
          <label className="text-blue-200 flex items-center gap-2"><input type="checkbox" checked={form.apprentice} onChange={e=>setForm({...form, apprentice:e.target.checked})}/> Apprentice</label>
          <button onClick={addEntry} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Add Entry</button>
        </div>

        {entries.length>0 && (
          <div className="mt-4">
            <h3 className="text-white font-medium mb-2">Staged Entries</h3>
            <div className="grid gap-2">
              {entries.map((e,i)=> (
                <div key={i} className="text-blue-200 bg-slate-900/50 rounded px-3 py-2 text-sm flex items-center justify-between">
                  <div>{e.employee_name} • {e.date} • {e.craft} • {e.hours}h {e.apprentice? '(Apprentice)' : ''}</div>
                  <button className="text-red-300" onClick={()=> setEntries(entries.filter((_,x)=>x!==i))}>Remove</button>
                </div>
              ))}
            </div>
            <button onClick={upload} className="mt-3 bg-green-600 hover:bg-green-500 text-white rounded px-4 py-2">Upload</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timesheets;
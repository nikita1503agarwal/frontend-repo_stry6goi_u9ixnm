import { useEffect, useState } from "react";
const API = import.meta.env.VITE_BACKEND_URL || "";

function Submissions(){
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [weekEnding, setWeekEnding] = useState("");
  const [list, setList] = useState([]);
  const [generating, setGenerating] = useState(false);

  const loadProjects = async () => {
    const res = await fetch(`${API}/projects`);
    const data = await res.json();
    setProjects(data);
    if(data[0]?._id) setProjectId(data[0]._id);
  };
  useEffect(()=>{ loadProjects(); },[]);

  const refresh = async () => {
    const qs = new URLSearchParams({ ...(projectId? { project_id: projectId }: {}), ...(weekEnding? { week_ending: weekEnding }: {}) });
    const res = await fetch(`${API}/submissions?${qs.toString()}`);
    const data = await res.json();
    setList(data);
  }

  const generate = async () => {
    if(!projectId || !weekEnding) return alert('Pick project and week ending');
    setGenerating(true);
    await fetch(`${API}/submissions/generate`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ project_id: projectId, week_ending: weekEnding })});
    await refresh();
    setGenerating(false);
  }

  useEffect(()=>{ if(projectId || weekEnding) refresh(); }, [projectId, weekEnding]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 grid gap-3">
        <h2 className="text-white font-semibold">Submissions</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <select value={projectId} onChange={e=>setProjectId(e.target.value)} className="bg-slate-900/60 text-white rounded px-3 py-2">
            <option value="">Select project</option>
            {projects.map(p=> <option value={p._id} key={p._id}>{p.name}</option>)}
          </select>
          <input type="date" value={weekEnding} onChange={e=>setWeekEnding(e.target.value)} className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Week ending"/>
          <button onClick={generate} disabled={generating} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">{generating? 'Generating...' : 'Generate'}</button>
        </div>
        <div className="mt-4 grid gap-2">
          {list.map(s => (
            <div key={s._id} className="bg-slate-900/50 rounded px-4 py-3 text-blue-200 flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Week ending {s.week_ending}</div>
                <div className="text-xs text-blue-300/60">Hours: {s.totals?.hours} • Gross: ${s.totals?.gross}</div>
                {s.warnings?.length>0 && (<div className="text-xs text-yellow-300 mt-1">Warnings: {s.warnings.join(', ')}</div>)}
              </div>
              <div className="text-xs text-blue-300/60">Status: {s.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Submissions;
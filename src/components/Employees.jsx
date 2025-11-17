import { useEffect, useState } from "react";
const API = import.meta.env.VITE_BACKEND_URL || "";

function Employees(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", last_four_ssn: "", classification: "" });

  const load = async () => {
    const res = await fetch(`${API}/employees`);
    const data = await res.json();
    setList(data);
  }
  useEffect(()=>{ load(); },[]);

  const submit = async (e) => {
    e.preventDefault();
    await fetch(`${API}/employees`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: "", last_four_ssn: "", classification: "" });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-3">Add Employee</h2>
        <form onSubmit={submit} className="grid md:grid-cols-3 gap-3">
          <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
          <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Last 4 SSN" value={form.last_four_ssn} onChange={e=>setForm({...form, last_four_ssn:e.target.value})}/>
          <input className="bg-slate-900/60 text-white rounded px-3 py-2" placeholder="Classification" value={form.classification} onChange={e=>setForm({...form, classification:e.target.value})}/>
          <button className="bg-green-600 hover:bg-green-500 text-white rounded px-4 py-2 md:col-span-3 w-max">Save</button>
        </form>
      </div>

      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-3">Employees</h2>
        <div className="grid gap-2">
          {list.map(e => (
            <div key={e._id} className="flex items-center justify-between bg-slate-900/50 rounded px-4 py-2">
              <div className="text-white">{e.name}</div>
              <div className="text-blue-300/60 text-sm">{e.classification||'—'} {e.last_four_ssn ? `• ****${e.last_four_ssn}` : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Employees;
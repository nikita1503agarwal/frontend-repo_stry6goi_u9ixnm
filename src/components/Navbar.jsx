import { useState } from "react";

function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "projects", label: "Projects" },
    { key: "employees", label: "Employees" },
    { key: "timesheets", label: "Timesheets" },
    { key: "submissions", label: "Submissions" },
  ];
  return (
    <div className="w-full border-b border-white/10 bg-slate-900/70 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-white font-bold text-lg">PrevailPay</div>
        <button className="text-blue-200 md:hidden" onClick={() => setOpen(!open)}>Menu</button>
        <div className={`md:flex gap-6 ${open ? 'block' : 'hidden'} md:block`}>
          {items.map(it => (
            <button key={it.key} onClick={() => onNavigate(it.key)} className="text-blue-200 hover:text-white transition">
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
import { useState } from 'react'
import Navbar from './components/Navbar'
import ProjectSetup from './components/ProjectSetup'
import Employees from './components/Employees'
import Timesheets from './components/Timesheets'
import Submissions from './components/Submissions'

function App() {
  const [route, setRoute] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-200">
      <Navbar onNavigate={setRoute} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {route === 'dashboard' && (
          <div className="grid gap-6">
            <div className="bg-slate-800/60 border border-white/10 rounded-xl p-8">
              <h1 className="text-3xl font-bold text-white">Welcome to PrevailPay</h1>
              <p className="mt-2 text-blue-300/80">Set up a project with wage templates, add employees, upload timesheets, then generate weekly submissions with one click.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <div className="text-white font-semibold">1. Create a Project</div>
                <div className="text-sm text-blue-300/70">County, craft, wage + fringe rates</div>
              </div>
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <div className="text-white font-semibold">2. Add Employees</div>
                <div className="text-sm text-blue-300/70">Names and optional last-4 SSN</div>
              </div>
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6">
                <div className="text-white font-semibold">3. Upload Timesheets</div>
                <div className="text-sm text-blue-300/70">CSV or quick manual entry</div>
              </div>
            </div>
          </div>
        )}
        {route === 'projects' && <ProjectSetup />}
        {route === 'employees' && <Employees />}
        {route === 'timesheets' && <Timesheets />}
        {route === 'submissions' && <Submissions />}
      </div>
    </div>
  )
}

export default App

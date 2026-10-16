'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  Archive,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Container,
  Crosshair,
  FileCheck2,
  Hash,
  MapPin,
  Menu,
  PackageCheck,
  Radio,
  ScanLine,
  ShieldCheck,
  Siren,
  Tag,
  Truck,
  X,
} from 'lucide-react'

type CheckStatus = 'pending' | 'verified' | 'flagged'

type Verification = {
  id: string
  label: string
  detail: string
  icon: typeof ShieldCheck
  status: CheckStatus
}

const initialChecks: Verification[] = [
  { id: 'seal', label: 'Seal integrity', detail: 'Physical seal matches manifest', icon: ShieldCheck, status: 'verified' },
  { id: 'identity', label: 'Container identity', detail: 'ISO code and serial confirmed', icon: Container, status: 'verified' },
  { id: 'condition', label: 'Exterior condition', detail: 'No visible breach or damage', icon: PackageCheck, status: 'pending' },
  { id: 'temperature', label: 'Temperature log', detail: 'Cold chain within tolerance', icon: Activity, status: 'pending' },
]

function statusLabel(status: CheckStatus) {
  if (status === 'verified') return 'VERIFIED'
  if (status === 'flagged') return 'FLAGGED'
  return 'AWAITING'
}

export default function Page() {
  const [checks, setChecks] = useState(initialChecks)
  const [activeModule, setActiveModule] = useState('intake')
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [manifestId, setManifestId] = useState('SCM-0841-AX')

  const verifiedCount = useMemo(() => checks.filter((check) => check.status === 'verified').length, [checks])
  const progress = Math.round((verifiedCount / checks.length) * 100)

  function cycleCheck(id: string) {
    setChecks((current) => current.map((check) => {
      if (check.id !== id) return check
      const next: Record<CheckStatus, CheckStatus> = { pending: 'verified', verified: 'flagged', flagged: 'pending' }
      return { ...check, status: next[check.status] }
    }))
    setSubmitted(false)
  }

  function submitManifest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="portal-shell">
      <div className="scanline" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark"><Crosshair size={22} strokeWidth={1.5} /></div>
          <div>
            <p className="eyebrow">SILENT SECURITY // FIELD SYSTEM 07</p>
            <h1>Serpent Cargo <span>Manifest Matrix</span></h1>
          </div>
        </div>
        <div className="topbar-status">
          <div className="signal"><span className="live-dot" /> LOCAL NODE ACTIVE</div>
          <div className="node-id">NODE // YARD-04</div>
          <button className="menu-button" aria-label="Open navigation" onClick={() => setMenuOpen((open) => !open)}><Menu size={19} /></button>
        </div>
      </header>

      {menuOpen && (
        <nav className="quick-menu" aria-label="Portal navigation">
          <button onClick={() => { setActiveModule('intake'); setMenuOpen(false) }}>01 / Intake module</button>
          <button onClick={() => { setActiveModule('history'); setMenuOpen(false) }}>02 / Local ledger</button>
          <button onClick={() => { setActiveModule('protocol'); setMenuOpen(false) }}>03 / Yard protocol</button>
        </nav>
      )}

      <section className="status-strip" aria-label="System status">
        <div><span className="strip-label">SYSTEM</span><strong>MANIFEST INTAKE</strong></div>
        <div><span className="strip-label">MODE</span><strong>OFFLINE / LOCAL</strong></div>
        <div><span className="strip-label">LAST SYNC</span><strong>--:--:-- / STANDBY</strong></div>
        <div className="security-chip"><ShieldCheck size={14} /> DEFENSIVE GRID: NOMINAL</div>
      </section>

      <div className="content-grid">
        <aside className="side-rail">
          <div className="rail-heading"><span>OPERATIONS</span><span className="rail-count">03</span></div>
          <button className={`rail-item ${activeModule === 'intake' ? 'active' : ''}`} onClick={() => setActiveModule('intake')}>
            <span><ClipboardCheck size={16} /> 01 / Cargo intake</span><ArrowRight size={14} />
          </button>
          <button className={`rail-item ${activeModule === 'history' ? 'active' : ''}`} onClick={() => setActiveModule('history')}>
            <span><Archive size={16} /> 02 / Local ledger</span><ArrowRight size={14} />
          </button>
          <button className={`rail-item ${activeModule === 'protocol' ? 'active' : ''}`} onClick={() => setActiveModule('protocol')}>
            <span><FileCheck2 size={16} /> 03 / Yard protocol</span><ArrowRight size={14} />
          </button>
          <div className="rail-note"><Siren size={15} /><span>All entries remain local until authorized sync.</span></div>
          <div className="rail-footer"><span>ENCRYPTION</span><strong>SS/256-A</strong></div>
        </aside>

        <section className="workspace">
          {activeModule === 'intake' ? (
            <form onSubmit={submitManifest}>
              <div className="workspace-heading">
                <div><p className="eyebrow">MODULE 01 / YARD INTAKE</p><h2>Container verification intake</h2><p className="muted">Log a physical verification pass before the cargo enters the secure lane.</p></div>
                <div className="progress-readout"><span>PASS COVERAGE</span><strong>{progress}%</strong><div className="progress-track"><i style={{ width: `${progress}%` }} /></div></div>
              </div>

              <div className="panel-grid">
                <div className="panel manifest-panel">
                  <div className="panel-top"><span><Hash size={14} /> IDENTIFICATION</span><span className="panel-index">A-01</span></div>
                  <div className="field-grid">
                    <label>Manifest reference<input value={manifestId} onChange={(event) => { setManifestId(event.target.value); setSubmitted(false) }} /></label>
                    <label>Yard location<div className="input-with-icon"><MapPin size={15} /><input defaultValue="NORTH GATE / LANE 04" /></div></label>
                    <label>Container / ISO code<input defaultValue="MSCU 482901 6" /></label>
                    <label>Carrier / operator<input defaultValue="MAERSK LINE // MRSK" /></label>
                  </div>
                  <div className="field-grid lower-fields">
                    <label>Arrival date<input type="date" defaultValue="2026-10-15" /></label>
                    <label>Load classification<select defaultValue="priority"><option value="priority">PRIORITY / SEALED</option><option value="standard">STANDARD / SEALED</option><option value="hold">HOLD / REVIEW</option></select></label>
                  </div>
                </div>

                <div className="panel telemetry-panel">
                  <div className="panel-top"><span><Radio size={14} /> TELEMETRY</span><span className="panel-index">LIVE</span></div>
                  <div className="telemetry-row"><span>GATE RECEIVER</span><strong className="amber">ONLINE</strong></div>
                  <div className="telemetry-row"><span>LAST PING</span><strong>14:22:08</strong></div>
                  <div className="telemetry-row"><span>GPS FIX</span><strong>N 51° 30.2' / W 0° 07.5'</strong></div>
                  <div className="telemetry-row"><span>LOCAL STORAGE</span><strong>84% / READY</strong></div>
                  <div className="telemetry-footer"><Clock3 size={14} /> CAPTURED LOCALLY / NO NETWORK REQUIRED</div>
                </div>
              </div>

              <div className="panel verification-panel">
                <div className="panel-top"><span><ScanLine size={14} /> VERIFICATION CHECKS</span><span className="panel-index">{verifiedCount.toString().padStart(2, '0')} / 04 CLEAR</span></div>
                <div className="check-list">
                  {checks.map((check) => {
                    const Icon = check.icon
                    return <button type="button" className={`check-row ${check.status}`} key={check.id} onClick={() => cycleCheck(check.id)} aria-label={`Set ${check.label} status, currently ${statusLabel(check.status)}`}>
                      <span className="check-icon"><Icon size={17} /></span><span className="check-copy"><strong>{check.label}</strong><small>{check.detail}</small></span><span className="check-state">{check.status === 'verified' ? <Check size={14} /> : check.status === 'flagged' ? <X size={14} /> : <Clock3 size={14} />} {statusLabel(check.status)}</span>
                    </button>
                  })}
                </div>
                <p className="hint"><Tag size={13} /> Select each row to cycle status: awaiting → verified → flagged.</p>
              </div>

              <div className="action-row"><span className="action-note"><span className="keycap">F9</span> SAVE LOCALLY</span><button type="submit" className="submit-button"><CheckCircle2 size={17} /> COMMIT MANIFEST <ArrowRight size={16} /></button></div>
              {submitted && <div className="confirmation"><CheckCircle2 size={16} /> Manifest {manifestId || 'UNASSIGNED'} committed to local ledger. Awaiting authorization for sync.</div>}
            </form>
          ) : (
            <div className="empty-module"><div className="module-icon">{activeModule === 'history' ? <Archive size={28} /> : <FileCheck2 size={28} />}</div><p className="eyebrow">MODULE 0{activeModule === 'history' ? '2' : '3'}</p><h2>{activeModule === 'history' ? 'Local ledger' : 'Yard protocol'}</h2><p className="muted">This module is available on the local node. Return to cargo intake to create a new record.</p><button className="text-button" onClick={() => setActiveModule('intake')}>Return to intake <ArrowRight size={15} /></button></div>
          )}
        </section>
      </div>

      <footer className="footer"><span>BACKED BY THE DEFENSIVE AUTHORITY OF <strong>SILENT SECURITY</strong> AND <strong>SERPENT INTELLIGENCE SYSTEMS</strong>.</span><span>BUILD 07.4.1 // LOCAL AUTHORITY</span></footer>
    </main>
  )
}

export { Truck }

import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import type { Subject } from '../types'

type Props = {
  subjects: Subject[]
  onImport: (data: Subject[]) => void
}

export default function NavBar({ subjects, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const blob = new Blob([JSON.stringify(subjects, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `exam-tracker-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((s: any) => ({
            ...s,
            videos: (s.videos ?? []).map((v: any) => ({
              ...v,
              durationSeconds: v.durationSeconds ?? (v.durationMinutes ?? 0) * 60,
            })),
          }))
          onImport(migrated)
        }
      } catch {
        alert('Invalid file — could not parse JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6 flex items-stretch h-[52px]">

        {/* Logo */}
        <div className="flex items-center gap-2 pr-6 border-r border-[#1a1a1a]">
          <div className="w-5 h-5 rounded bg-white flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-sm bg-black" />
          </div>
          <span className="text-[13px] font-semibold text-[#ededed] tracking-tight">Exam Tracker</span>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-stretch ml-1">
          {[
            { to: '/', label: 'Overview', end: true },
            { to: '/schedule', label: 'Schedule', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center px-4 text-[13px] transition-colors duration-150 ${
                  isActive ? 'text-[#ededed]' : 'text-[#666] hover:text-[#999]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-[#ededed]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1.5">
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button
            onClick={() => fileRef.current?.click()}
            className="h-7 px-3 text-[12px] text-[#888] hover:text-[#ededed] border border-[#262626] hover:border-[#444] rounded-md transition-all bg-transparent"
          >
            Import
          </button>
          <button
            onClick={handleExport}
            className="h-7 px-3 text-[12px] text-[#888] hover:text-[#ededed] border border-[#262626] hover:border-[#444] rounded-md transition-all bg-transparent"
          >
            Export
          </button>
        </div>
      </div>
    </header>
  )
}

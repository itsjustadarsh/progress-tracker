import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Subject } from '../types'
import SubjectRow from '../components/SubjectRow'
import AddSubjectModal from '../components/AddSubjectModal'
import { computeDailySchedule } from '../utils/timeline'
import type { DayItem } from '../utils/timeline'

type Props = {
  subjects: Subject[]
  addSubject: (name: string) => void
  removeSubject: (id: string) => void
  togglePyq: (id: string) => void
  toggleRevision: (id: string) => void
}

function ts(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function isPartial(item: DayItem) {
  return item.fromSeconds !== 0 || item.toSeconds !== item.totalDuration
}

export default function HomePage({ subjects, addSubject, removeSubject, togglePyq, toggleRevision }: Props) {
  const [showModal, setShowModal] = useState(false)

  const totalVideos = subjects.reduce((sum, s) => sum + s.videos.length, 0)
  const totalWatched = subjects.reduce((sum, s) => sum + s.videos.filter(v => v.watched).length, 0)
  const doneSubjects = subjects.filter(s => s.pyqDone && s.revisionDone).length

  // Today's schedule
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const allDays = computeDailySchedule(subjects, 4)
  const todaySchedule = allDays.find(d => d.date.getTime() === today.getTime())

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[15px] font-semibold text-[#ededed]">Overview</h1>
          <button
            onClick={() => setShowModal(true)}
            className="h-8 px-3.5 text-[12px] font-medium bg-white text-black rounded-md hover:bg-[#e6e6e6] transition-colors"
          >
            + Add Subject
          </button>
        </div>

        {/* Stats */}
        {subjects.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Subjects', value: String(subjects.length) },
              { label: 'Videos', value: `${totalWatched} / ${totalVideos}` },
              { label: 'Fully done', value: `${doneSubjects} / ${subjects.length}` },
            ].map(s => (
              <div key={s.label} className="border border-[#1a1a1a] rounded-lg px-4 py-3 bg-[#0a0a0a]">
                <p className="text-[11px] text-[#555] mb-1.5 uppercase tracking-wider font-medium">{s.label}</p>
                <p className="text-[22px] font-semibold font-mono tabular-nums text-[#ededed] leading-none">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Today's todo */}
        {todaySchedule && (
          <div className="border border-[#1a1a1a] rounded-lg mb-6 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-[#0a0a0a]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider bg-white text-black px-1.5 py-0.5 rounded">
                  Today
                </span>
                <span className="text-[12px] text-[#555]">
                  {todaySchedule.items.length} video{todaySchedule.items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Link
                to="/schedule"
                className="text-[12px] text-[#555] hover:text-[#888] transition-colors"
              >
                Full schedule →
              </Link>
            </div>
            <div>
              {todaySchedule.items.map((item, i) => {
                const partial = isPartial(item)
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 border-b border-[#111] last:border-0 hover:bg-[#0a0a0a] transition-colors"
                  >
                    <span className="text-[#333] text-[11px] font-mono w-4 text-right flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] text-[#ccc]">{item.videoTitle}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-[#444]">{item.subjectName}</span>
                        {partial && (
                          <>
                            <span className="text-[#2a2a2a]">·</span>
                            <span className="text-[11px] font-mono text-[#666] bg-[#111] border border-[#1e1e1e] px-1.5 py-px rounded">
                              {ts(item.fromSeconds)} → {ts(item.toSeconds)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#444]">{ts(item.watchSeconds)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Subjects table */}
        {subjects.length === 0 ? (
          <div className="border border-[#1a1a1a] rounded-lg p-16 text-center">
            <p className="text-[#444] text-[13px]">No subjects yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-[13px] text-[#555] hover:text-[#888] transition-colors"
            >
              Add your first subject →
            </button>
          </div>
        ) : (
          <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left py-2.5 px-4 text-[11px] font-medium text-[#444] uppercase tracking-wider">Subject</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-medium text-[#444] uppercase tracking-wider">Videos</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-medium text-[#444] uppercase tracking-wider">PYQs</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-medium text-[#444] uppercase tracking-wider">Revision</th>
                  <th className="py-2.5 px-4" />
                </tr>
              </thead>
              <tbody>
                {subjects.map(subject => (
                  <SubjectRow
                    key={subject.id}
                    subject={subject}
                    onTogglePyq={() => togglePyq(subject.id)}
                    onToggleRevision={() => toggleRevision(subject.id)}
                    onRemove={() => removeSubject(subject.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AddSubjectModal
          onAdd={addSubject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

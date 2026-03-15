import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Subject } from '../types'
import { computeDailySchedule } from '../utils/timeline'
import type { DayItem } from '../utils/timeline'

type Props = {
  subjects: Subject[]
}

function ts(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function studyLabel(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ''}`
  return `${m}m`
}

function isPartial(item: DayItem): boolean {
  return item.fromSeconds !== 0 || item.toSeconds !== item.totalDuration
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short' })
}

function yearLabel(date: Date): string {
  return date.getFullYear().toString()
}

export default function SchedulePage({ subjects }: Props) {
  const [seed, setSeed] = useState(0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = computeDailySchedule(subjects, 4, today)
  const unwatched = subjects.reduce((n, s) => n + s.videos.filter(v => !v.watched).length, 0)

  // seed is used to force-recompute (shows visual feedback); the schedule always starts from today
  void seed

  if (unwatched === 0) {
    return (
      <div className="min-h-screen bg-black text-[#ededed]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-[15px] font-semibold mb-6">Schedule</h1>
          <div className="border border-[#1a1a1a] rounded-lg p-16 text-center">
            <p className="text-[#444] text-[13px]">No unwatched videos — you're all caught up!</p>
            <Link to="/" className="mt-3 text-[12px] text-[#555] hover:text-[#888] transition-colors block">
              ← Back to overview
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[15px] font-semibold">Schedule</h1>
            <p className="text-[12px] text-[#444] font-mono mt-0.5">{days.length}d · {unwatched} videos</p>
          </div>
          <button
            onClick={() => setSeed(s => s + 1)}
            className="h-7 px-3 text-[12px] text-[#555] hover:text-[#888] border border-[#1a1a1a] hover:border-[#333] rounded-md transition-all bg-transparent"
            title="Rebase schedule to today"
          >
            ↻ Regenerate
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {days.map((day, i) => {
            const isToday = day.date.getTime() === today.getTime()
            const isPast = day.date < today
            const fillPct = Math.min(100, Math.round((day.usedSeconds / day.budgetSeconds) * 100))

            return (
              <div
                key={i}
                className={`border rounded-lg overflow-hidden transition-all ${
                  isToday
                    ? 'border-[#333]'
                    : isPast
                    ? 'border-[#111] opacity-35'
                    : 'border-[#1a1a1a]'
                }`}
              >
                {/* Day header */}
                <div className={`flex items-center justify-between px-4 py-2.5 border-b border-[#111] ${isToday ? 'bg-[#0d0d0d]' : ''}`}>
                  <div className="flex items-center gap-2.5">
                    {isToday && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-white text-black px-1.5 py-0.5 rounded">
                        Today
                      </span>
                    )}
                    <span className="text-[13px] font-medium text-[#ccc]">{dayLabel(day.date)}</span>
                    <span className="text-[11px] text-[#333]">{yearLabel(day.date)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#444] font-mono">{studyLabel(day.usedSeconds)} / 4h</span>
                    <div className="w-20 h-px bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#555] rounded-full" style={{ width: `${fillPct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  {day.items.map((item, j) => {
                    const partial = isPartial(item)
                    const isContinued = item.fromSeconds > 0
                    const splitsNext = item.toSeconds < item.totalDuration

                    return (
                      <div
                        key={j}
                        className="flex items-start gap-3 px-4 py-2.5 border-b border-[#0d0d0d] last:border-0 hover:bg-[#0a0a0a] transition-colors"
                      >
                        <span className="text-[#2a2a2a] text-[11px] font-mono w-4 text-right flex-shrink-0 pt-px">{j + 1}</span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] text-[#ccc]">{item.videoTitle}</span>
                            {isContinued && (
                              <span className="text-[10px] text-[#7a6020] bg-[#1a1500] border border-[#2a2000] px-1.5 py-px rounded font-medium">
                                continued
                              </span>
                            )}
                            {splitsNext && (
                              <span className="text-[10px] text-[#1e5a8a] bg-[#001525] border border-[#002035] px-1.5 py-px rounded font-medium">
                                continues tomorrow
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[11px] text-[#3a3a3a]">{item.subjectName}</span>
                            {partial && (
                              <>
                                <span className="text-[#1e1e1e]">·</span>
                                <span className="text-[11px] font-mono text-[#555] bg-[#0d0d0d] border border-[#1a1a1a] px-2 py-px rounded">
                                  {ts(item.fromSeconds)} → {ts(item.toSeconds)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-[12px] font-mono text-[#555]">{ts(item.watchSeconds)}</div>
                          <div className="text-[10px] font-mono text-[#333]">{studyLabel(item.studySeconds)}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import type { Subject } from '../types'
import { computeTimeline, formatDate, formatDuration, formatDurationSeconds } from '../utils/timeline'

type Props = {
  subjects: Subject[]
}

export default function TimelineCard({ subjects }: Props) {
  const tl = computeTimeline(subjects)

  if (tl.unwatchedCount === 0) {
    return (
      <div className="border border-zinc-800/60 rounded-xl p-6 mt-6">
        <p className="text-zinc-500 text-sm">No unwatched videos — you're all caught up.</p>
      </div>
    )
  }

  return (
    <div className="border border-zinc-800/60 rounded-xl p-6 mt-6">
      <h2 className="text-sm font-semibold text-white mb-4">Timeline</h2>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Unwatched', value: `${tl.unwatchedCount} videos` },
          { label: 'Raw time', value: formatDuration(tl.rawMinutes) },
          { label: 'Study time (2.5×)', value: formatDuration(tl.studyMinutes) },
          { label: 'Est. finish', value: formatDate(tl.globalFinish) },
        ].map(stat => (
          <div key={stat.label} className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg px-3 py-2.5">
            <p className="text-xs text-zinc-600 mb-1">{stat.label}</p>
            <p className="text-sm font-medium text-zinc-200 font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Per-subject schedule */}
      <div>
        <h3 className="text-zinc-500 text-xs font-medium mb-3 uppercase tracking-wider">Breakdown</h3>
        <div className="flex flex-col gap-2">
          {tl.schedule.map(item => (
            <div key={item.subjectId} className="border border-zinc-800/60 rounded-lg p-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-white text-sm font-medium">
                  {item.subjectName}
                  <span className="text-zinc-600 font-normal ml-2 text-xs">
                    {item.unwatchedCount} video{item.unwatchedCount !== 1 ? 's' : ''} left
                  </span>
                </span>
                <span className="text-zinc-500 text-xs">
                  by <span className="text-zinc-300">{formatDate(item.finishDate)}</span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {item.unwatchedVideos.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0" />
                    <span className="flex-1">{v.title}</span>
                    <span className="text-zinc-700 font-mono">{formatDurationSeconds(v.durationSeconds)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

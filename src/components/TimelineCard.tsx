import type { Subject } from '../types'
import { computeTimeline, formatDate, formatDuration } from '../utils/timeline'

type Props = {
  subjects: Subject[]
}

export default function TimelineCard({ subjects }: Props) {
  const tl = computeTimeline(subjects)

  if (tl.unwatchedCount === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mt-6">
        <p className="text-zinc-500 text-sm">No unwatched videos. You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mt-6">
      <h2 className="text-white font-semibold mb-4 text-sm">Timeline</h2>

      {/* Summary row */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-xs border-b border-zinc-800">
              <th className="text-left py-2 pr-6 font-medium">Unwatched</th>
              <th className="text-left py-2 pr-6 font-medium">Raw time</th>
              <th className="text-left py-2 pr-6 font-medium">Study time (2.5×)</th>
              <th className="text-left py-2 pr-6 font-medium">Days left</th>
              <th className="text-left py-2 font-medium">Est. finish</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-zinc-300">
              <td className="py-2.5 pr-6">{tl.unwatchedCount} videos</td>
              <td className="py-2.5 pr-6">{formatDuration(tl.rawMinutes)}</td>
              <td className="py-2.5 pr-6">{formatDuration(tl.studyMinutes)}</td>
              <td className="py-2.5 pr-6">{tl.totalDays} days</td>
              <td className="py-2.5 text-white font-medium">{formatDate(tl.globalFinish)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Per-subject schedule */}
      <div>
        <h3 className="text-zinc-500 text-xs font-medium mb-3 uppercase tracking-wider">TODO Breakdown</h3>
        <div className="flex flex-col gap-4">
          {tl.schedule.map(item => (
            <div key={item.subjectId} className="border border-zinc-800 rounded-md p-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-white text-sm font-medium">
                  {item.subjectName}
                  <span className="text-zinc-500 font-normal ml-2 text-xs">
                    {item.unwatchedCount} video{item.unwatchedCount !== 1 ? 's' : ''} left
                  </span>
                </span>
                <span className="text-zinc-400 text-xs">
                  Complete by:{' '}
                  <span className="text-white">{formatDate(item.finishDate)}</span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {item.unwatchedVideos.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0" />
                    <span className="flex-1">{v.title}</span>
                    <span className="text-zinc-700">{formatDuration(v.durationMinutes)}</span>
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

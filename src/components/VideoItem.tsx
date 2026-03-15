import type { Video } from '../types'

type Props = {
  video: Video
  onToggle: () => void
  onRemove: () => void
}

export default function VideoItem({ video, onToggle, onRemove }: Props) {
  const h = Math.floor(video.durationMinutes / 60)
  const m = video.durationMinutes % 60
  const duration = h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`

  return (
    <div className="flex items-center gap-3 py-2.5 px-4 border-b border-zinc-800 hover:bg-zinc-900/40 group">
      <input
        type="checkbox"
        checked={video.watched}
        onChange={onToggle}
        className="accent-white w-4 h-4 cursor-pointer flex-shrink-0"
      />
      <span className={`flex-1 text-sm ${video.watched ? 'text-zinc-500 line-through' : 'text-white'}`}>
        {video.title}
      </span>
      <span className="text-xs text-zinc-600">{duration}</span>
      <button
        onClick={onRemove}
        className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
      >
        remove
      </button>
    </div>
  )
}

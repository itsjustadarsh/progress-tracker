import { useRef, useState } from 'react'
import type { Video } from '../types'

type Props = {
  video: Video
  onToggle: () => void
  onRemove: () => void
  onRename: (title: string) => void
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function VideoItem({ video, onToggle, onRemove, onRename }: Props) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(video.title)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setEditValue(video.title)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commitEdit() {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== video.title) onRename(trimmed)
    setEditing(false)
  }

  function cancelEdit() {
    setEditValue(video.title)
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 py-2.5 px-4 border-b border-[#111] last:border-0 hover:bg-[#0a0a0a] group transition-colors">
      <input
        type="checkbox"
        checked={video.watched}
        onChange={onToggle}
        className="accent-white w-3.5 h-3.5 cursor-pointer flex-shrink-0"
      />

      {editing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={e => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') cancelEdit()
          }}
          className="flex-1 bg-[#111] border border-[#333] rounded px-2 py-0.5 text-[13px] text-[#ededed] outline-none focus:border-[#555]"
          autoFocus
        />
      ) : (
        <span className={`flex-1 text-[13px] ${video.watched ? 'text-[#333] line-through' : 'text-[#ccc]'}`}>
          {video.title}
        </span>
      )}

      <span className="text-[11px] text-[#333] font-mono tabular-nums flex-shrink-0">
        {formatDuration(video.durationSeconds)}
      </span>

      {!editing && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={startEdit} className="text-[11px] text-[#444] hover:text-[#888] transition-colors">
            rename
          </button>
          <span className="text-[#222]">·</span>
          <button onClick={onRemove} className="text-[11px] text-[#444] hover:text-[#666] transition-colors">
            remove
          </button>
        </div>
      )}
    </div>
  )
}

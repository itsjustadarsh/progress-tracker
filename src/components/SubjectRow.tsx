import { Link } from 'react-router-dom'
import type { Subject } from '../types'

type Props = {
  subject: Subject
  onTogglePyq: () => void
  onToggleRevision: () => void
  onRemove: () => void
}

export default function SubjectRow({ subject, onTogglePyq, onToggleRevision, onRemove }: Props) {
  const watched = subject.videos.filter(v => v.watched).length
  const total = subject.videos.length

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 group">
      <td className="py-3 px-4">
        <Link
          to={`/subject/${subject.id}`}
          className="text-white hover:text-zinc-300 transition-colors text-sm font-medium"
        >
          {subject.name}
        </Link>
      </td>
      <td className="py-3 px-4 text-sm text-zinc-400">
        {total === 0 ? (
          <span className="text-zinc-600">No videos</span>
        ) : (
          <span className={watched === total ? 'text-zinc-300' : 'text-zinc-400'}>
            {watched} / {total} watched
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <input
          type="checkbox"
          checked={subject.pyqDone}
          onChange={onTogglePyq}
          className="accent-white w-4 h-4 cursor-pointer"
        />
      </td>
      <td className="py-3 px-4">
        <input
          type="checkbox"
          checked={subject.revisionDone}
          onChange={onToggleRevision}
          className="accent-white w-4 h-4 cursor-pointer"
        />
      </td>
      <td className="py-3 px-4">
        <button
          onClick={onRemove}
          className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
        >
          remove
        </button>
      </td>
    </tr>
  )
}

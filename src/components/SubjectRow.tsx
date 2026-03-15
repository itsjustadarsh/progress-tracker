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
  const allDone = total > 0 && watched === total

  return (
    <tr className="border-b border-[#111] last:border-0 hover:bg-[#0a0a0a] group transition-colors">
      <td className="py-3 px-4">
        <Link
          to={`/subject/${subject.id}`}
          className="text-[13px] font-medium text-[#ccc] hover:text-white transition-colors"
        >
          {subject.name}
        </Link>
      </td>
      <td className="py-3 px-4">
        {total === 0 ? (
          <span className="text-[12px] text-[#333]">—</span>
        ) : (
          <span className={`text-[12px] font-mono tabular-nums ${allDone ? 'text-[#555]' : 'text-[#555]'}`}>
            {watched}/{total}
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <input
          type="checkbox"
          checked={subject.pyqDone}
          onChange={onTogglePyq}
          className="accent-white w-3.5 h-3.5 cursor-pointer"
        />
      </td>
      <td className="py-3 px-4">
        <input
          type="checkbox"
          checked={subject.revisionDone}
          onChange={onToggleRevision}
          className="accent-white w-3.5 h-3.5 cursor-pointer"
        />
      </td>
      <td className="py-3 px-4">
        <button
          onClick={onRemove}
          className="text-[#333] hover:text-[#666] opacity-0 group-hover:opacity-100 transition-all text-[11px]"
        >
          remove
        </button>
      </td>
    </tr>
  )
}

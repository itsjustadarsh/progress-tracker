import { useEffect, useRef, useState } from 'react'

type Props = {
  onAdd: (title: string, durationMinutes: number) => void
  onClose: () => void
}

export default function AddVideoModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const mins = parseInt(duration, 10)
    if (!trimmedTitle || isNaN(mins) || mins <= 0) return
    onAdd(trimmedTitle, mins)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-white font-semibold mb-4">Add Video</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Video title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm placeholder-zinc-500 outline-none focus:border-zinc-500"
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            min={1}
            className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm placeholder-zinc-500 outline-none focus:border-zinc-500"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-white text-black rounded hover:bg-zinc-100 transition-colors font-medium"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

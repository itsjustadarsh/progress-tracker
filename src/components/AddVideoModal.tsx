import { useEffect, useRef, useState } from 'react'

type Props = {
  onAdd: (title: string, durationSeconds: number) => void
  onClose: () => void
}

export default function AddVideoModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
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
    const h = parseInt(hours || '0', 10)
    const m = parseInt(minutes || '0', 10)
    const s = parseInt(seconds || '0', 10)
    const totalSeconds = h * 3600 + m * 60 + s
    if (!trimmedTitle || totalSeconds <= 0) return
    onAdd(trimmedTitle, totalSeconds)
    onClose()
  }

  const numInput = 'w-full bg-black border border-[#262626] rounded-md px-2 py-1.5 text-[13px] text-[#ededed] placeholder-[#333] outline-none focus:border-[#444] transition-colors text-center font-mono'

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-5 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-semibold text-[#ededed]">Add Video</h2>
          <button onClick={onClose} className="text-[#444] hover:text-[#888] transition-colors text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Video title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-black border border-[#262626] rounded-lg px-3 py-2 text-[13px] text-[#ededed] placeholder-[#333] outline-none focus:border-[#444] transition-colors"
          />

          <div>
            <p className="text-[11px] text-[#444] uppercase tracking-wider mb-2">Duration</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'hrs', value: hours, set: setHours, max: undefined },
                { label: 'min', value: minutes, set: setMinutes, max: 59 },
                { label: 'sec', value: seconds, set: setSeconds, max: 59 },
              ].map(field => (
                <div key={field.label} className="flex flex-col gap-1">
                  <input
                    type="number"
                    placeholder="00"
                    value={field.value}
                    onChange={e => field.set(e.target.value)}
                    min={0}
                    max={field.max}
                    className={numInput}
                  />
                  <span className="text-[10px] text-[#333] text-center">{field.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3.5 text-[12px] text-[#555] hover:text-[#888] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-3.5 text-[12px] font-medium bg-white text-black rounded-md hover:bg-[#e6e6e6] transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

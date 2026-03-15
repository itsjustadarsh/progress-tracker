import { useEffect, useRef, useState } from 'react'

type Props = {
  onAdd: (name: string) => void
  onClose: () => void
}

export default function AddSubjectModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
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
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    onClose()
  }

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
          <h2 className="text-[13px] font-semibold text-[#ededed]">Add Subject</h2>
          <button onClick={onClose} className="text-[#444] hover:text-[#888] transition-colors text-xl leading-none">
            ×
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Subject name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-black border border-[#262626] rounded-lg px-3 py-2 text-[13px] text-[#ededed] placeholder-[#333] outline-none focus:border-[#444] transition-colors"
          />
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

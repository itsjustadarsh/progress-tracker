import { useState } from 'react'
import type { Subject } from '../types'
import SubjectRow from '../components/SubjectRow'
import AddSubjectModal from '../components/AddSubjectModal'
import TimelineCard from '../components/TimelineCard'

type Props = {
  subjects: Subject[]
  addSubject: (name: string) => void
  removeSubject: (id: string) => void
  togglePyq: (id: string) => void
  toggleRevision: (id: string) => void
}

export default function HomePage({ subjects, addSubject, removeSubject, togglePyq, toggleRevision }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-white">Exam Tracker</h1>
            <p className="text-zinc-500 text-sm mt-0.5">4 hours/day study plan</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 text-sm bg-white text-black rounded hover:bg-zinc-100 transition-colors font-medium"
          >
            + Add Subject
          </button>
        </div>

        {/* Subjects table */}
        {subjects.length === 0 ? (
          <div className="border border-zinc-800 rounded-lg p-12 text-center">
            <p className="text-zinc-500 text-sm">No subjects yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Add your first subject →
            </button>
          </div>
        ) : (
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Subject</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Videos</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">PYQs</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Revision</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(subject => (
                    <SubjectRow
                      key={subject.id}
                      subject={subject}
                      onTogglePyq={() => togglePyq(subject.id)}
                      onToggleRevision={() => toggleRevision(subject.id)}
                      onRemove={() => removeSubject(subject.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Timeline */}
        <TimelineCard subjects={subjects} />
      </div>

      {showModal && (
        <AddSubjectModal
          onAdd={addSubject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

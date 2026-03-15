import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Subject } from '../types'
import VideoItem from '../components/VideoItem'
import AddVideoModal from '../components/AddVideoModal'

type Props = {
  subjects: Subject[]
  addVideo: (subjectId: string, title: string, durationMinutes: number) => void
  toggleWatched: (subjectId: string, videoId: string) => void
  removeVideo: (subjectId: string, videoId: string) => void
}

export default function SubjectPage({ subjects, addVideo, toggleWatched, removeVideo }: Props) {
  const { id } = useParams<{ id: string }>()
  const [showModal, setShowModal] = useState(false)

  const subject = subjects.find(s => s.id === id)

  if (!subject) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 text-sm">Subject not found.</p>
          <Link to="/" className="text-zinc-400 hover:text-white text-sm mt-2 block transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  const watched = subject.videos.filter(v => v.watched)
  const backlog = subject.videos.filter(v => !v.watched)

  const totalRaw = backlog.reduce((sum, v) => sum + v.durationMinutes, 0)
  const totalStudy = Math.round(totalRaw * 2.5)
  const h = Math.floor(totalStudy / 60)
  const m = totalStudy % 60
  const studyTimeStr = h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-4 block">
            ← All subjects
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">{subject.name}</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 text-sm bg-white text-black rounded hover:bg-zinc-100 transition-colors font-medium"
            >
              + Add Video
            </button>
          </div>
          <p className="text-zinc-500 text-sm mt-1">
            {subject.videos.length === 0
              ? 'No videos yet'
              : `${watched.length} / ${subject.videos.length} watched`}
          </p>
        </div>

        {subject.videos.length === 0 ? (
          <div className="border border-zinc-800 rounded-lg p-12 text-center">
            <p className="text-zinc-500 text-sm">No videos yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Add your first video →
            </button>
          </div>
        ) : (
          <>
            {/* Watched videos */}
            {watched.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2 px-1">
                  Watched
                </h2>
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                  {watched.map(video => (
                    <VideoItem
                      key={video.id}
                      video={video}
                      onToggle={() => toggleWatched(subject.id, video.id)}
                      onRemove={() => removeVideo(subject.id, video.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Backlog */}
            {backlog.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-2 px-1">
                  <h2 className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                    Backlog — {backlog.length} video{backlog.length !== 1 ? 's' : ''}
                  </h2>
                  {totalStudy > 0 && (
                    <span className="text-xs text-zinc-600">{studyTimeStr} study time</span>
                  )}
                </div>
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                  {backlog.map(video => (
                    <VideoItem
                      key={video.id}
                      video={video}
                      onToggle={() => toggleWatched(subject.id, video.id)}
                      onRemove={() => removeVideo(subject.id, video.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <AddVideoModal
          onAdd={(title, duration) => addVideo(subject.id, title, duration)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

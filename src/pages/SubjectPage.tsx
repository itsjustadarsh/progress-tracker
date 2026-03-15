import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Subject } from '../types'
import VideoItem from '../components/VideoItem'
import AddVideoModal from '../components/AddVideoModal'

type Props = {
  subjects: Subject[]
  addVideo: (subjectId: string, title: string, durationSeconds: number) => void
  toggleWatched: (subjectId: string, videoId: string) => void
  removeVideo: (subjectId: string, videoId: string) => void
  renameVideo: (subjectId: string, videoId: string, title: string) => void
}

function fmtStudy(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ''}`
  return `${m}m`
}

export default function SubjectPage({ subjects, addVideo, toggleWatched, removeVideo, renameVideo }: Props) {
  const { id } = useParams<{ id: string }>()
  const [showModal, setShowModal] = useState(false)

  const subject = subjects.find(s => s.id === id)

  if (!subject) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#444] text-[13px]">Subject not found.</p>
          <Link to="/" className="text-[#555] hover:text-[#888] text-[13px] mt-2 block transition-colors">
            ← Back
          </Link>
        </div>
      </div>
    )
  }

  const watched = subject.videos.filter(v => v.watched)
  const backlog = subject.videos.filter(v => !v.watched)
  const totalStudy = Math.round(backlog.reduce((sum, v) => sum + v.durationSeconds, 0) * 2.5)
  const progress = subject.videos.length > 0
    ? Math.round((watched.length / subject.videos.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-[#444] hover:text-[#666] text-[12px] transition-colors mb-6">
          ← Overview
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[15px] font-semibold text-[#ededed]">{subject.name}</h1>
            <p className="text-[12px] text-[#444] mt-1">
              {subject.videos.length === 0
                ? 'No videos yet'
                : `${watched.length} of ${subject.videos.length} watched`}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex-shrink-0 h-8 px-3.5 text-[12px] font-medium bg-white text-black rounded-md hover:bg-[#e6e6e6] transition-colors"
          >
            + Add Video
          </button>
        </div>

        {/* Progress bar */}
        {subject.videos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-[#444]">Progress</span>
              <span className="text-[11px] text-[#555] font-mono">{progress}%</span>
            </div>
            <div className="h-px bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ededed] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {subject.videos.length === 0 ? (
          <div className="border border-[#1a1a1a] rounded-lg p-16 text-center">
            <p className="text-[#444] text-[13px]">No videos yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-[13px] text-[#555] hover:text-[#888] transition-colors"
            >
              Add your first video →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {backlog.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-[11px] text-[#444] uppercase tracking-wider font-medium">
                    Backlog — {backlog.length} video{backlog.length !== 1 ? 's' : ''}
                  </h2>
                  {totalStudy > 0 && (
                    <span className="text-[11px] text-[#333] font-mono">{fmtStudy(totalStudy)} study time</span>
                  )}
                </div>
                <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
                  {backlog.map(video => (
                    <VideoItem
                      key={video.id}
                      video={video}
                      onToggle={() => toggleWatched(subject.id, video.id)}
                      onRemove={() => removeVideo(subject.id, video.id)}
                      onRename={title => renameVideo(subject.id, video.id, title)}
                    />
                  ))}
                </div>
              </div>
            )}

            {watched.length > 0 && (
              <div>
                <h2 className="text-[11px] text-[#444] uppercase tracking-wider font-medium mb-2">
                  Watched
                </h2>
                <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
                  {watched.map(video => (
                    <VideoItem
                      key={video.id}
                      video={video}
                      onToggle={() => toggleWatched(subject.id, video.id)}
                      onRemove={() => removeVideo(subject.id, video.id)}
                      onRename={title => renameVideo(subject.id, video.id, title)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
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

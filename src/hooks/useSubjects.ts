import { useState, useEffect } from 'react';
import type { Subject, Video } from '../types';

const STORAGE_KEY = 'exam-tracker-subjects';

function loadFromStorage(): Subject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Subject[];
    // migrate old durationMinutes → durationSeconds
    return data.map(s => ({
      ...s,
      videos: s.videos.map((v: any) => ({
        ...v,
        durationSeconds: v.durationSeconds ?? (v.durationMinutes ?? 0) * 60,
      })),
    }));
  } catch {
    return [];
  }
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  function addSubject(name: string) {
    const subject: Subject = {
      id: crypto.randomUUID(),
      name,
      videos: [],
      pyqDone: false,
      revisionDone: false,
    };
    setSubjects(prev => [...prev, subject]);
  }

  function removeSubject(id: string) {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }

  function togglePyq(id: string) {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, pyqDone: !s.pyqDone } : s))
    );
  }

  function toggleRevision(id: string) {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, revisionDone: !s.revisionDone } : s))
    );
  }

  function addVideo(subjectId: string, title: string, durationSeconds: number) {
    const video: Video = {
      id: crypto.randomUUID(),
      title,
      durationSeconds,
      watched: false,
      addedAt: new Date().toISOString(),
    };
    setSubjects(prev =>
      prev.map(s =>
        s.id === subjectId ? { ...s, videos: [...s.videos, video] } : s
      )
    );
  }

  function renameVideo(subjectId: string, videoId: string, title: string) {
    setSubjects(prev =>
      prev.map(s =>
        s.id === subjectId
          ? {
              ...s,
              videos: s.videos.map(v =>
                v.id === videoId ? { ...v, title } : v
              ),
            }
          : s
      )
    );
  }

  function toggleWatched(subjectId: string, videoId: string) {
    setSubjects(prev =>
      prev.map(s =>
        s.id === subjectId
          ? {
              ...s,
              videos: s.videos.map(v =>
                v.id === videoId ? { ...v, watched: !v.watched } : v
              ),
            }
          : s
      )
    );
  }

  function removeVideo(subjectId: string, videoId: string) {
    setSubjects(prev =>
      prev.map(s =>
        s.id === subjectId
          ? { ...s, videos: s.videos.filter(v => v.id !== videoId) }
          : s
      )
    );
  }

  function importSubjects(data: Subject[]) {
    setSubjects(data);
  }

  return {
    subjects,
    addSubject,
    removeSubject,
    togglePyq,
    toggleRevision,
    addVideo,
    renameVideo,
    toggleWatched,
    removeVideo,
    importSubjects,
  };
}

import { useState, useEffect } from 'react';
import type { Subject, Video } from '../types';

const STORAGE_KEY = 'exam-tracker-subjects';

function loadFromStorage(): Subject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Subject[]) : [];
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

  function addVideo(subjectId: string, title: string, durationMinutes: number) {
    const video: Video = {
      id: crypto.randomUUID(),
      title,
      durationMinutes,
      watched: false,
      addedAt: new Date().toISOString(),
    };
    setSubjects(prev =>
      prev.map(s =>
        s.id === subjectId ? { ...s, videos: [...s.videos, video] } : s
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

  return {
    subjects,
    addSubject,
    removeSubject,
    togglePyq,
    toggleRevision,
    addVideo,
    toggleWatched,
    removeVideo,
  };
}

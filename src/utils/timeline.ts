import type { Subject } from '../types';

export type SubjectSchedule = {
  subjectId: string;
  subjectName: string;
  unwatchedCount: number;
  unwatchedVideos: { title: string; durationMinutes: number }[];
  startDate: Date;
  finishDate: Date;
  studyMinutes: number;
};

export type TimelineSummary = {
  unwatchedCount: number;
  rawMinutes: number;
  studyMinutes: number;
  totalDays: number;
  globalFinish: Date;
  schedule: SubjectSchedule[];
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function computeTimeline(subjects: Subject[], today: Date = new Date()): TimelineSummary {
  // Normalize today to midnight
  const base = new Date(today);
  base.setHours(0, 0, 0, 0);

  const allUnwatched = subjects.flatMap(s =>
    s.videos.filter(v => !v.watched)
  );

  const rawMinutes = allUnwatched.reduce((sum, v) => sum + v.durationMinutes, 0);
  const studyMinutes = Math.round(rawMinutes * 2.5);
  const totalDays = Math.ceil(studyMinutes / 240);
  const globalFinish = addDays(base, totalDays);

  let cursor = new Date(base);
  const schedule: SubjectSchedule[] = [];

  for (const subject of subjects) {
    const unwatched = subject.videos.filter(v => !v.watched);
    if (unwatched.length === 0) continue;

    const subjectRaw = unwatched.reduce((sum, v) => sum + v.durationMinutes, 0);
    const subjectStudy = Math.round(subjectRaw * 2.5);
    const subjectDays = Math.ceil(subjectStudy / 240);

    const startDate = new Date(cursor);
    const finishDate = addDays(cursor, subjectDays);
    cursor = finishDate;

    schedule.push({
      subjectId: subject.id,
      subjectName: subject.name,
      unwatchedCount: unwatched.length,
      unwatchedVideos: unwatched.map(v => ({ title: v.title, durationMinutes: v.durationMinutes })),
      startDate,
      finishDate,
      studyMinutes: subjectStudy,
    });
  }

  return {
    unwatchedCount: allUnwatched.length,
    rawMinutes,
    studyMinutes,
    totalDays,
    globalFinish,
    schedule,
  };
}

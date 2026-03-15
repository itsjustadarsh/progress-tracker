import type { Subject } from '../types';

export type DayItem = {
  subjectName: string;
  videoTitle: string;
  totalDuration: number;   // full video length in seconds
  watchSeconds: number;    // seconds to actually watch today
  studySeconds: number;    // study budget consumed today
  fromSeconds: number;     // timestamp to start watching from
  toSeconds: number;       // timestamp to stop at
};

export type DaySchedule = {
  date: Date;
  items: DayItem[];
  usedSeconds: number;
  budgetSeconds: number;
};

export function computeDailySchedule(
  subjects: Subject[],
  hoursPerDay = 4,
  today: Date = new Date()
): DaySchedule[] {
  const budgetSec = hoursPerDay * 3600;
  const base = new Date(today);
  base.setHours(0, 0, 0, 0);

  // Build a work queue: each entry tracks how much of the video is left to schedule
  type QueueEntry = {
    subjectName: string;
    videoTitle: string;
    totalDuration: number;
    offset: number; // seconds already scheduled from this video
  };

  const queue: QueueEntry[] = [];
  for (const s of subjects) {
    for (const v of s.videos) {
      if (!v.watched) {
        queue.push({ subjectName: s.name, videoTitle: v.title, totalDuration: v.durationSeconds, offset: 0 });
      }
    }
  }

  const days: DaySchedule[] = [];
  let dayIndex = 0;
  let remaining = budgetSec;
  let items: DayItem[] = [];

  function flush() {
    days.push({
      date: addDays(base, dayIndex),
      items,
      usedSeconds: budgetSec - remaining,
      budgetSeconds: budgetSec,
    });
    dayIndex++;
    remaining = budgetSec;
    items = [];
  }

  for (const entry of queue) {
    let offset = entry.offset;

    while (offset < entry.totalDuration) {
      const leftInVideo = entry.totalDuration - offset;
      const studyForAll = Math.round(leftInVideo * 2.5);

      if (studyForAll <= remaining) {
        // Entire remaining portion fits today
        items.push({
          subjectName: entry.subjectName,
          videoTitle: entry.videoTitle,
          totalDuration: entry.totalDuration,
          watchSeconds: leftInVideo,
          studySeconds: studyForAll,
          fromSeconds: offset,
          toSeconds: entry.totalDuration,
        });
        remaining -= studyForAll;
        offset = entry.totalDuration;
        if (remaining === 0) flush();
      } else {
        // Split: watch as much as remaining budget allows
        const watchable = Math.floor(remaining / 2.5);
        if (watchable > 0) {
          items.push({
            subjectName: entry.subjectName,
            videoTitle: entry.videoTitle,
            totalDuration: entry.totalDuration,
            watchSeconds: watchable,
            studySeconds: remaining,
            fromSeconds: offset,
            toSeconds: offset + watchable,
          });
          offset += watchable;
        }
        flush();
      }
    }
  }

  if (items.length > 0) flush();
  return days;
}

export type SubjectSchedule = {
  subjectId: string;
  subjectName: string;
  unwatchedCount: number;
  unwatchedVideos: { title: string; durationSeconds: number }[];
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

export function formatDurationSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function computeTimeline(subjects: Subject[], today: Date = new Date()): TimelineSummary {
  // Normalize today to midnight
  const base = new Date(today);
  base.setHours(0, 0, 0, 0);

  const allUnwatched = subjects.flatMap(s =>
    s.videos.filter(v => !v.watched)
  );

  const rawSeconds = allUnwatched.reduce((sum, v) => sum + v.durationSeconds, 0);
  const rawMinutes = Math.round(rawSeconds / 60);
  const studyMinutes = Math.round(rawMinutes * 2.5);
  const totalDays = Math.ceil(studyMinutes / 240);
  const globalFinish = addDays(base, totalDays);

  let cursor = new Date(base);
  const schedule: SubjectSchedule[] = [];

  for (const subject of subjects) {
    const unwatched = subject.videos.filter(v => !v.watched);
    if (unwatched.length === 0) continue;

    const subjectRawSeconds = unwatched.reduce((sum, v) => sum + v.durationSeconds, 0);
    const subjectRawMinutes = Math.round(subjectRawSeconds / 60);
    const subjectStudy = Math.round(subjectRawMinutes * 2.5);
    const subjectDays = Math.ceil(subjectStudy / 240);

    const startDate = new Date(cursor);
    const finishDate = addDays(cursor, subjectDays);
    cursor = finishDate;

    schedule.push({
      subjectId: subject.id,
      subjectName: subject.name,
      unwatchedCount: unwatched.length,
      unwatchedVideos: unwatched.map(v => ({ title: v.title, durationSeconds: v.durationSeconds })),
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

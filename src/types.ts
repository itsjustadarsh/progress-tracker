export type Video = {
  id: string;
  title: string;
  durationSeconds: number;
  watched: boolean;
  addedAt: string;
};

export type Subject = {
  id: string;
  name: string;
  videos: Video[];
  pyqDone: boolean;
  revisionDone: boolean;
};

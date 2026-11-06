export type MovieStatus = "active" | "inactive";

export type VideoProvider = "local" | "cloud";

export type ProcessingStatus = "queued" | "processing" | "ready" | "failed";

export type MaturityRating = "G" | "PG" | "PG-13" | "R" | "NC-17" | "NR";

export interface MoviePerson {
  _id: string;
  name: string;
}


export interface MovieVideo {
  provider: VideoProvider;
  sourceKey: string;
  hlsUrl: string | null;
  dashUrl: string | null;
}

export interface MovieProcessing {
  status: ProcessingStatus;
  progress: number;
  error: string | null;
}

export interface Movie {
  _id: string;
  title: string;
  slug: string;
  description: string;
  tagline: string | null;

  releaseYear: number;
  runtime: number;
  maturityRating: MaturityRating;
  genres: string[];

  cast: MoviePerson[];
  directors: MoviePerson[];
  writers: MoviePerson[];

  poster: string | "";
  backdrop: string | null;
  logo: string | null;
  trailerUrl: string | null;
  video: MovieVideo;
  processing: MovieProcessing;
  featured: boolean;
  trending: boolean;
  published: boolean;
  premium: boolean;
  status: MovieStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

export interface MovieListResponse {
  detail: Movie[];
  message: string;
  status: string;
  options: {
    currentPage: number;
    limit: number;
    totalDate: number;
  };
}

export interface WatchHistory {
  _id: string;
  movie: Movie;
  user?: string;
  completed: boolean;
  duration: number;
  progress: number;
  lastWatchedAt: string;
  __v: number;
}



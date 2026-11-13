import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";
import { Movie } from "@/types/data";

const BACKEND_URL = "http://localhost:1100";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatNumber(num: number): string {
  return (num / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  //name=value;expires=value;path=value;
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname: string) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function formatDateTOYMD(date: string, format = "yyyy-MM-dd") {
  if (format === "yyyy-MM-dd") {
    return DateTime.fromJSDate(new Date(date)).toFormat("yyyy-MM-dd");
  } else if (format === "dd/MM/yyyy") {
    return DateTime.fromJSDate(new Date(date)).toFormat("dd/MM/yyyy");
  }
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const getBackendUrl = (path: string) => {
  if (!path || path === "undefined") return null;
  if (path.startsWith("http")) return path;
  const cleanPath = path.replace(/^undefined\//, "");
  return `${BACKEND_URL.replace(/\/$/, "")}/${cleanPath.replace(/^\//, "")}`;
};

export const normalizeMovie = (movie: Movie): Movie => ({
  ...movie,
  // poster: getBackendUrl(movie?.poster as string) ?? "",
  poster: `http://localhost:1100/movies/${movie._id}/images/poster.jpg`,
  // backdrop: getBackendUrl(movie?.backdrop as string),
  backdrop: `http://localhost:1100/movies/${movie._id}/images/backdrop.jpg`,

  logo: getBackendUrl(movie?.logo as string),
  video: {
    ...movie.video,
    hlsUrl: getBackendUrl(movie?.video?.hlsUrl as string),
    dashUrl: getBackendUrl(movie?.video?.dashUrl as string),
  },
});

export const normalizeMovies = (movies: Movie[]): Movie[] =>
  movies.map(normalizeMovie);

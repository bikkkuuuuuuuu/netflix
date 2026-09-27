import React, { useState } from "react";
import { Play, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Movie {
  id: string;
  title: string;
  genre: string;
  description: string;
  posterUrl: string;
  rating: string;
  year: string;
  duration: string;
}

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative cursor-pointer overflow-hidden rounded-[28px] bg-neutral-900 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/10 focus:outline-none focus:ring-2 focus:ring-white/20 aspect-[3/4] flex flex-col justify-end p-5 sm:p-6 select-none"
    >
      {/* Poster Image Background */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />

      {/* Dark Multi-layer Gradient Overlay for perfect readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

      {/* Card Content Container */}
      <div className="relative z-10 flex flex-col justify-end space-y-2">
        {/* Movie Title & Description Layout with Play Button */}
        <div className="flex items-end justify-between gap-3 pt-1">
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg sm:text-xl leading-snug tracking-tight drop-shadow-md line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-xs text-neutral-300 font-normal line-clamp-2 leading-relaxed opacity-90">
              {movie.description}
            </p>
          </div>

          {/* Frosted Glassmorphism Play Button */}
          <button
            aria-label={`Play ${movie.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
            className="shrink-0 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-white/25 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 active:scale-95 group/btn"
          >
            <Play className="h-5 w-5 fill-current ml-0.5 transition-transform duration-300 group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MovieSlider({
  title,
  mapItems,
  MOVIES,
}: {
  title?: String;
  mapItems?: number;
  MOVIES: Movie[];
}) {
  const navigate = useNavigate();
  return (
    <div className="text-white p-2  antialiased selection:bg-white selection:text-black ">
      {/* Component Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              {title ?? "New Releases"}
            </h1>
          </div>

          <button className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-white transition-colors group">
            See all
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Cards Responsive Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {MOVIES.slice(0, mapItems ?? MOVIES.length).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={(movie) => {
                navigate("/detail", { state: { movie } });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

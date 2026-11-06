import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Film, Search } from "lucide-react";

import MovieSlider from "@/components/Cards/cards";
import { MOVIES } from "@/data/movies";
import { Movie as SliderMovie } from "@/types/data";

export const SAMPLE_PERSON = {
  _id: "person_christopher_nolan",
  name: "Christopher Nolan",

  profileImage:
    "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTFXz9otyIJjjTnyshFEOutTcVEd_SKzu3iJUT99pAiz4XorfoWYcZ8WR1Dq3LbUvuK_9jSAfhM1s4XUK4",
  backdrop:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5tVJVD9IjuIoB7cX6qlVFAWgHu-Fe6jpp6K-nbzzdVwQtO3emF7d8XEQ&s=10",

  profession: ["Director", "Writer", "Producer"],

  biography:
    "Christopher Nolan is a British-American filmmaker known for crafting ambitious, intellectually challenging films that explore time, memory, identity and human perception. His distinctive storytelling, practical filmmaking techniques and nonlinear narratives have made him one of the most influential directors of modern cinema.",

  dateOfBirth: "July 30, 1970",
  birthplace: "Westminster, London, England",
  nationality: "British-American",
  yearsActive: "1993 – Present",

  knownFor: "Science Fiction, Thriller, Drama",

  movies: [
    {
      _id: "movie_001",
      title: "Oppenheimer",
      releaseYear: 2023,
      mediaType: "Movie",
      imdbRating: 8.3,
      poster:
        "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_.jpg",
      director: "Christopher Nolan",
      genres: ["Drama", "History", "Thriller"],
    },
    {
      _id: "movie_002",
      title: "Interstellar",
      releaseYear: 2014,
      mediaType: "Movie",
      imdbRating: 8.7,
      poster:
        "https://artofthemovies.co.uk/cdn/shop/files/IMG_7648.jpg?v=1720454458&width=1946",
      director: "Christopher Nolan",
      genres: ["Sci-Fi", "Drama", "Adventure"],
    },
    {
      _id: "movie_003",
      title: "Inception",
      releaseYear: 2010,
      mediaType: "Movie",
      imdbRating: 8.8,
      poster:
        "https://image.tmdb.org/t/p/original/7NCFUxQNExfxd0kmkTqIwd1cMol.jpg",
      director: "Christopher Nolan",
      genres: ["Sci-Fi", "Action", "Thriller"],
    },
    {
      _id: "movie_004",
      title: "The Dark Knight",
      releaseYear: 2008,
      mediaType: "Movie",
      imdbRating: 9.0,
      poster:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxUdD_J8fpPpk2XbUSofUOretPsJt_FU9kI_IruJoAZsyjHMvDR2B_hOtk&s=10",
      director: "Christopher Nolan",
      genres: ["Action", "Crime", "Drama"],
    },
    {
      _id: "movie_005",
      title: "Dunkirk",
      releaseYear: 2017,
      mediaType: "Movie",
      imdbRating: 7.8,
      poster:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxAo8H2GNcKbE7DSwtCu_bdasaVLE6pyv18I4IiSKAR48YP2GNMuSsFadP&s=10",
      director: "Christopher Nolan",
      genres: ["War", "Drama", "History"],
    },
    {
      _id: "movie_006",
      title: "Tenet",
      releaseYear: 2020,
      mediaType: "Movie",
      imdbRating: 7.3,
      poster:
        "https://www.originalfilmart.com/cdn/shop/products/Tenet_2020_original_film_art.jpg?v=1627548603&width=1015",
      director: "Christopher Nolan",
      genres: ["Action", "Sci-Fi", "Thriller"],
    },
    {
      _id: "movie_007",
      title: "The Prestige",
      releaseYear: 2006,
      mediaType: "Movie",
      imdbRating: 8.5,
      poster:
        "https://image.tmdb.org/t/p/original/vLNUqwUMJb0V9RYevr3E5Y0D51A.jpg",
      director: "Christopher Nolan",
      genres: ["Mystery", "Drama", "Thriller"],
    },
  ],

  awards: [
    {
      _id: "award_001",
      name: "Academy Awards",
      category: "Best Director",
      year: 2024,
      result: "Won" as const,
      organization: "The Oscars",
      movie: "Oppenheimer",
    },
    {
      _id: "award_002",
      name: "Academy Awards",
      category: "Best Picture",
      year: 2024,
      result: "Won" as const,
      organization: "The Oscars",
      movie: "Oppenheimer",
    },
    {
      _id: "award_003",
      name: "Golden Globe Awards",
      category: "Best Director",
      year: 2024,
      result: "Won" as const,
      organization: "Golden Globes",
      movie: "Oppenheimer",
    },
    {
      _id: "award_004",
      name: "BAFTA Awards",
      category: "Best Director",
      year: 2024,
      result: "Won" as const,
      organization: "BAFTA",
      movie: "Oppenheimer",
    },
    {
      _id: "award_005",
      name: "Academy Awards",
      category: "Best Director",
      year: 2018,
      result: "Nominated" as const,
      organization: "The Oscars",
      movie: "Dunkirk",
    },
    {
      _id: "award_006",
      name: "Academy Awards",
      category: "Best Original Screenplay",
      year: 2011,
      result: "Nominated" as const,
      organization: "The Oscars",
      movie: "Inception",
    },
  ],
};

type AwardItem = {
  _id?: string;
  name: string;
  category: string;
  year: string | number;
  result: "Won" | "Nominated";
  movie?: string;
  organization?: string;
};

interface ActorProfile {
  _id?: string;
  id?: string | number;
  name: string;
  image?: string;
  profileImage?: string;
  backdrop?: string;
  profession?: string[];
  biography?: string;
  dateOfBirth?: string;
  birthplace?: string;
  nationality?: string;
  knownFor?: string;
  yearsActive?: string;
  awards?: AwardItem[];
  movies?: any[];
}

const ROLES = ["All", "Actor", "Director", "Producer", "Writer"];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const normalize = (value: any) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getTitle = (movie: any) => movie?.title || movie?.name || "Untitled";

const getPoster = (movie: any) =>
  movie?.posterUrl ||
  movie?.poster ||
  movie?.posterImage ||
  movie?.backdrop ||
  "";

const getYear = (movie: any) =>
  movie?.year || movie?.releaseYear || movie?.releaseDate?.slice?.(0, 4) || "";

const getRating = (movie: any) => movie?.rating || movie?.imdbRating || null;

const getCast = (movie: any) =>
  movie?.cast || movie?.actors || movie?.castMembers || [];

const getProfessions = (actor: ActorProfile): string[] => {
  if (Array.isArray(actor.profession)) return actor.profession;
  return actor.profession ? [actor.profession] : ["Actor"];
};

const hasRole = (movie: any, actor: ActorProfile, role: string) => {
  const personName = normalize(actor.name);

  if (role === "Actor") {
    return getCast(movie).some((member: any) => {
      const name =
        typeof member === "string" ? member : member?.name || member?.actorName;

      return normalize(name) === personName;
    });
  }

  const fields: Record<string, string[]> = {
    Director: ["director", "directors"],
    Producer: ["producer", "producers"],
    Writer: ["writer", "writers", "screenplay"],
  };

  const values = fields[role] || [];

  return values.some((field) => {
    const value = movie?.[field];
    const people = Array.isArray(value) ? value : value ? [value] : [];

    return people.some((person: any) => {
      const name = typeof person === "string" ? person : person?.name;

      return normalize(name) === personName;
    });
  });
};

/**
 * Convert profile movie objects into the Movie shape expected by
 * your existing MovieSlider component.
 *
 * The original properties are preserved as well, so fields such as
 * _id and poster remain available to components that use them.
 */
const toSliderMovie = (movie: any): SliderMovie => {
  const genre = movie?.genre || movie?.genres || [];

  return {
    ...movie,
    id: String(movie?._id || movie?.id || ""),
    title: getTitle(movie),
    posterUrl: getPoster(movie),
    rating: String(getRating(movie) || ""),
    year: String(getYear(movie) || ""),
    genres: Array.isArray(genre) ? genre.join(", ") : String(genre),
    description: movie?.description || "",
    duration: String(movie?.duration || ""),
  } as SliderMovie;
};

// -----------------------------------------------------------------------------
// Awards slider
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Awards slider
// -----------------------------------------------------------------------------

const AWARD_IMAGES = {
  oscars:
    "https://m.media-amazon.com/images/M/MV5BYjU0MDUwNzQtYThlYS00ODJkLTk2MGMtYjFlMWJjMTk1YmE2XkEyXkFqcGc@._V1_.jpg",

  goldenGlobes:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeTqS2fMrfDUrWY1STYr7y3EM3FTbB8YUES2xLj5s1aPD9dRJV7WnMtQCk&s=10",

  bafta:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYxCLwO_kYlMylD1Vj3xOMhr3-dHuVFwdKazvyMCYGT-S86Sd2kTZVJ9A&s=10",
};

const getAwardImage = (award: AwardItem) => {
  const organization = normalize(
    `${award.organization || ""} ${award.name || ""}`,
  );

  if (organization.includes("bafta")) return AWARD_IMAGES.bafta;

  if (organization.includes("golden globe")) {
    return AWARD_IMAGES.goldenGlobes;
  }

  return AWARD_IMAGES.oscars;
};

function AwardsSlider({ awards }: { awards: AwardItem[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!awards.length) return null;

  return (
    <section className="[content-visibility:auto] [contain-intrinsic-size:auto_650px] text-white p-2 antialiased selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto overflow space-y-6">
        {/* Same header structure as MovieSlider */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Awards & Recognition
            </h2>
          </div>
        </div>

        {/* MovieSlider-style cards */}
        <div
          ref={sliderRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {awards.map((award, index) => (
            <article
              key={award._id || index}
              className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[28px] bg-neutral-900 transition-all duration-500 hover:shadow-purple-500/10 focus:outline-none focus:ring-2 focus:ring-white/20 aspect-[3/4] w-[calc(100vw-48px)] sm:w-[280px] flex flex-col justify-end p-5 sm:p-6 select-none snap-start"
            >
              <img
                src={getAwardImage(award)}
                alt={award.organization || award.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />

              {/* Exact MovieCard overlay treatment */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

              {/* Exact MovieCard content positioning */}
              <div className="relative z-10 flex flex-col justify-end space-y-2">
                <div className="flex items-end justify-between gap-3 pt-1">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-xs text-neutral-300 font-normal line-clamp-1 leading-relaxed opacity-90">
                      {award.organization || award.name}
                      {" · "}
                      {award.year}
                    </p>

                    <h3 className="font-bold text-white text-lg sm:text-xl leading-snug tracking-tight drop-shadow-md line-clamp-2">
                      {award.category}
                    </h3>

                    <p className="text-xs text-neutral-300 font-normal line-clamp-2 leading-relaxed opacity-90">
                      {award.movie ||
                        (award.result === "Won"
                          ? "Award Winner"
                          : "Award Nomination")}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Cast Profile Page
// -----------------------------------------------------------------------------

export default function CastProfilePage() {
  const location = useLocation();

  const actor = location.state?.actor as ActorProfile | undefined;

  // Use the sample profile until a real profile is passed.
  const profile: ActorProfile = actor || SAMPLE_PERSON;

  const [activeRole] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const professions = getProfessions(profile);
  const profileImage = profile.profileImage || profile.image || "";

  const allMovies = Array.isArray(MOVIES) ? MOVIES : [];

  const credits = useMemo(() => {
    const supplied = Array.isArray(profile.movies) ? profile.movies : [];

    const matched = allMovies.filter((movie: any) =>
      ROLES.filter((role) => role !== "All").some((role) =>
        hasRole(movie, profile, role),
      ),
    );

    const combined = [...supplied, ...matched];

    return combined.filter((movie, index) => {
      const movieId = String(movie?._id || movie?.id || "");

      if (movieId) {
        return (
          combined.findIndex(
            (item) => String(item?._id || item?.id || "") === movieId,
          ) === index
        );
      }

      return (
        combined.findIndex(
          (item) =>
            normalize(getTitle(item)) === normalize(getTitle(movie)) &&
            String(getYear(item)) === String(getYear(movie)),
        ) === index
      );
    });
  }, [profile, allMovies]);

  const filteredCredits = useMemo(() => {
    return credits.filter((movie: any) => {
      const matchesRole =
        activeRole === "All" || hasRole(movie, profile, activeRole);

      const matchesSearch = normalize(getTitle(movie)).includes(
        normalize(searchQuery),
      );

      return matchesRole && matchesSearch;
    });
  }, [credits, activeRole, searchQuery, profile]);

  const popularMovies = useMemo(() => {
    return [...credits]
      .sort(
        (a: any, b: any) =>
          Number(getRating(b) || 0) - Number(getRating(a) || 0),
      )
      .slice(0, 10);
  }, [credits]);

  const knownFor = popularMovies.slice(0, 5);

  const awards = profile.awards || [];

  return (
    <main
      className="flex-1 min-w-0 text-white overflow-y-auto"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="mx-auto pb-20">
        {/* bg-[#18191c] */}
        <section className="mx-3 md:mx-5 mt-4 rounded-[30px] overflow-hidden  border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 p-5 md:p-8 items-center sm:items-start">
            {/* Profile image */}
            <div className="w-32 h-40 sm:w-56 sm:h-72 shrink-0 rounded-[22px] overflow-hidden bg-[#202124]">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-semibold text-neutral-500">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Profile information */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium mb-2">
                Cast & Crew
              </p>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                {profile.name}
              </h1>

              <p className="text-sm text-neutral-400 mt-2">
                {professions.join(" · ")}
              </p>

              <p className="text-sm md:text-base leading-7 text-neutral-400 mt-5 max-w-3xl">
                {profile.biography ||
                  "Biography information has not been added yet."}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-3 mt-5">
                {profile.nationality && (
                  <span className="text-xs text-neutral-400">
                    {profile.nationality}
                  </span>
                )}

                {profile.birthplace && (
                  <span className="text-xs text-neutral-400">
                    {profile.birthplace}
                  </span>
                )}

                {profile.yearsActive && (
                  <span className="text-xs text-neutral-400">
                    {profile.yearsActive}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="px-3 mt-8 space-y-10">
          {/* Known For */}
          {knownFor.length > 0 && (
            <MovieSlider
              title="Known For"
              MOVIES={knownFor.map(toSliderMovie)}
              mapItems={knownFor.length}
            />
          )}

          {/* Awards */}
          <AwardsSlider awards={awards} />

          <section className="space-y-5">
            <div className="flex flex-col px-6 mx-4 sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  {"Filmography"}
                </h1>

                <p className="text-lg text-neutral-500 mt-1">
                  Browse all available career credits
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />

                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search titles..."
                  className="w-full h-10 rounded-full bg-[#18191c] border border-white/[0.08] pl-9 pr-4 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-white/20 transition-colors"
                />
              </div>
            </div>

            {/* Role filters */}
            {/* <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-[11px] font-semibold transition-colors ${
                    activeRole === role
                      ? "bg-white text-black"
                      : "bg-[#1b1c20] text-neutral-400 hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div> */}

            {/* Reuse the existing movie slider */}
            {filteredCredits.length > 0 ? (
              <MovieSlider
                title=""
                MOVIES={filteredCredits.map(toSliderMovie)}
                mapItems={filteredCredits.length}
              />
            ) : (
              <div className="py-12 rounded-[24px] border border-white/[0.06] bg-[#17181b] text-center">
                <Film size={25} className="mx-auto text-neutral-600" />

                <p className="text-sm font-semibold text-neutral-300 mt-3">
                  No titles found
                </p>

                <p className="text-xs text-neutral-500 mt-1">
                  There are no matching credits in the available movie data.
                </p>
              </div>
            )}
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Biography and Personal Information */}
          {/* ---------------------------------------------------------------- */}

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mx-6 px-5 border-t border-white/[0.06] pt-8">
            <div className="lg:col-span-7">
              <h2 className="text-xl font-semibold text-white mt-1">
                Biography
              </h2>

              <p className="text-sm md:text-base mt-3 leading-7 text-neutral-400">
                {profile.biography ||
                  "Biography information has not been added yet."}
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#18191c] rounded-[24px] border border-white/[0.06] p-5">
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  Profile
                </p>
                <h2 className="text-lg font-semibold text-white mt-1">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                {[
                  ["Profession", professions.join(", ")],
                  ["Date of Birth", profile.dateOfBirth],
                  ["Birthplace", profile.birthplace],
                  ["Nationality", profile.nationality],
                  ["Years Active", profile.yearsActive],
                  ["Known For", profile.knownFor],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                        {label}
                      </p>
                      <p className="text-sm text-white mt-1.5 leading-5">
                        {value}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

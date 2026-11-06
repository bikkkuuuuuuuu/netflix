import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Film,
  Grid2X2,
  List,
  ChevronDown,
  Clock3,
  Play,
  Database,
  Loader2,
  ArrowUpRight,
  Layers3,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import movieSvc from "@/services/movie.service";
import { Movie } from "@/types/data";
import { getBackendUrl } from "@/lib/utils";

const typeOptions = [
  { label: "Everything", value: "all" },
  { label: "Movies", value: "Movie" },
  { label: "TV Shows", value: "TV Show" },
];

const genreOptions = [
  { label: "All genres", value: "All genres" },
  { label: "Action", value: "Action" },
  { label: "Sci-Fi", value: "Sci-Fi" },
  { label: "Drama", value: "Drama" },
  { label: "Crime", value: "Crime" },
  { label: "Comedy", value: "Comedy" },
  { label: "Anime", value: "Anime" },
];

const sortOptions = [
  { label: "Recently added", value: "Recently added" },
  { label: "Newest", value: "Newest" },
  { label: "Oldest", value: "Oldest" },
  { label: "A — Z", value: "A-Z" },
];

export default function Library() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [genre, setGenre] = useState("All genres");
  const [sort, setSort] = useState("Recently added");
  const [view, setView] = useState<"editorial" | "grid">("editorial");
  const [movies, setMovies] = useState<Movie[]>([]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          movie.genres.some((genre) => genre.toLowerCase().includes(query)),
      );
    }

    if (sort === "Newest") {
      result.sort((a, b) => b.releaseYear - a.releaseYear);
    }

    if (sort === "Oldest") {
      result.sort((a, b) => a.releaseYear - b.releaseYear);
    }

    if (sort === "A-Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [search, type, genre, sort, movies]);

  const published = movies.filter(
    (movie) => movie.processing.status === "ready",
  ).length;

  const processing = movies.filter(
    (movie) => movie.processing.status === "processing",
  ).length;

  const drafts = movies.filter(
    (movie) => movie.processing.status === "queued",
  ).length;

  const recentMovies = movies.slice(0, 2);

  const fetchMovies = async () => {
    try {
      const response = await movieSvc.list(20, "");
      setMovies(response.detail);
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div
      className="min-h-full w-full overflow-y-auto text-white"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-3 ">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <header className="mb-10">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-[38px] font-medium tracking-[-0.055em] text-white sm:text-[46px]">
                Library
              </h1>

              <p className=" max-w-[560px] text-md leading-6 text-neutral-500">
                Your entire content catalog, from newly uploaded titles to
                published media.
              </p>
            </div>

            <NavLink
              to={"/upload"}
              className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-neutral-200 active:scale-[0.98] lg:self-auto"
            >
              <Plus className="h-4 w-4" />
              Add title
            </NavLink>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-neutral-600">
            <span>
              <strong className="font-medium text-neutral-300">
                {movies.length}
              </strong>{" "}
              titles
            </span>

            <span className="h-1 w-1 rounded-full bg-neutral-800" />

            <span>
              <strong className="font-medium text-neutral-300">
                {published}
              </strong>{" "}
              published
            </span>

            <span className="h-1 w-1 rounded-full bg-neutral-800" />

            <span>
              <strong className="font-medium text-neutral-300">
                {processing}
              </strong>{" "}
              processing
            </span>

            <span className="h-1 w-1 rounded-full bg-neutral-800" />

            <span>
              <strong className="font-medium text-neutral-300">{drafts}</strong>{" "}
              drafts
            </span>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Bento intro                                                       */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-12 grid gap-3 lg:grid-cols-12">
          {/* Recently added */}
          <article className="overflow-hidden rounded-[26px] border border-white/[0.06] bg-[#131416] lg:col-span-8">
            <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-700">
                  Recently added
                </div>

                <p className="mt-1.5 text-xs text-neutral-500">
                  The latest titles entering your catalog.
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-neutral-700" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-px bg-white/[0.04]">
              {recentMovies.map((movie) => (
                <RecentTitle key={movie._id} movie={movie} />
              ))}
            </div>
          </article>

          {/* Catalog summary */}
          <article className="relative overflow-hidden rounded-[26px] border border-white/[0.06] bg-[#131416] p-6 lg:col-span-4">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-[#0f1012]">
                <Layers3 className="h-4 w-4 text-neutral-500" />
              </div>

              <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-700">
                Catalog
              </span>
            </div>

            <div className="mt-14">
              <div className="flex items-baseline gap-2">
                <span className="text-[52px] font-medium leading-none tracking-[-0.065em]">
                  {movies.length}
                </span>

                <span className="text-xs text-neutral-600">titles</span>
              </div>

              <p className="mt-3 max-w-[250px] text-xs leading-5 text-neutral-600">
                Movies and television currently managed inside your content
                library.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <SummaryRow
                label="Published"
                value={published}
                dot="bg-emerald-400"
              />

              <SummaryRow
                label="Processing"
                value={processing}
                dot="bg-amber-400"
              />

              <SummaryRow label="Queued" value={drafts} dot="bg-neutral-600" />
            </div>
          </article>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Library controls                                                  */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-6">
          <div className="flex flex-col gap-5 border-b border-white/[0.06] pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl font-medium tracking-[-0.035em]">
                  All titles
                </h2>

                <span className="text-[11px] text-neutral-700">
                  {filteredMovies.length} results
                </span>
              </div>

              <p className="mt-1.5 text-xs text-neutral-600">
                Browse and manage your complete catalog.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-[230px]">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-700" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search titles"
                  className="h-10 w-full rounded-xl border border-white/[0.06] bg-[#131416] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-neutral-700 hover:border-white/[0.1] focus:border-white/[0.15]"
                />
              </div>

              <FilterSelect
                value={type}
                onChange={setType}
                options={typeOptions}
              />

              <FilterSelect
                value={genre}
                onChange={setGenre}
                options={genreOptions}
              />

              <FilterSelect
                value={sort}
                onChange={setSort}
                options={sortOptions}
              />

              <div className="flex h-10 items-center rounded-xl border border-white/[0.06] bg-[#131416] p-1">
                <ViewButton
                  active={view === "editorial"}
                  onClick={() => setView("editorial")}
                  icon={<List className="h-3.5 w-3.5" />}
                />

                <ViewButton
                  active={view === "grid"}
                  onClick={() => setView("grid")}
                  icon={<Grid2X2 className="h-3.5 w-3.5" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Editorial list                                                    */}
        {/* ---------------------------------------------------------------- */}

        {view === "editorial" && (
          <section className="rounded-[26px] border border-white/[0.06] bg-[#131416]">
            <div className="hidden grid-cols-[80px_1fr_150px_130px_120px_40px] items-center gap-6 border-b border-white/[0.06] px-6 py-3 text-[9px] uppercase tracking-[0.18em] text-neutral-700 md:grid">
              <span>Media</span>
              <span>Title</span>
              <span>Type</span>
              <span>Genre</span>
              <span>Status</span>
              <span />
            </div>

            {filteredMovies.map((movie) => (
              <EditorialRow key={movie._id} movie={movie} />
            ))}
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Grid                                                              */}
        {/* ---------------------------------------------------------------- */}

        {view === "grid" && (
          <section className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredMovies.map((movie) => (
              <GridMovie key={movie._id} movie={movie} />
            ))}
          </section>
        )}

        {/* Empty */}
        {filteredMovies.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}

function RecentTitle({ movie }: { movie: Movie }) {
  return (
    <div className="group relative flex min-h-[270px] items-end overflow-hidden bg-[#101113] p-5 sm:min-h-[330px] sm:p-6">
      <img
        src={getBackendUrl(movie.poster) ?? ""}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-80"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/55">
          {/* <span>{movie.type}</span> */}
          <span className="text-white/20">/</span>
          <span>{movie.releaseYear}</span>
        </div>

        <h3 className="max-w-[240px] text-xl font-medium tracking-[-0.035em] text-white sm:text-2xl">
          {movie.title}
        </h3>

        <p className="mt-2 max-w-[300px] line-clamp-2 text-[11px] leading-5 text-white/50">
          {movie.description}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Summary                                                                    */
/* ========================================================================== */

function SummaryRow({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />

        <span className="text-xs text-neutral-500">{label}</span>
      </div>

      <span className="text-xs font-medium text-neutral-300">{value}</span>
    </div>
  );
}

/* ========================================================================== */
/* Editorial Row                                                              */
/* ========================================================================== */

function EditorialRow({ movie }: { movie: Movie }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <NavLink
      to={movie?._id}
      className="group relative grid gap-4 border-b border-white/[0.05] px-4 py-4 transition last:border-b-0 hover:bg-white/[0.015] md:grid-cols-[80px_1fr_150px_130px_120px_40px] md:items-center md:gap-6 md:px-6"
    >
      {/* Poster */}
      <div className="relative">
        <img
          src={getBackendUrl(movie.poster) ?? ""}
          alt={movie.title}
          className="h-24 w-16 rounded-xl object-cover"
        />
      </div>

      {/* Title */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-medium tracking-[-0.015em] text-neutral-200">
            {movie.title}
          </h3>
        </div>

        <p className="mt-1.5 line-clamp-1 max-w-xl text-[11px] leading-5 text-neutral-600">
          {movie.description}
        </p>

        <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-700">
          <span>{movie?.releaseYear || "N/A"}</span>
          <span>·</span>
          <Clock3 className="h-3 w-3" />
          <span>{movie.runtime}</span>
        </div>
      </div>

      {/* Type */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Film className="h-3.5 w-3.5 text-neutral-700" /> Movie
      </div>

      {/* Genre */}
      <div className="text-xs text-neutral-500">{movie?.genres}</div>

      {/* Status */}
      <EditorialStatus status={movie.processing.status} />

      {/* Actions */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-700 transition hover:bg-white/[0.05] hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 z-30 w-36 overflow-hidden rounded-xl border border-white/[0.08] bg-[#18191c] p-1 shadow-2xl">
            <MenuItem
              icon={<ExternalLink className="h-3.5 w-3.5" />}
              label="Open"
            />

            <MenuItem icon={<Pencil className="h-3.5 w-3.5" />} label="Edit" />

            <MenuItem
              icon={<Trash2 className="h-3.5 w-3.5" />}
              label="Delete"
              destructive
            />
          </div>
        )}
      </div>
    </NavLink>
  );
}

/* ========================================================================== */
/* Editorial Status                                                           */
/* ========================================================================== */

function EditorialStatus({
  status,
}: {
  status: Movie["processing"]["status"];
}) {
  if (status === "ready") {
    return (
      <div className="flex items-center gap-2 text-[10px] text-neutral-500">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Published
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="flex items-center gap-2 text-[10px] text-neutral-500">
        <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
        Processing
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[10px] text-neutral-600">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
      Queued
    </div>
  );
}

/* ========================================================================== */
/* Grid View                                                                  */
/* ========================================================================== */

function GridMovie({ movie }: { movie: Movie }) {
  return (
    <NavLink to="id" className="group min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[18px] border border-white/[0.06] bg-[#131416]">
        <img
          src={getBackendUrl(movie.poster) ?? ""}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
        />

        <div className="absolute left-3 top-3">
          <EditorialStatus status={movie.processing.status} />
        </div>

        {movie.processing.status === "ready" && (
          <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
          </div>
        )}
      </div>

      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-xs font-medium text-neutral-200">
            {movie.title}
          </h3>

          <span className="shrink-0 text-[10px] text-neutral-700">
            {movie.releaseYear}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-neutral-700">
          <Film className="h-3 w-3" />

          <span>{movie.genres}</span>

          <span className="text-neutral-800">·</span>

          <span>{movie.runtime}</span>
        </div>
      </div>
    </NavLink>
  );
}

/* ========================================================================== */
/* Filter                                                                     */
/* ========================================================================== */

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-[115px] appearance-none rounded-xl border border-white/[0.06] bg-[#131416] px-3 pr-8 text-[11px] text-neutral-500 outline-none transition hover:border-white/[0.1] focus:border-white/[0.15]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#131416]"
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-700" />
    </div>
  );
}

/* ========================================================================== */
/* View Button                                                                */
/* ========================================================================== */

function ViewButton({
  active,
  onClick,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-neutral-700 hover:text-neutral-300"
      }`}
    >
      {icon}
    </button>
  );
}

/* ========================================================================== */
/* Menu                                                                       */
/* ========================================================================== */

function MenuItem({
  icon,
  label,
  destructive = false,
}: {
  icon: React.ReactNode;
  label: string;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] transition ${
        destructive
          ? "text-neutral-500 hover:bg-red-500/[0.06] hover:text-red-400"
          : "text-neutral-400 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ========================================================================== */
/* Empty                                                                      */
/* ========================================================================== */

function EmptyState() {
  return (
    <div className="mt-4 flex min-h-[360px] flex-col items-center justify-center rounded-[26px] border border-white/[0.06] bg-[#131416]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0f1012]">
        <Database className="h-5 w-5 text-neutral-700" />
      </div>

      <h3 className="mt-5 text-sm font-medium text-neutral-300">
        No titles found
      </h3>

      <p className="mt-1.5 text-xs text-neutral-600">
        Try changing your search or filters.
      </p>
    </div>
  );
}

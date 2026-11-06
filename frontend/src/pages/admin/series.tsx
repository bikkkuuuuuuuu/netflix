import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clapperboard,
  FileVideo,
  Film,
  HardDrive,
  Image as ImageIcon,
  Layers,
  LoaderCircle,
  Plus,
  Save,
  Search,
  Settings2,
  Trash2,
  Tv,
  Upload,
  X,
  CheckCircle2,
  Clock3,
  Play,
  FileText,
  Image,
} from "lucide-react";
import {
  ImageUploader,
  InputType,
  SelectField,
  TextAreaField,
  TextInputField,
} from "@/components/formFields";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as Yup from "yup";
type Episode = {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  file: File | null;
  status: "Draft" | "Uploading" | "Processing" | "Ready";
};

type Season = {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
};

const createEpisode = (number: number): Episode => ({
  id: `ep-${Date.now()}-${Math.random()}`,
  episodeNumber: number,
  title: "",
  description: "",
  duration: "",
  file: null,
  status: "Draft",
});

const initialSeasons: Season[] = [
  {
    id: "season-1",
    seasonNumber: 1,
    title: "Season 1",
    episodes: [
      {
        ...createEpisode(1),
        id: "ep-1",
        title: "Chapter One",
        duration: "52 min",
        status: "Ready",
      },
      {
        ...createEpisode(2),
        id: "ep-2",
        title: "The Weirdo on Maple Street",
        duration: "55 min",
        status: "Ready",
      },
      {
        ...createEpisode(3),
        id: "ep-3",
        title: "Holly, Jolly",
        duration: "51 min",
        status: "Processing",
      },
    ],
  },
  {
    id: "season-2",
    seasonNumber: 2,
    title: "Season 2",
    episodes: [
      {
        ...createEpisode(1),
        id: "ep-4",
        title: "MADMAX",
        duration: "48 min",
        status: "Ready",
      },
    ],
  },
];

const inputClass =
  "w-full rounded-xl border border-white/[0.07] bg-[#0d0e10] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white/25";

const labelClass =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.04] bg-[#121316] p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
            <Icon size={17} className="text-neutral-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            {description && (
              <p className="mt-1 text-xs text-neutral-500">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Status({ status }: { status: Episode["status"] }) {
  const styles = {
    Draft: "bg-white/[0.05] text-neutral-400",
    Uploading: "bg-blue-500/10 text-blue-400",
    Processing: "bg-amber-500/10 text-amber-400",
    Ready: "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      {status === "Ready" ? (
        <CheckCircle2 size={11} />
      ) : status === "Processing" ? (
        <LoaderCircle size={11} />
      ) : status === "Uploading" ? (
        <Upload size={11} />
      ) : (
        <Clock3 size={11} />
      )}
      {status}
    </span>
  );
}

export default function SeriesUpload() {
  const [seasons, setSeasons] = useState<Season[]>(initialSeasons);
  const [activeSeasonId, setActiveSeasonId] = useState("season-1");
  const [expandedEpisodes, setExpandedEpisodes] = useState<string[]>(["ep-3"]);

  const [title] = useState("Stranger Things");
  const [description] = useState(
    "When a young boy disappears, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
  );

  const [releaseYear] = useState("2016");
  const [endYear] = useState("");
  const [genre] = useState("Sci-Fi");
  const [maturity] = useState("TV-14");
  const [rating] = useState("8.7");
  const [seriesStatus] = useState("ONGOING");

  const MovieDTO = Yup.object({
    title: Yup.string().trim().required("Title is required"),
    releaseYear: Yup.string().required("Release year is required"),
    description: Yup.string().required("Description is required"),
    mediaType: Yup.string(),
    genre: Yup.string(),
    maturity: Yup.string(),
    imdbRating: Yup.string(),
    backdrop: Yup.mixed().nullable(),
    poster: Yup.mixed().nullable(),
    video: Yup.mixed<File>()
      .required("Source video is required")
      .test(
        "video-file",
        "Choose an MP4 or MKV video.",
        (value) => value instanceof File && /\.(mp4|mkv)$/i.test(value.name),
      ),
  });
  const {
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MovieDTO),
    defaultValues: {
      title: "",
      releaseYear: "",
      description: "",
      mediaType: "Movie",
      genre: "Sci-Fi",
      maturity: "PG-13",
      imdbRating: "",
      backdrop: null,
      poster: null,
      // video: null,
    },
  });
  const [cast, setCast] = useState([
    "Millie Bobby Brown",
    "Finn Wolfhard",
    "David Harbour",
    "Winona Ryder",
  ]);
  const [castInput, setCastInput] = useState("");

  const [activeTab, setActiveTab] = useState<"details" | "seasons">("details");

  const [artwork] = useState<{
    poster: File | null;
    backdrop: File | null;
    logo: File | null;
  }>({
    poster: null,
    backdrop: null,
    logo: null,
  });

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const activeSeason = seasons.find((season) => season.id === activeSeasonId);

  const totalEpisodes = useMemo(
    () => seasons.reduce((total, season) => total + season.episodes.length, 0),
    [seasons],
  );

  const readyEpisodes = useMemo(
    () =>
      seasons.reduce(
        (total, season) =>
          total +
          season.episodes.filter((episode) => episode.status === "Ready")
            .length,
        0,
      ),
    [seasons],
  );

  const updateEpisode = (episodeId: string, updates: Partial<Episode>) => {
    setSeasons((current) =>
      current.map((season) => ({
        ...season,
        episodes: season.episodes.map((episode) =>
          episode.id === episodeId ? { ...episode, ...updates } : episode,
        ),
      })),
    );
  };

  const addSeason = () => {
    const number =
      Math.max(0, ...seasons.map((season) => season.seasonNumber)) + 1;

    const newSeason: Season = {
      id: `season-${Date.now()}`,
      seasonNumber: number,
      title: `Season ${number}`,
      episodes: [createEpisode(1)],
    };

    setSeasons((current) => [...current, newSeason]);
    setActiveSeasonId(newSeason.id);
    setActiveTab("seasons");
  };

  const removeSeason = (id: string) => {
    if (!window.confirm("Delete this season and its episodes?")) return;

    const remaining = seasons.filter((season) => season.id !== id);
    setSeasons(remaining);

    if (activeSeasonId === id) {
      setActiveSeasonId(remaining[0]?.id ?? "");
    }
  };

  const addEpisode = () => {
    if (!activeSeason) return;

    const nextNumber =
      Math.max(
        0,
        ...activeSeason.episodes.map((episode) => episode.episodeNumber),
      ) + 1;

    const episode = createEpisode(nextNumber);

    setSeasons((current) =>
      current.map((season) =>
        season.id === activeSeasonId
          ? { ...season, episodes: [...season.episodes, episode] }
          : season,
      ),
    );

    setExpandedEpisodes((current) => [...current, episode.id]);
  };

  const removeEpisode = (episodeId: string) => {
    setSeasons((current) =>
      current.map((season) => ({
        ...season,
        episodes: season.episodes.filter((episode) => episode.id !== episodeId),
      })),
    );
  };

  const addCast = () => {
    const value = castInput.trim();
    if (!value || cast.includes(value)) return;

    setCast((current) => [...current, value]);
    setCastInput("");
  };


  const handleSave = async () => {
    setSaving(true);

    const payload = {
      title,
      description,
      releaseYear,
      endYear,
      genre,
      maturity,
      rating,
      seriesStatus,
      cast,
      seasons,
      artwork,
    };

    console.log("Series payload:", payload);

    // Replace this with your series creation API.
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSaving(false);
  };

  return (
    <div className="min-h-full flex-1 overflow-y-auto bg-[#0b0c0e] text-white">
      <div className="mx-auto w-full max-w-[1600px] space-y-5 p-1">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.04] bg-[#121316] p-4 md:flex-row md:items-center md:p-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                <Clapperboard className="h-4 w-4 text-neutral-300" />
              </div>

              <div>
                <h1 className="text-sm font-semibold tracking-tight text-white">
                  Upload Studio
                </h1>

                <p className="mt-0.5 text-sm text-neutral-500">
                  Add titles, artwork and source media to your catalog.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-white/[0.07]"
            >
              <Save size={14} />
              Save draft
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              Publish series
            </button>
          </div>
        </header>

        {/* Overview */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: "Total seasons",
              value: seasons.length,
              icon: Layers,
            },
            {
              label: "Total episodes",
              value: totalEpisodes,
              icon: Film,
            },
            {
              label: "Ready episodes",
              value: readyEpisodes,
              icon: CheckCircle2,
            },
            {
              label: "Pending episodes",
              value: totalEpisodes - readyEpisodes,
              icon: Clock3,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.04] bg-[#121316] p-4"
            >
              <div className="flex items-center justify-between">
                <item.icon size={17} className="text-neutral-500" />
                <span className="text-2xl font-semibold tabular-nums">
                  {item.value}
                </span>
              </div>
              <p className="mt-3 text-xs text-neutral-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
          {/* LEFT */}
          <main className="min-w-0 space-y-4 xl:col-span-8">
            {/* Navigation */}
            <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.04] bg-[#121316] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-medium transition ${
                  activeTab === "details"
                    ? "bg-white/[0.09] text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                <Settings2 size={14} />
                Series details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("seasons")}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-medium transition ${
                  activeTab === "seasons"
                    ? "bg-white/[0.09] text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                <Layers size={14} />
                Seasons & episodes
                <span className="rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[10px]">
                  {seasons.length}
                </span>
              </button>
            </div>

            {activeTab === "details" ? (
              <>
                {/* General information */}
                <section className="rounded-3xl bg-[#121316] p-5">
                  <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] pb-4">
                    <FileText className="h-4 w-4 text-neutral-400" />

                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        General information
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                          Title
                        </label>

                        <TextInputField
                          type={InputType.TEXT}
                          name="title"
                          control={control}
                          placeholder="Dune: Part Two"
                          errMsg={errors.title?.message as string}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                          Format
                        </label>

                        <SelectField
                          name="mediaType"
                          control={control}
                          options={[
                            {
                              value: "TV Show",
                              label: "TV Show",
                            },
                            {
                              value: "Anime",
                              label: "Anime",
                            },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                          Genre
                        </label>

                        <SelectField
                          name="genre"
                          control={control}
                          options={[
                            {
                              value: "Sci-Fi",
                              label: "Sci-Fi",
                            },
                            {
                              value: "Action",
                              label: "Action",
                            },
                            {
                              value: "Drama",
                              label: "Drama",
                            },
                            {
                              value: "Thriller",
                              label: "Thriller",
                            },
                            {
                              value: "Comedy",
                              label: "Comedy",
                            },
                          ]}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                          Release year
                        </label>

                        <TextInputField
                          type={InputType.TEXT}
                          name="releaseYear"
                          control={control}
                          placeholder="2026"
                          errMsg={errors.releaseYear?.message as string}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                          IMDb
                        </label>

                        <TextInputField
                          type={InputType.TEXT}
                          name="imdbRating"
                          control={control}
                          placeholder="8.5"
                          errMsg=""
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                          Rating
                        </label>

                        <SelectField
                          name="maturity"
                          control={control}
                          options={[
                            {
                              value: "G",
                              label: "G",
                            },
                            {
                              value: "PG",
                              label: "PG",
                            },
                            {
                              value: "PG-13",
                              label: "PG-13",
                            },
                            {
                              value: "R",
                              label: "R",
                            },
                            {
                              value: "TV-MA",
                              label: "TV-MA",
                            },
                          ]}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium uppercase tracking-[0.08em] text-neutral-400">
                        Synopsis
                      </label>

                      <TextAreaField
                        name="description"
                        control={control}
                        placeholder="Write a concise description of the title..."
                        rows={5}
                        errMsg={errors.description?.message as string}
                      />
                    </div>
                  </div>
                </section>

                {/* Artwork */}
                <section className="rounded-3xl bg-[#121316] p-5">
                  <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] pb-4">
                    <Image className="h-4 w-4 text-neutral-400" />

                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        Images
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_180px]">
                    <ImageUploader
                      control={control}
                      name="backdrop"
                      label="Banner"
                      // description="Wide artwork for hero sections and title pages."
                      setError={setError}
                      aspect="banner"
                      errMsg={errors.backdrop?.message as string}
                    />

                    <ImageUploader
                      control={control}
                      name="poster"
                      label="Logo"
                      // description="Transparent title logo."
                      setError={setError}
                      aspect="logo"
                      errMsg={errors.poster?.message as string}
                    />
                  </div>
                </section>

                {/* Cast */}
                <Section
                  title="Cast & crew"
                  description="People associated with this series."
                  icon={Clapperboard}
                >
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      placeholder="Add actor or creator..."
                      value={castInput}
                      onChange={(e) => setCastInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCast();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addCast}
                      className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.1]"
                    >
                      <Plus size={17} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {cast.map((person) => (
                      <div
                        key={person}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0d0e10] px-3 py-2 text-xs text-neutral-300"
                      >
                        {person}
                        <button
                          type="button"
                          onClick={() =>
                            setCast((current) =>
                              current.filter((item) => item !== person),
                            )
                          }
                          className="text-neutral-600 hover:text-white"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Section>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab("seasons")}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-black hover:bg-neutral-200"
                  >
                    Continue to seasons
                    <ChevronRight size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Season selector */}
                <Section
                  title="Seasons"
                  description="Organize your series into seasons."
                  icon={Layers}
                  action={
                    <button
                      type="button"
                      onClick={addSeason}
                      className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-neutral-300 hover:bg-white/[0.09]"
                    >
                      <Plus size={14} />
                      Add season
                    </button>
                  }
                >
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {seasons.map((season) => (
                      <button
                        key={season.id}
                        type="button"
                        onClick={() => setActiveSeasonId(season.id)}
                        className={`flex min-w-[120px] flex-1 flex-col items-start rounded-xl border p-3 text-left transition ${
                          activeSeasonId === season.id
                            ? "border-white/20 bg-white/[0.08]"
                            : "border-white/[0.05] bg-[#0d0e10] hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="text-xs font-semibold text-white">
                          {season.title}
                        </span>
                        <span className="mt-1 text-[11px] text-neutral-500">
                          {season.episodes.length} episodes
                        </span>
                      </button>
                    ))}
                  </div>

                  {activeSeason && (
                    <div className="mt-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                        <div>
                          <h3 className="text-sm font-semibold">
                            {activeSeason.title}
                          </h3>
                          <p className="mt-1 text-xs text-neutral-500">
                            Manage episodes and source media.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeSeason(activeSeason.id)}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={13} />
                          Delete season
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Season name">
                          <input
                            className={inputClass}
                            value={activeSeason.title}
                            onChange={(e) =>
                              setSeasons((current) =>
                                current.map((season) =>
                                  season.id === activeSeason.id
                                    ? { ...season, title: e.target.value }
                                    : season,
                                ),
                              )
                            }
                          />
                        </Field>

                        <Field label="Season number">
                          <input
                            type="number"
                            min="1"
                            className={inputClass}
                            value={activeSeason.seasonNumber}
                            onChange={(e) =>
                              setSeasons((current) =>
                                current.map((season) =>
                                  season.id === activeSeason.id
                                    ? {
                                        ...season,
                                        seasonNumber: Number(e.target.value),
                                      }
                                    : season,
                                ),
                              )
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                </Section>

                {/* Episodes */}
                {activeSeason && (
                  <Section
                    title="Episodes"
                    description="Each episode is uploaded and transcoded independently."
                    icon={Film}
                    action={
                      <button
                        type="button"
                        onClick={addEpisode}
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-neutral-200"
                      >
                        <Plus size={14} />
                        Add episode
                      </button>
                    }
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
                        />
                        <input
                          className={`${inputClass} pl-9`}
                          placeholder="Search episodes..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <span className="flex items-center text-xs text-neutral-500">
                        {activeSeason.episodes.length} episodes
                      </span>
                    </div>

                    <div className="space-y-3">
                      {activeSeason.episodes
                        .filter((episode) =>
                          `${episode.title} ${episode.episodeNumber}`
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                        )
                        .map((episode) => {
                          const expanded = expandedEpisodes.includes(
                            episode.id,
                          );

                          return (
                            <div
                              key={episode.id}
                              className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d0e10]"
                            >
                              {/* Episode header */}
                              <div className="flex items-center gap-3 p-3 sm:p-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedEpisodes((current) =>
                                      expanded
                                        ? current.filter(
                                            (id) => id !== episode.id,
                                          )
                                        : [...current, episode.id],
                                    )
                                  }
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-neutral-400"
                                >
                                  {expanded ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                </button>

                                <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                                  <Play
                                    size={16}
                                    className="text-neutral-500"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-semibold text-neutral-500">
                                      EP{" "}
                                      {String(episode.episodeNumber).padStart(
                                        2,
                                        "0",
                                      )}
                                    </span>
                                    <Status status={episode.status} />
                                  </div>
                                  <p className="mt-1 truncate text-xs font-medium text-neutral-200">
                                    {episode.title || "Untitled episode"}
                                  </p>
                                  <p className="mt-1 truncate text-[11px] text-neutral-600">
                                    {episode.file?.name ||
                                      episode.duration ||
                                      "No source uploaded"}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeEpisode(episode.id)}
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-red-500/10 hover:text-red-400"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              {/* Expanded episode editor */}
                              {expanded && (
                                <div className="space-y-4 border-t border-white/[0.06] p-4">
                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <Field label="Episode number">
                                      <input
                                        type="number"
                                        min="1"
                                        className={inputClass}
                                        value={episode.episodeNumber}
                                        onChange={(e) =>
                                          updateEpisode(episode.id, {
                                            episodeNumber: Number(
                                              e.target.value,
                                            ),
                                          })
                                        }
                                      />
                                    </Field>

                                    <div className="sm:col-span-2">
                                      <Field label="Episode title">
                                        <input
                                          className={inputClass}
                                          placeholder="Chapter One"
                                          value={episode.title}
                                          onChange={(e) =>
                                            updateEpisode(episode.id, {
                                              title: e.target.value,
                                            })
                                          }
                                        />
                                      </Field>
                                    </div>
                                  </div>

                                  <Field label="Episode description">
                                    <textarea
                                      rows={3}
                                      className={`${inputClass} resize-none`}
                                      placeholder="Describe this episode..."
                                      value={episode.description}
                                      onChange={(e) =>
                                        updateEpisode(episode.id, {
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </Field>

                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <Field label="Duration">
                                      <input
                                        className={inputClass}
                                        placeholder="45 min"
                                        value={episode.duration}
                                        onChange={(e) =>
                                          updateEpisode(episode.id, {
                                            duration: e.target.value,
                                          })
                                        }
                                      />
                                    </Field>

                                    <Field label="Source media">
                                      <label className="flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-xl border border-white/[0.07] bg-[#121316] px-3 text-xs text-neutral-400 transition hover:bg-white/[0.04]">
                                        <Upload
                                          size={14}
                                          className="shrink-0"
                                        />
                                        <span className="truncate">
                                          {episode.file?.name || "Choose video"}
                                        </span>
                                        <input
                                          type="file"
                                          accept="video/mp4,video/x-matroska,.mkv,.mp4"
                                          hidden
                                          onChange={(e) => {
                                            const file =
                                              e.target.files?.[0] ?? null;

                                            updateEpisode(episode.id, {
                                              file,
                                              status: "Draft",
                                            });
                                          }}
                                        />
                                      </label>
                                    </Field>
                                  </div>

                                  {episode.file && (
                                    <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                                      <FileVideo
                                        size={18}
                                        className="shrink-0 text-neutral-400"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-neutral-300">
                                          {episode.file.name}
                                        </p>
                                        <p className="mt-1 text-[10px] text-neutral-600">
                                          {(
                                            episode.file.size /
                                            1024 /
                                            1024 /
                                            1024
                                          ).toFixed(2)}{" "}
                                          GB
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateEpisode(episode.id, {
                                            file: null,
                                          })
                                        }
                                        className="text-neutral-600 hover:text-white"
                                      >
                                        <X size={15} />
                                      </button>
                                    </div>
                                  )}

                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateEpisode(episode.id, {
                                          status: "Draft",
                                        })
                                      }
                                      className="rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] text-neutral-400 hover:bg-white/[0.05]"
                                    >
                                      Save episode details
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      onClick={addEpisode}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] py-4 text-xs text-neutral-500 transition hover:border-white/30 hover:text-white"
                    >
                      <Plus size={15} />
                      Add another episode
                    </button>
                  </Section>
                )}
              </>
            )}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="min-w-0 space-y-4 xl:col-span-4">
            {/* Series preview */}
            <section className="overflow-hidden rounded-2xl border border-white/[0.04] bg-[#121316]">
              <div className="relative flex h-36 items-center justify-center bg-[#1c1d21]">
                {artwork.backdrop ? (
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <ImageIcon size={25} className="text-neutral-500" />
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon size={25} className="mx-auto text-neutral-600" />
                    <p className="mt-2 text-[10px] text-neutral-600">
                      Series backdrop preview
                    </p>
                  </div>
                )}

                <span className="absolute right-3 top-3 rounded-md bg-black/50 px-2 py-1 text-[10px] text-neutral-300">
                  LIVE PREVIEW
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                    <Tv size={21} className="text-neutral-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">
                      {title || "Untitled series"}
                    </h3>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      {releaseYear || "Year"} · {genre} · {maturity}
                    </p>
                    <p className="mt-2 text-xs text-amber-400">
                      ★ {rating || "N/A"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-xs leading-5 text-neutral-500">
                  {description || "Your series description will appear here."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
                  <span className="text-[11px] text-neutral-400">
                    {seasons.length} Seasons
                  </span>
                  <span className="text-neutral-700">·</span>
                  <span className="text-[11px] text-neutral-400">
                    {totalEpisodes} Episodes
                  </span>
                  <span className="text-neutral-700">·</span>
                  <span className="text-[11px] text-neutral-400">
                    {seriesStatus}
                  </span>
                </div>
              </div>
            </section>

            {/* Upload queue */}
            <Section
              title="Upload overview"
              description="Episode source files and processing."
              icon={Upload}
            >
              <div className="space-y-3">
                {seasons
                  .flatMap((season) =>
                    season.episodes.map((episode) => ({
                      ...episode,
                      seasonNumber: season.seasonNumber,
                    })),
                  )
                  .filter(
                    (episode) => episode.file || episode.status !== "Draft",
                  )
                  .map((episode) => (
                    <div key={episode.id} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                        <FileVideo size={15} className="text-neutral-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-neutral-300">
                          S{String(episode.seasonNumber).padStart(2, "0")}E
                          {String(episode.episodeNumber).padStart(2, "0")} ·{" "}
                          {episode.title || "Untitled"}
                        </p>
                        <p className="mt-1 text-[10px] text-neutral-600">
                          {episode.file?.name || "Source not attached"}
                        </p>
                      </div>
                      <Status status={episode.status} />
                    </div>
                  ))}

                {!seasons.some((season) =>
                  season.episodes.some(
                    (episode) => episode.file || episode.status !== "Draft",
                  ),
                ) && (
                  <p className="py-5 text-center text-xs text-neutral-600">
                    No active uploads yet.
                  </p>
                )}
              </div>
            </Section>

            {/* Storage */}
            <section className="rounded-3xl bg-[#121316] p-6">
              <div className="flex items-center gap-3 ">
                <HardDrive className="h-6 w-6 text-neutral-500" />

                <div>
                  <h3 className="text-xs font-medium text-neutral-200">
                    Storage
                  </h3>

                  <p className="mt-0.5 text-[12px] text-neutral-600">
                    Source media and generated streams
                  </p>
                </div>
              </div>

              <div className="mt-4 pb-4">
                <div className="mb-2 flex items-center justify-between text-[12px]">
                  <span className="text-neutral-600">Used storage</span>

                  <span className="text-neutral-400">142 GB / 500 GB</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-neutral-500"
                    style={{ width: "28.4%" }}
                  />
                </div>
              </div>
            </section>

            {/* Publishing */}
            <section className="rounded-2xl border border-white/[0.04] bg-[#121316] p-5">
              <h3 className="text-sm font-semibold">Publishing</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Review your series before publishing.
              </p>

              <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Series information</span>
                  <span className="text-emerald-400">Added</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Seasons</span>
                  <span className="text-neutral-300">{seasons.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Episodes</span>
                  <span className="text-neutral-300">{totalEpisodes}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Ready to play</span>
                  <span className="text-emerald-400">{readyEpisodes}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
              >
                {saving ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                Publish series
              </button>

              <p className="mt-3 text-center text-[10px] leading-4 text-neutral-600">
                Publishing the series should not automatically publish episodes
                that are still processing.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

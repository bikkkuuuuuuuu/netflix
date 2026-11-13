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
  MovieUploader,
  SelectField,
  TextAreaField,
  TextInputField,
} from "@/components/formFields";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as Yup from "yup";

interface DraftItem {
  id: string;
  title: string;
  type: "Movie" | "TV Show";
  size: string;
  progress: number;
  status: "Draft" | "Uploading" | "Ready";
}
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

  const [castInput, setCastInput] = useState("");

  const [castList, setCastList] = useState<string[]>([
    "Timothée Chalamet",
    "Zendaya",
  ]);
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
  const [drafts, setDrafts] = useState<DraftItem[]>([
    {
      id: "d-1",
      title: "Dune: Part Two",
      type: "Movie",
      size: "14.2 GB",
      progress: 100,
      status: "Ready",
    },
    {
      id: "d-2",
      title: "Severance — Season 2",
      type: "TV Show",
      size: "3.8 GB",
      progress: 45,
      status: "Uploading",
    },
    {
      id: "d-3",
      title: "Cyberpunk: Edgerunners",
      type: "TV Show",
      size: "2.1 GB",
      progress: 0,
      status: "Draft",
    },
  ]);

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

  const addCastMember = () => {
    const name = castInput.trim();

    if (!name || castList.includes(name)) {
      return;
    }

    setCastList((current) => [...current, name]);
    setCastInput("");
  };

  const removeCastMember = (name: string) => {
    setCastList((current) => current.filter((actor) => actor !== name));
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
      castList,
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
            <div className="flex gap-1 justify-around overflow-x-auto rounded-xl border border-white/[0.04] bg-[#121316] p-1">
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
                <section className="rounded-3xl bg-[#121316] p-5">
                  <div className="mb-5">
                    <h2 className="text-sm font-semibold text-white">Cast</h2>
                  </div>

                  <div className="flex gap-2">
                    <TextInputField
                      type={InputType.TEXT}
                      name="castInput"
                      control={control}
                      placeholder="Actor or creator name"
                      errMsg=""
                    />

                    <button
                      type="button"
                      onClick={addCastMember}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                      border border-white/[0.07] bg-white/[0.04] text-neutral-300
                      transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {castList.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {castList.map((actor) => (
                        <div
                          key={actor}
                          className="flex items-center gap-2 rounded-lg border border-white/[0.06]
                          bg-[#0f1012] px-3 py-2 text-xs text-neutral-300"
                        >
                          <span>{actor}</span>

                          <button
                            type="button"
                            onClick={() => removeCastMember(actor)}
                            className="text-neutral-600 transition hover:text-neutral-300"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

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
                          {/* <input
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
                          /> */}
                          <TextInputField
                            name="seName"
                            control={control}
                            placeholder="Season One"
                            // className="bg-[#0d0e10]"
                            errMsg=""
                          />
                        </Field>

                        <Field label="Season number">
                          {/* <input
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
                          /> */}
                          <TextInputField
                            name="seNumber"
                            control={control}
                            placeholder="1"
                            // className="bg-[#0d0e10]"
                            errMsg=""
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
                                      <TextInputField
                                        name="epNumber"
                                        control={control}
                                        placeholder="1"
                                        errMsg=""
                                      />
                                    </Field>

                                    <div className="sm:col-span-2">
                                      <Field label="Episode title">
                                        <TextInputField
                                          name="epTitle"
                                          control={control}
                                          placeholder="Chapter One"
                                          errMsg=""
                                        />
                                      </Field>
                                    </div>
                                  </div>

                                  <Field label="Episode description">
                                    <TextAreaField
                                      rows={4}
                                      name="description"
                                      control={control}
                                      placeholder="Describe this episode"
                                    />
                                  </Field>

                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <Field label="Duration">
                                      <TextInputField
                                        name="duration"
                                        control={control}
                                        placeholder="45 min"
                                        errMsg=""
                                      />
                                    </Field>
                                  </div>

                                  <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] p-4">
                                    <HardDrive className="h-4 w-4 text-neutral-400" />

                                    <div>
                                      <h2 className="text-sm font-semibold text-white">
                                        Source media
                                      </h2>

                                      <p className="mt-0.5 text-sm text-neutral-600">
                                        Upload the original source used for
                                        transcoding.
                                      </p>
                                    </div>
                                  </div>

                                  <MovieUploader
                                    control={control}
                                    name="video"
                                    setError={setError}
                                    errMsg={errors.video?.message as string}
                                    maxSizeGB={20}
                                  />

                                  {/* Upload progress */}
                                  {/* {isUploading && (
                                      <section className="rounded-2xl border border-white/[0.06] bg-[#121316] p-5">
                                        <div className="mb-3 flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                                              <Upload className="h-4 w-4 text-neutral-300" />
                                            </div>

                                            <div>
                                              <p className="text-sm font-medium text-white">
                                                Uploading source media
                                              </p>
                                              <p className="mt-1 text-xs text-neutral-500">
                                                Keep this page open while the
                                                upload is in progress.
                                              </p>
                                            </div>
                                          </div>

                                          <span className="text-sm font-medium tabular-nums text-white">
                                            {uploadProgress}%
                                          </span>
                                        </div>

                                        <div
                                          className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
                                          role="progressbar"
                                          aria-label="Movie upload progress"
                                          aria-valuemin={0}
                                          aria-valuemax={100}
                                          aria-valuenow={uploadProgress}
                                        >
                                          <div
                                            className="h-full rounded-full bg-red-500 transition-[width] duration-200 ease-out"
                                            style={{
                                              width: `${uploadProgress}%`,
                                            }}
                                          />
                                        </div>

                                        <div className="mt-2 flex justify-between text-xs text-neutral-500">
                                          <span>
                                            {uploadProgress >= 100
                                              ? "Upload sent"
                                              : "Transferring file"}
                                          </span>
                                          <span>
                                            Please don't close this page
                                          </span>
                                        </div>
                                      </section>
                                    )} */}

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
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <h2 className="text-sm font-semibold text-white">
                  Series preview
                </h2>
                <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                  Catalog
                </span>
              </div>

              <div className="p-4">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1c1d21]">
                  {artwork.backdrop ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon size={22} className="text-neutral-600" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <ImageIcon size={22} className="text-neutral-600" />
                      <span className="text-[10px] text-neutral-600">
                        No backdrop uploaded
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-lg font-semibold text-white">
                      {title || "Untitled series"}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-300">
                      {releaseYear || "Year"} · {genre || "Genre"} ·{" "}
                      {maturity || "Rating"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-xs leading-5 text-neutral-400">
                  {description || "Series synopsis will appear here."}
                </p>

                <div className="mt-4 flex items-center gap-4 border-t border-white/[0.06] pt-3 text-xs text-neutral-400">
                  <span>{seasons.length} Seasons</span>
                  <span>{totalEpisodes} Episodes</span>
                  <span className="ml-auto text-emerald-400">
                    {readyEpisodes}/{totalEpisodes} Ready
                  </span>
                </div>
              </div>
            </section>

            {/* Upload queue */}
            <section className="rounded-3xl bg-[#121316] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="h-4 w-4 text-neutral-400" />

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Upload queue
                    </h2>

                    <p className="mt-0.5 text-sm text-neutral-600">
                      Current uploads and saved drafts.
                    </p>
                  </div>
                </div>

                <span className="text-xs tabular-nums text-neutral-600">
                  {drafts.length}
                </span>
              </div>

              <div className="space-y-2">
                {drafts.map((item) => (
                  <div key={item.id} className="rounded-xl bg-[#0f1012] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-xs font-medium text-neutral-200">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-[12px] text-neutral-600">
                          {item.type} · {item.size}
                        </p>
                      </div>

                      <span className="shrink-0 text-[12px] text-neutral-600">
                        {item.progress}%
                      </span>
                    </div>

                    {item.progress > 0 && item.progress < 100 && (
                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-neutral-400"
                          style={{
                            width: `${item.progress}%`,
                          }}
                        />
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
                      <span className="text-[12px] text-neutral-600">
                        {item.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setDrafts((current) =>
                            current.filter((draft) => draft.id !== item.id),
                          );
                        }}
                        className="flex items-center gap-1.5 text-[12px] text-neutral-600 transition hover:text-neutral-300"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                // onClick={() => showToast("Publishing ready titles")}
                className="mt-4 w-full rounded-xl border border-white/[0.07]
                    bg-white/[0.03] py-3 text-xs font-medium text-neutral-300
                    transition hover:bg-white/[0.07] hover:text-white"
              >
                Publish ready titles
              </button>
            </section>

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

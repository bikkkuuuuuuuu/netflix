import React, { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  Copy,
  Edit3,
  ExternalLink,
  FileVideo,
  HardDrive,
  Image as ImageIcon,
  MoreHorizontal,
  Play,
  RefreshCw,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import movieSvc from "@/services/movie.service";
import { Movie } from "@/types/data";
import { formatDateString } from "@/lib/utils";
import toast from "react-hot-toast";

function Section({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-[#131416]">
      <div className="flex items-start justify-between gap-6  px-6 py-5">
        <div>
          <h2 className="text-[15px] font-medium text-white">{title}</h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-white/40">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-white/30">
        {label}
      </p>

      <div className="mt-2 text-sm text-white/75">{value}</div>
    </div>
  );
}

function StatusDot({ status }: { status: "ready" | "processing" | "queued" }) {
  const styles = {
    ready: "bg-emerald-400",
    processing: "bg-amber-400",
    queued: "bg-red-400",
  };

  return <span className={`h-1.5 w-1.5 rounded-full ${styles[status]}`} />;
}

function ProcessingStatus({
  status,
}: {
  status: "ready" | "processing" | "queued";
}) {
  const labels = {
    ready: "Ready",
    processing: "Processing",
    queued: "Queued",
  };

  return (
    <div className="flex items-center gap-2 text-sm text-white/60">
      <StatusDot status={status} />
      {labels[status]}
    </div>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
  variant = "secondary",
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
}) {
  const variants = {
    primary: "border-white bg-white text-black hover:bg-white/90",
    secondary:
      "border-white/[0.09] bg-white/[0.04] text-white hover:bg-white/[0.07]",
    danger:
      "border-red-500/20 bg-red-500/[0.06] text-red-400 hover:bg-red-500/[0.1]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${variants[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white"
    >
      {copied ? (
        <>
          <Check size={14} />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy
        </>
      )}
    </button>
  );
}

export default function AdminMovieDetail() {
  const [movieData, setMovieData] = useState<Movie | null>(null);

  const { id } = useParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  // const totalRenditionSize = useMemo(() => {
  //   return movieData?.renditions.reduce((total, rendition) => {
  //     const numeric = parseFloat(rendition.size);

  //     if (rendition.size.includes("GB")) {
  //       return total + numeric;
  //     }

  //     return total + numeric / 1024;
  //   }, 0);
  // }, [movieData?.renditions]);

  // const togglePublish = () => {
  //   setMovieData((current) => ({
  //     ...current,
  //     processing: {
  //       ...current.processing,
  //     },
  //   }));
  // };

  const fetchMovie = async (id: string) => {
    try {
      const response = await movieSvc.detail(id);
      setMovieData(response.detail);
    } catch (exception) {
      console.log(exception);
    }
  };
  useEffect(() => {
    fetchMovie(id as string);
  }, [id]);

  const deleteMovie = async (id: string) => {
    try {
      const response = await movieSvc.delete(id);
      console.log(response);
      if (response.status === "MOVIE_DELETE_SUCCESS") {
        toast.success("Item Deleted Successfully");
      }
      navigate(-1);
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <div
      className="min-h-screen w-full  text-white overflow-y-auto"
      style={{
        scrollbarWidth: "none",
      }}
    >
      {/* Header */}
      <header className=" top-0 z-30 rounded-2xl p-2 m-2 bg-[#121316] ">
        <div className="mx-auto flex h-[72px] max-w-full items-center justify-between px-6 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                navigate(-1);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-medium text-white">
                  Movie details
                </div>

                <div className="text-xs text-white/35">
                  Library / {movieData?.title}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ActionButton icon={<Edit3 size={15} />} onClick={() => {}}>
              Edit
            </ActionButton>

            <ActionButton
              icon={<Play size={15} />}
              variant="primary"
              onClick={() => {}}
            >
              Preview
            </ActionButton>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/50 transition hover:bg-white/[0.07] hover:text-white"
              >
                <MoreHorizontal size={18} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-[#18191c] p-1 shadow-2xl z-10">
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/65 hover:bg-white/[0.05] hover:text-white">
                    <ExternalLink size={15} />
                    Open playback
                  </button>

                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/65 hover:bg-white/[0.05] hover:text-white">
                    <RefreshCw size={15} />
                    Reprocess video
                  </button>

                  <div className="my-1 border-t border-white/[0.06]" />

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setDeleteOpen(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/[0.06]"
                  >
                    <Trash2 size={15} />
                    Delete title
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-full px-2 py-6 ">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl  bg-[#131416]">
          <div className="relative h-[340px] overflow-hidden">
            <img
              src={movieData?.backdrop || ""}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* <div className="absolute inset-0 bg-black/60" />

            <div className="absolute inset-0 bg-black/20" /> */}

            <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
              <div className="flex items-end gap-6">
                <div className="hidden h-[190px] w-[128px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#18191c] shadow-2xl md:block">
                  <img
                    src={movieData?.poster || ""}
                    alt={movieData?.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-3 text-xs text-white/45">
                    <span>{"Movie"}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{movieData?.releaseYear}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{movieData?.runtime} min</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{movieData?.maturityRating}</span>
                  </div>

                  <h1 className="text-3xl font-medium tracking-[-0.03em] text-white lg:text-4xl">
                    {movieData?.title}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                    {movieData?.tagline}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {movieData?.genres.map((genre) => (
                      <span key={genre} className="text-xs text-white/45">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {/* Overview */}
            <Section
              title="Overview"
              description="Core metadata for this title."
              action={
                <button className="text-xs text-white/40 transition hover:text-white">
                  Edit metadata
                </button>
              }
            >
              <div className="grid gap-6 md:grid-cols-2">
                <MetaItem label="Title" value={movieData?.title} />

                <MetaItem
                  label="Slug"
                  value={
                    <code className="font-mono text-xs text-white/55">
                      {movieData?.slug}
                    </code>
                  }
                />

                <MetaItem label="Release year" value={movieData?.releaseYear} />

                <MetaItem
                  label="Runtime"
                  value={`${movieData?.runtime} minutes`}
                />

                <MetaItem label="Type" value={"Movie"} />

                <MetaItem
                  label="Maturity rating"
                  value={movieData?.maturityRating}
                />

                <div className="md:col-span-2">
                  <MetaItem
                    label="Description"
                    value={
                      <p className="max-w-3xl leading-7 text-white/55">
                        {movieData?.description}
                      </p>
                    }
                  />
                </div>
              </div>
            </Section>

            {/* Video processing */}
            <Section
              title="Video processing"
              description="Transcoding and HLS rendition status."
              action={
                <ActionButton icon={<RefreshCw size={14} />} onClick={() => {}}>
                  Reprocess
                </ActionButton>
              }
            >
              <div className="mb-7 rounded-xl border border-white/[0.06] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusDot
                        status={movieData?.processing?.status ?? "processing"}
                      />

                      <span className="text-sm font-medium text-white">
                        Processing complete
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-white/35">
                      All configured renditions have been generated.
                    </p>
                  </div>

                  <span className="font-mono text-sm text-white/60">
                    {movieData?.processing.progress}%
                  </span>
                </div>

                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${movieData?.processing.progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {/* {movieData?.renditions.map((rendition) => (
                  <div
                    key={rendition.name}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-12 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
                        <Video size={16} className="text-white/40" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {rendition.name}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {rendition.resolution} · {rendition.bitrate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <span className="hidden text-xs text-white/35 sm:block">
                        {rendition.size}
                      </span>

                      <ProcessingStatus status={rendition.status} />
                    </div>
                  </div>
                ))} */}
              </div>
            </Section>

            {/* Source */}
            <Section
              title="Source media"
              description="Original uploaded video retained by the platform."
              action={
                <ActionButton icon={<Upload size={14} />} onClick={() => {}}>
                  Replace
                </ActionButton>
              }
            >
              <div className="flex flex-col gap-5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04]">
                    <FileVideo size={20} className="text-white/50" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {movieData?.video?.sourceKey}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {/* {movieData?.source.format} · {movieData?.source.resolution}
                      · {movieData?.source.size} */}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <MetaItem label="Duration" value={movieData?.runtime} />

                  {/* <MetaItem label="Format" value={movieData?.source.format} /> */}
                </div>
              </div>
            </Section>

            {/* Cast */}
            <Section
              title="Cast"
              description="People associated with this title."
              action={
                <button className="text-xs text-white/40 transition hover:text-white">
                  Edit cast
                </button>
              }
            >
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {movieData?.cast.map((person, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-xs text-white/50">
                      {/* {person.charAt(0)} */}
                    </div>

                    <span className="text-sm text-white/60">{person.name}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Publishing */}
            <Section title="Publishing">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Catalog visibility</p>

                    <p className="mt-1 text-xs text-white/35">
                      Available to users
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {}}
                    className="relative h-6 w-11 rounded-full bg-white transition"
                  >
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-black" />
                  </button>
                </div>

                <div className="border-t border-white/[0.06] pt-5">
                  <MetaItem
                    label="Created"
                    value={formatDateString(movieData?.createdAt as string)}
                  />

                  <div className="mt-5">
                    <MetaItem
                      label="Last updated"
                      value={formatDateString(movieData?.updatedAt as string)}
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Artwork */}
            <Section
              title="Images"
              action={
                <button className="text-xs text-white/40 hover:text-white">
                  Manage
                </button>
              }
            >
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-white/40">Poster</span>

                    <ImageIcon size={14} className="text-white/25" />
                  </div>

                  <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03]">
                    <img
                      src={movieData?.poster || ""}
                      alt={movieData?.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-white/40">Backdrop</span>

                    <ImageIcon size={14} className="text-white/25" />
                  </div>

                  <div className="aspect-video overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03]">
                    <img
                      src={movieData?.backdrop || ""}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* HLS */}
            <Section
              title="Playback"
              description="Generated HLS master playlist."
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
                    <Play size={15} className="text-white/45" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-white/35">Master playlist</p>

                    <p className="mt-1 truncate font-mono text-xs text-white/55">
                      master.m3u8
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
                  <p className="break-all font-mono text-[11px] leading-5 text-white/35">
                    {movieData?.video?.hlsUrl}
                  </p>
                </div>

                <div className="flex gap-2">
                  <CopyButton value={movieData?.video?.hlsUrl || ""} />

                  <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 text-xs text-white/50 hover:bg-white/[0.06] hover:text-white">
                    <ExternalLink size={14} />
                    Open
                  </button>
                </div>
              </div>
            </Section>

            {/* Storage */}
            <Section title="Storage">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <HardDrive size={17} className="text-white/35" />

                  <div>
                    <p className="text-sm text-white">Media storage</p>

                    <p className="mt-1 text-xs text-white/35">
                      {/* {totalRenditionSize.toFixed(1)} GB generated */}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
                    <p className="text-[11px] text-white/30">Source</p>

                    <p className="mt-2 text-sm text-white/70">
                      {/* {movieData?.source.size} */}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
                    <p className="text-[11px] text-white/30">HLS</p>

                    <p className="mt-2 text-sm text-white/70">
                      {/* {totalRenditionSize.toFixed(1)} GB */}
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </aside>
        </div>

        {/* Danger zone */}
        <section className="mt-6 rounded-2xl border border-red-500/10 bg-[#131416]">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-medium text-white">
                Delete this title
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-white/35">
                Permanently removes the movie, source media, generated HLS files
                and catalog record. This cannot be undone.
              </p>
            </div>

            <ActionButton
              icon={<Trash2 size={15} />}
              variant="danger"
              onClick={() => setDeleteOpen(true)}
            >
              Delete title
            </ActionButton>
          </div>
        </section>
      </main>

      {/* Delete modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#17181b] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/[0.06] p-6">
              <div>
                <h2 className="text-base font-medium text-white">
                  Delete title
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="text-white/30 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-xl border border-red-500/10 bg-red-500/[0.04] p-4">
                <p className="text-sm leading-6 text-white/60">
                  You are about to permanently delete{" "}
                  <span className="font-medium text-white">
                    {movieData?.title}
                  </span>
                  . This will also remove the source video and generated HLS
                  assets.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <ActionButton onClick={() => setDeleteOpen(false)}>
                  Cancel
                </ActionButton>

                <ActionButton
                  variant="danger"
                  icon={<Trash2 size={15} />}
                  onClick={() => {
                    setDeleteOpen(false);
                    if (movieData) {
                      deleteMovie(movieData?._id);
                    }
                  }}
                >
                  Delete permanently
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

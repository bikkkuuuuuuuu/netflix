import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Database,
  Filter,
  Gauge,
  HardDrive,
  Search,
  Server,
  Settings2,
  Terminal,
  Upload,
  Video,
  X,
  Zap,
} from "lucide-react";

type ActivityItem = {
  id: number;
  type: "upload" | "processing" | "publish" | "update" | "system" | "error";
  title: string;
  description: string;
  time: string;
  user: string;
  movie?: string;
};

type LogItem = {
  id: number;
  time: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
  duration?: string;
};

const activities: ActivityItem[] = [
  {
    id: 1,
    type: "processing",
    title: "Transcoding completed",
    description: "Generated all HLS renditions successfully.",
    time: "2 min ago",
    user: "System",
    movie: "Interstellar",
  },
  {
    id: 2,
    type: "upload",
    title: "Movie uploaded",
    description: "Source media uploaded successfully.",
    time: "8 min ago",
    user: "Bikash",
    movie: "The Batman",
  },
  {
    id: 3,
    type: "update",
    title: "Metadata updated",
    description: "Movie metadata and artwork were updated.",
    time: "21 min ago",
    user: "Bikash",
    movie: "Dune",
  },
  {
    id: 4,
    type: "publish",
    title: "Title published",
    description: "Movie is now available on the platform.",
    time: "34 min ago",
    user: "Bikash",
    movie: "Oppenheimer",
  },
  {
    id: 5,
    type: "system",
    title: "Worker connected",
    description: "Transcoding worker registered successfully.",
    time: "41 min ago",
    user: "System",
  },
  {
    id: 6,
    type: "processing",
    title: "Transcoding started",
    description: "Four rendition jobs were queued.",
    time: "52 min ago",
    user: "System",
    movie: "The Lord of the Rings",
  },
];

const logs: LogItem[] = [
  {
    id: 1,
    time: "20:54:18",
    level: "INFO",
    service: "transcoding-worker",
    message: "Processing completed",
    duration: "3m 42s",
  },
  {
    id: 2,
    time: "20:53:57",
    level: "INFO",
    service: "transcoding-worker",
    message: "Generated 1080p rendition",
  },
  {
    id: 3,
    time: "20:52:31",
    level: "INFO",
    service: "transcoding-worker",
    message: "Generated 720p rendition",
  },
  {
    id: 4,
    time: "20:47:13",
    level: "INFO",
    service: "movie-api",
    message: "Upload completed",
  },
  {
    id: 5,
    time: "20:46:59",
    level: "INFO",
    service: "movie-api",
    message: "Movie record created",
  },
  {
    id: 6,
    time: "20:38:44",
    level: "ERROR",
    service: "transcoding-worker",
    message: "FFmpeg exited with code 1",
  },
  {
    id: 7,
    time: "20:38:41",
    level: "WARN",
    service: "redis",
    message: "Queue latency exceeded threshold",
  },
  {
    id: 8,
    time: "20:32:09",
    level: "INFO",
    service: "movie-api",
    message: "Authentication successful",
  },
];

const processingMovies = [
  {
    title: "Interstellar",
    progress: 100,
    poster: "/images/posters/interstellar.jpg",
    status: "Completed",
  },
  {
    title: "The Batman",
    progress: 72,
    poster: "/images/posters/the-batman.jpg",
    status: "Processing 720p",
  },
  {
    title: "Dune",
    progress: 41,
    poster: "/images/posters/dune.jpg",
    status: "Processing 480p",
  },
];

const activityIcons = {
  upload: Upload,
  processing: Video,
  publish: Check,
  update: Settings2,
  system: Server,
  error: AlertCircle,
};

function SectionLabel({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
      {Icon && <Icon size={13} strokeWidth={1.7} />}
      <span>{children}</span>
    </div>
  );
}

function StatusDot({ status }: { status: "online" | "warning" | "error" }) {
  return (
    <span
      className={[
        "h-1.5 w-1.5 rounded-full",
        status === "online" && "bg-emerald-400",
        status === "warning" && "bg-amber-400",
        status === "error" && "bg-red-400",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function ActivityIcon({ type }: { type: ActivityItem["type"] }) {
  const Icon = activityIcons[type];

  return (
    <div
      className={[
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
        type === "error"
          ? "border-red-400/20 bg-red-400/[0.06] text-red-400"
          : "border-white/[0.07] bg-white/[0.025] text-white/55",
      ].join(" ")}
    >
      <Icon size={14} strokeWidth={1.7} />
    </div>
  );
}

function LogLevel({ level }: { level: LogItem["level"] }) {
  if (level === "ERROR") {
    return <span className="text-red-400">ERROR</span>;
  }

  if (level === "WARN") {
    return <span className="text-amber-400">WARN </span>;
  }

  return <span className="text-emerald-400">INFO </span>;
}

export default function AdminActivity() {
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredActivities = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return activities;

    return activities.filter((item) =>
      [item.title, item.description, item.user, item.movie]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return logs;

    return logs.filter((log) =>
      [log.level, log.service, log.message]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  return (
    <div
      className="min-h-screen  overflow-y-auto text-white"
      style={{ scrollbarWidth: "none" }}
    >
      <main className="mx-auto w-full  px-5 py-6">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-white/35">
              <Activity size={15} strokeWidth={1.6} />
              <span className="text-[11px] uppercase tracking-[0.18em]">
                System
              </span>
            </div>

            <h1 className="font-mori text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              Activity & Logs
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Monitor everything happening across your platform, from content
              uploads to background processing and system events.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/[0.07] bg-[#131416] px-3 sm:w-[260px]">
              <Search
                size={15}
                strokeWidth={1.7}
                className="shrink-0 text-white/30"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search activity or logs"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-white/30 transition hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters((value) => !value)}
              className={[
                "flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm transition",
                showFilters
                  ? "border-white/[0.14] bg-white/[0.06] text-white"
                  : "border-white/[0.07] bg-[#131416] text-white/55 hover:bg-white/[0.045] hover:text-white",
              ].join(" ")}
            >
              <Filter size={15} strokeWidth={1.7} />
              Filters
            </button>
          </div>
        </header>

        {showFilters && (
          <div className="mb-5 flex flex-wrap gap-2 rounded-[20px]  bg-[#131416] p-4">
            {["All events", "Content", "Processing", "System", "Errors"].map(
              (filter) => (
                <button
                  key={filter}
                  className="rounded-lg  px-3 py-2 text-xs text-white/50 transition hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white"
                >
                  {filter}
                </button>
              ),
            )}
          </div>
        )}

        {/* Bento */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Today */}
          <section className="relative overflow-hidden rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-4">
            <SectionLabel icon={Clock3}>Today</SectionLabel>

            <div className="flex items-end justify-between gap-5">
              <div>
                <div className="font-mori text-7xl font-medium tracking-[-0.07em] sm:text-8xl">
                  148
                </div>

                <p className="mt-3 text-sm text-white/35">
                  events recorded today
                </p>
              </div>

              <div className="pb-2 text-right">
                <div className="text-sm text-emerald-400">+18.4%</div>
                <div className="mt-1 text-[11px] text-white/25">
                  compared with yesterday
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-1">
              {Array.from({ length: 30 }).map((_, index) => {
                const heights = [
                  12, 18, 10, 24, 16, 32, 21, 28, 17, 34, 26, 18, 38, 29, 42,
                  25, 31, 18, 35, 45, 30, 22, 39, 28, 43, 32, 26, 40, 34, 48,
                ];

                return (
                  <div
                    key={index}
                    className="flex-1 rounded-full bg-white/[0.12]"
                    style={{ height: `${heights[index]}px` }}
                  />
                );
              })}
            </div>

            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.14em] text-white/20">
              <span>00:00</span>
              <span>12:00</span>
              <span>Now</span>
            </div>
          </section>

          {/* System Health */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-8">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Gauge}>System Health</SectionLabel>

              <div className="flex items-center gap-2 text-xs text-white/35">
                <StatusDot status="online" />
                All systems operational
              </div>
            </div>

            <div className="grid grid-cols-1 divide-y divide-white/[0.06] md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="space-y-6 pr-0 md:pr-8">
                <HealthRow
                  icon={Server}
                  label="API"
                  value="Operational"
                  detail="99.98% uptime"
                  status="online"
                />

                <HealthRow
                  icon={Zap}
                  label="Workers"
                  value="4 active"
                  detail="12 queued jobs"
                  status="online"
                />
              </div>

              <div className="mt-6 space-y-6 pt-6 md:mt-0 md:pl-8 md:pt-0">
                <HealthRow
                  icon={Database}
                  label="Redis"
                  value="Connected"
                  detail="18ms latency"
                  status="online"
                />

                <HealthRow
                  icon={HardDrive}
                  label="Storage"
                  value="68% used"
                  detail="1.8 TB available"
                  status="warning"
                />
              </div>
            </div>
          </section>

          {/* Latest Activity */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-7">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Activity}>Latest Activity</SectionLabel>

              <button className="flex items-center gap-1 text-xs text-white/30 transition hover:text-white">
                View all
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="relative">
              <div className="absolute bottom-4 left-4 top-4 w-px bg-white/[0.06]" />

              <div className="space-y-1">
                {filteredActivities.slice(0, 6).map((activity) => (
                  <div
                    key={activity.id}
                    className="group relative flex gap-4 rounded-2xl px-0 py-3 transition"
                  >
                    <ActivityIcon type={activity.type} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="text-sm font-medium text-white/85">
                            {activity.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-white/30">
                            {activity.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-[11px] text-white/25">
                          {activity.time}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-[11px] text-white/25">
                        <span>{activity.user}</span>

                        {activity.movie && (
                          <>
                            <span className="text-white/15">/</span>
                            <span>{activity.movie}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredActivities.length === 0 && (
                  <div className="py-12 text-center text-sm text-white/30">
                    No activity found.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Warnings / Errors */}
          <section className="grid grid-cols-2 gap-4 xl:col-span-5">
            <div className="rounded-[24px]  bg-[#131416] p-6">
              <SectionLabel icon={AlertCircle}>Warnings</SectionLabel>

              <div className="font-mori text-6xl font-medium tracking-[-0.06em]">
                5
              </div>

              <p className="mt-3 text-xs leading-5 text-white/30">
                Non-critical events requiring attention.
              </p>

              <button className="mt-7 flex items-center gap-1 text-xs text-white/45 transition hover:text-white">
                Inspect
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="rounded-[24px] bg-[#131416] p-6">
              <SectionLabel icon={AlertCircle}>Errors</SectionLabel>

              <div className="font-mori text-6xl font-medium tracking-[-0.06em] text-red-400">
                1
              </div>

              <p className="mt-3 text-xs leading-5 text-white/30">
                One system event needs investigation.
              </p>

              <button className="mt-7 flex items-center gap-1 text-xs text-red-400/70 transition hover:text-red-400">
                Inspect
                <ChevronRight size={13} />
              </button>
            </div>
          </section>

          {/* Processing */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-5">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Video}>Processing</SectionLabel>

              <span className="text-xs text-white/25">3 active</span>
            </div>

            <div className="space-y-5">
              {processingMovies.map((movie) => (
                <div key={movie.title} className="flex gap-4">
                  <div className="h-[68px] w-[46px] shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
                    <img
                      src={movie.poster}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-white/80">
                          {movie.title}
                        </h3>

                        <p className="mt-1 text-[11px] text-white/30">
                          {movie.status}
                        </p>
                      </div>

                      <span className="text-xs text-white/40">
                        {movie.progress}%
                      </span>
                    </div>

                    <div className="mt-4 h-[2px] overflow-hidden bg-white/[0.07]">
                      <div
                        className="h-full bg-white/60 transition-all"
                        style={{ width: `${movie.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Queue / infrastructure */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-4">
            <SectionLabel icon={Zap}>Queue</SectionLabel>

            <div className="flex items-end justify-between">
              <div>
                <div className="font-mori text-6xl font-medium tracking-[-0.06em]">
                  12
                </div>

                <p className="mt-2 text-xs text-white/30">
                  jobs waiting to be processed
                </p>
              </div>

              <div className="pb-1 text-right">
                <div className="text-sm text-white/65">4</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/20">
                  workers
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <QueueRow label="Transcoding" value="8" />
              <QueueRow label="Subtitles" value="2" />
              <QueueRow label="Finalization" value="2" />
            </div>
          </section>

          {/* Logs */}
          <section className="overflow-hidden rounded-[24px]  bg-[#131416] xl:col-span-3">
            <div className="border-b border-white/[0.06] p-6">
              <SectionLabel icon={Terminal}>Live</SectionLabel>

              <div className="flex items-center gap-2 text-xs text-white/40">
                <StatusDot status="online" />
                Streaming system logs
              </div>
            </div>

            <div
              className="max-h-[260px] overflow-y-auto p-5"
              style={{
                scrollbarWidth: "none",
              }}
            >
              <div className="space-y-4">
                {filteredLogs.slice(0, 6).map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="group w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] text-white/20">
                        {log.time}
                      </span>

                      <span className="font-mono text-[10px]">
                        <LogLevel level={log.level} />
                      </span>
                    </div>

                    <div className="mt-1 truncate font-mono text-[11px] text-white/50 transition group-hover:text-white/80">
                      {log.message}
                    </div>

                    <div className="mt-1 truncate font-mono text-[10px] text-white/20">
                      {log.service}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Full-width system logs */}
          <section className="overflow-hidden rounded-[24px]  bg-[#101113] xl:col-span-12">
            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:px-7">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal size={15} className="text-white/35" />

                  <h2 className="text-sm font-medium text-white/80">
                    System Logs
                  </h2>
                </div>

                <p className="mt-1 text-xs text-white/25">
                  Latest application, worker and infrastructure events.
                </p>
              </div>

              <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.14em] text-white/25">
                <span>Live</span>
                <span>•</span>
                <span>Last 24 hours</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[760px] font-mono text-[11px]">
                {filteredLogs.map((log, index) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={[
                      "grid w-full grid-cols-[90px_70px_180px_minmax(0,1fr)_80px] gap-4 px-6 py-3 text-left transition hover:bg-white/[0.025] sm:px-7",
                      index !== filteredLogs.length - 1 &&
                        "border-b border-white/[0.035]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="text-white/20">{log.time}</span>

                    <LogLevel level={log.level} />

                    <span className="truncate text-white/30">
                      {log.service}
                    </span>

                    <span
                      className={[
                        "truncate",
                        log.level === "ERROR"
                          ? "text-red-400/80"
                          : "text-white/55",
                      ].join(" ")}
                    >
                      {log.message}
                    </span>

                    <span className="text-right text-white/20">
                      {log.duration || "—"}
                    </span>
                  </button>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="px-7 py-16 text-center text-white/25">
                    No logs found.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Log detail drawer */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSelectedLog(null)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col border-l border-white/[0.07] bg-[#111214] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                  Log event
                </div>

                <h2 className="mt-2 text-lg font-medium">
                  {selectedLog.service}
                </h2>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-white/40 transition hover:bg-white/[0.04] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              <div>
                <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-white/25">
                  Level
                </div>

                <div className="font-mono text-sm">
                  <LogLevel level={selectedLog.level} />
                </div>
              </div>

              <div>
                <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-white/25">
                  Message
                </div>

                <p className="text-sm leading-6 text-white/70">
                  {selectedLog.message}
                </p>
              </div>

              <div>
                <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-white/25">
                  Timestamp
                </div>

                <p className="font-mono text-sm text-white/50">
                  {selectedLog.time}
                </p>
              </div>

              {selectedLog.duration && (
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-white/25">
                    Duration
                  </div>

                  <p className="font-mono text-sm text-white/50">
                    {selectedLog.duration}
                  </p>
                </div>
              )}

              <div className="border-t border-white/[0.06] pt-6">
                <div className="mb-3 text-[10px] uppercase tracking-[0.16em] text-white/25">
                  Context
                </div>

                <pre className="overflow-x-auto rounded-xl  bg-[#0b0c0e] p-4 font-mono text-[11px] leading-6 text-white/40">
                  {`{
  "service": "${selectedLog.service}",
  "level": "${selectedLog.level}",
  "timestamp": "${selectedLog.time}",
  "message": "${selectedLog.message}"
}`}
                </pre>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function HealthRow({
  icon: Icon,
  label,
  value,
  detail,
  status,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  status: "online" | "warning" | "error";
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  bg-white/[0.025] text-white/40">
        <Icon size={17} strokeWidth={1.5} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">{label}</span>
          <StatusDot status={status} />
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-white/45">{value}</span>
          <span className="text-white/15">·</span>
          <span className="text-xs text-white/25">{detail}</span>
        </div>
      </div>
    </div>
  );
}

function QueueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        <Circle size={6} fill="currentColor" className="text-white/20" />
        <span className="text-xs text-white/45">{label}</span>
      </div>

      <span className="font-mono text-xs text-white/45">{value}</span>
    </div>
  );
}

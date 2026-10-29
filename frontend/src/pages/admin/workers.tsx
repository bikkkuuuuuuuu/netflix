import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Check,
  ChevronRight,
  Clock3,
  Cpu,
  HardDrive,
  MemoryStick,
  Pause,
  Play,
  RefreshCw,
  Server,
  Terminal,
  Video,
  X,
  Zap,
} from "lucide-react";

type WorkerStatus = "processing" | "idle" | "paused" | "offline";

type Worker = {
  id: string;
  status: WorkerStatus;
  job: string | null;
  progress: number;
  jobs: number;
  elapsed: string;
  cpu: number;
  memory: number;
};

const workers: Worker[] = [
  {
    id: "worker-01",
    status: "processing",
    job: "Interstellar — 1080p",
    progress: 100,
    jobs: 2,
    elapsed: "03:42",
    cpu: 64,
    memory: 48,
  },
  {
    id: "worker-02",
    status: "processing",
    job: "The Batman — 720p",
    progress: 72,
    jobs: 1,
    elapsed: "02:18",
    cpu: 71,
    memory: 56,
  },
  {
    id: "worker-03",
    status: "idle",
    job: null,
    progress: 0,
    jobs: 0,
    elapsed: "—",
    cpu: 4,
    memory: 31,
  },
  {
    id: "worker-04",
    status: "processing",
    job: "Dune — 480p",
    progress: 41,
    jobs: 3,
    elapsed: "01:07",
    cpu: 58,
    memory: 44,
  },
];

const jobs = [
  {
    id: "job-01",
    movie: "Interstellar",
    type: "1080p",
    status: "completed",
    progress: 100,
    duration: "03:42",
  },
  {
    id: "job-02",
    movie: "The Batman",
    type: "720p",
    status: "processing",
    progress: 72,
    duration: "02:18",
  },
  {
    id: "job-03",
    movie: "Dune",
    type: "480p",
    status: "processing",
    progress: 41,
    duration: "01:07",
  },
  {
    id: "job-04",
    movie: "Oppenheimer",
    type: "360p",
    status: "queued",
    progress: 0,
    duration: "—",
  },
];

function SectionLabel({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/30">
      {Icon && <Icon size={13} strokeWidth={1.6} />}
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: WorkerStatus }) {
  const className =
    status === "processing"
      ? "bg-emerald-400"
      : status === "idle"
        ? "bg-white/30"
        : status === "paused"
          ? "bg-amber-400"
          : "bg-red-400";

  return <span className={`h-1.5 w-1.5 rounded-full ${className}`} />;
}

function WorkerStatus({ status }: { status: WorkerStatus }) {
  const labels = {
    processing: "Processing",
    idle: "Idle",
    paused: "Paused",
    offline: "Offline",
  };

  return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      <StatusDot status={status} />
      {labels[status]}
    </div>
  );
}

export default function AdminWorkers() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeWorkers = useMemo(
    () => workers.filter((worker) => worker.status === "processing").length,
    [],
  );

  const handleRefresh = () => {
    setIsRefreshing(true);

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div
      className="min-h-screen w-full overflow-y-auto text-white"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <main className="mx-auto w-full max-w-[1600px] px-5 py-6 ">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-mori text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              Workers
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Monitor transcoding workers, queue pressure, resource usage and
              background jobs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-white/35">
              <StatusDot status="processing" />
              {activeWorkers} workers processing
            </div>

            <button
              onClick={handleRefresh}
              className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#131416] px-3 text-xs text-white/45 transition hover:bg-white/[0.04] hover:text-white"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* Bento */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Worker overview */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-5">
            <SectionLabel icon={Server}>Active Workers</SectionLabel>

            <div className="flex items-end justify-between">
              <div>
                <div className="font-mori text-7xl font-medium tracking-[-0.07em] sm:text-8xl">
                  {activeWorkers}
                  <span className="text-4xl text-white/15">/4</span>
                </div>

                <p className="mt-3 text-sm text-white/30">
                  workers currently processing
                </p>
              </div>

              <div className="flex items-center gap-2 pb-2 text-xs text-emerald-400">
                <StatusDot status="processing" />
                Healthy
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <ResourceMetric icon={Cpu} label="CPU" value="64%" />

              <ResourceMetric
                icon={MemoryStick}
                label="Memory"
                value="3.8 GB"
              />
            </div>
          </section>

          {/* Queue */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-7">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Zap}>Queue</SectionLabel>

              <span className="text-xs text-white/25">BullMQ</span>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <QueueMetric label="Waiting" value="12" detail="jobs" />

              <QueueMetric label="Active" value="4" detail="jobs" />

              <QueueMetric label="Completed" value="184" detail="today" />

              <QueueMetric label="Failed" value="1" detail="today" error />
            </div>

            <div className="mt-8 h-[3px] overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full w-[67%] bg-white/50" />
            </div>

            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.14em] text-white/20">
              <span>Queue pressure</span>
              <span>67%</span>
            </div>
          </section>

          {/* Worker nodes */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-8">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Activity}>Worker Nodes</SectionLabel>

              <span className="text-xs text-white/25">
                {workers.length} registered
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-[170px_120px_minmax(180px,1fr)_70px_90px_80px] gap-4 border-b border-white/[0.06] pb-3 text-[10px] uppercase tracking-[0.14em] text-white/20">
                  <span>Worker</span>
                  <span>Status</span>
                  <span>Current job</span>
                  <span>CPU</span>
                  <span>Memory</span>
                  <span />
                </div>

                <div>
                  {workers.map((worker, index) => (
                    <div
                      key={worker.id}
                      className={[
                        "grid grid-cols-[170px_120px_minmax(180px,1fr)_70px_90px_80px] items-center gap-4 py-4",
                        index !== workers.length - 1 &&
                          "border-b border-white/[0.04]",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg  bg-white/[0.025]">
                          <Server
                            size={14}
                            className="text-white/35"
                            strokeWidth={1.5}
                          />
                        </div>

                        <span className="font-mono text-xs text-white/60">
                          {worker.id}
                        </span>
                      </div>

                      <WorkerStatus status={worker.status} />

                      <div className="min-w-0">
                        {worker.job ? (
                          <>
                            <div className="truncate text-xs text-white/55">
                              {worker.job}
                            </div>

                            <div className="mt-2 h-[2px] w-full bg-white/[0.06]">
                              <div
                                className="h-full bg-white/50"
                                style={{
                                  width: `${worker.progress}%`,
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-white/20">
                            No active job
                          </span>
                        )}
                      </div>

                      <span className="font-mono text-xs text-white/40">
                        {worker.cpu}%
                      </span>

                      <span className="font-mono text-xs text-white/40">
                        {worker.memory}%
                      </span>

                      <button
                        onClick={() => setSelectedWorker(worker)}
                        className="flex items-center justify-end text-white/20 transition hover:text-white"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Infrastructure */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-4">
            <SectionLabel icon={HardDrive}>Resources</SectionLabel>

            <div className="space-y-7">
              <ResourceBar label="CPU" value="64%" progress={64} />

              <ResourceBar label="Memory" value="48%" progress={48} />

              <ResourceBar label="Storage" value="68%" progress={68} />

              <ResourceBar label="Network" value="31%" progress={31} />
            </div>
          </section>

          {/* Throughput */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-7">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Activity}>Job Throughput</SectionLabel>

              <span className="text-xs text-white/25">Last 24 hours</span>
            </div>

            <div className="flex h-[180px] items-end gap-2">
              {[
                25, 34, 28, 45, 38, 52, 42, 64, 48, 72, 58, 76, 63, 82, 69, 91,
                74, 62, 78, 88, 71, 94, 82, 98,
              ].map((height, index) => (
                <div
                  key={index}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-sm bg-white/[0.13] transition group-hover:bg-white/[0.25]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.14em] text-white/20">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Now</span>
            </div>
          </section>

          {/* Failed */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-5">
            <SectionLabel icon={AlertCircle}>Failed Jobs</SectionLabel>

            <div className="flex items-end justify-between gap-5">
              <div>
                <div className="font-mori text-7xl font-medium tracking-[-0.07em] text-red-400">
                  1
                </div>

                <p className="mt-3 text-sm text-white/30">
                  failed processing job today
                </p>
              </div>

              <button className="flex items-center gap-1 text-xs text-white/35 transition hover:text-white">
                View logs
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="mt-8 border-t border-white/[0.06] pt-5">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0 text-red-400"
                  strokeWidth={1.6}
                />

                <div>
                  <div className="text-xs text-white/60">
                    FFmpeg exited with code 1
                  </div>

                  <div className="mt-1 font-mono text-[10px] text-white/25">
                    transcoding-worker / job-184
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent jobs */}
          <section className="overflow-hidden rounded-[24px]  bg-[#131416] xl:col-span-12">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5 sm:px-7">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal size={15} className="text-white/30" />
                  <h2 className="text-sm font-medium text-white/75">
                    Recent Jobs
                  </h2>
                </div>

                <p className="mt-1 text-xs text-white/25">
                  Latest jobs handled by the worker pool.
                </p>
              </div>

              <button className="flex items-center gap-1 text-xs text-white/30 transition hover:text-white">
                View queue
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className={[
                      "grid grid-cols-[minmax(180px,1fr)_100px_140px_minmax(180px,1fr)_90px] items-center gap-5 px-6 py-4 sm:px-7",
                      index !== jobs.length - 1 &&
                        "border-b border-white/[0.04]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg  bg-white/[0.025]">
                        <Video
                          size={14}
                          className="text-white/30"
                          strokeWidth={1.5}
                        />
                      </div>

                      <span className="text-xs text-white/60">{job.movie}</span>
                    </div>

                    <span className="font-mono text-[11px] text-white/30">
                      {job.type}
                    </span>

                    <div className="flex items-center gap-2 text-xs text-white/40">
                      {job.status === "completed" && (
                        <Check size={13} className="text-emerald-400" />
                      )}

                      {job.status === "processing" && (
                        <StatusDot status="processing" />
                      )}

                      {job.status === "queued" && (
                        <Clock3 size={13} className="text-white/25" />
                      )}

                      {job.status}
                    </div>

                    <div>
                      <div className="h-[2px] bg-white/[0.06]">
                        <div
                          className="h-full bg-white/45"
                          style={{
                            width: `${job.progress}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 text-[10px] text-white/20">
                        {job.progress}%
                      </div>
                    </div>

                    <span className="text-right font-mono text-[11px] text-white/25">
                      {job.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Worker drawer */}
      {selectedWorker && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSelectedWorker(null)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col border-l border-white/[0.07] bg-[#111214]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                  Worker
                </div>

                <h2 className="mt-2 font-mono text-lg text-white/80">
                  {selectedWorker.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedWorker(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-white/35 transition hover:bg-white/[0.04] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              <div>
                <SectionLabel>Status</SectionLabel>
                <WorkerStatus status={selectedWorker.status} />
              </div>

              <div>
                <SectionLabel>Current Job</SectionLabel>

                <p className="text-sm text-white/65">
                  {selectedWorker.job || "No active job"}
                </p>

                {selectedWorker.job && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/30">
                      <span>Progress</span>
                      <span>{selectedWorker.progress}%</span>
                    </div>

                    <div className="mt-2 h-[3px] bg-white/[0.06]">
                      <div
                        className="h-full bg-white/55"
                        style={{
                          width: `${selectedWorker.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Resources</SectionLabel>

                <div className="space-y-5">
                  <ResourceBar
                    label="CPU"
                    value={`${selectedWorker.cpu}%`}
                    progress={selectedWorker.cpu}
                  />

                  <ResourceBar
                    label="Memory"
                    value={`${selectedWorker.memory}%`}
                    progress={selectedWorker.memory}
                  />
                </div>
              </div>

              <div>
                <SectionLabel>Controls</SectionLabel>

                <div className="flex gap-2">
                  <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white">
                    <Pause size={14} />
                    Pause
                  </button>

                  <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white">
                    <RefreshCw size={14} />
                    Restart
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function ResourceMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-white/25">
        <Icon size={14} strokeWidth={1.5} />
        <span className="text-[10px] uppercase tracking-[0.14em]">{label}</span>
      </div>

      <div className="mt-5 font-mono text-lg text-white/65">{value}</div>
    </div>
  );
}

function QueueMetric({
  label,
  value,
  detail,
  error,
}: {
  label: string;
  value: string;
  detail: string;
  error?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/20">
        {label}
      </div>

      <div
        className={[
          "mt-3 font-mori text-4xl tracking-[-0.05em]",
          error ? "text-red-400" : "text-white/80",
        ].join(" ")}
      >
        {value}
      </div>

      <div className="mt-1 text-xs text-white/25">{detail}</div>
    </div>
  );
}

function ResourceBar({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-white/40">{label}</span>
        <span className="font-mono text-[11px] text-white/25">{value}</span>
      </div>

      <div className="h-[3px] overflow-hidden bg-white/[0.06]">
        <div className="h-full bg-white/45" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

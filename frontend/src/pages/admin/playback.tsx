import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Clock3,
  Cloud,
  Download,
  Gauge,
  Globe2,
  HardDrive,
  Radio,
  Server,
  Signal,
  Tv,
  Video,
} from "lucide-react";

const renditionData = [
  {
    label: "1080p",
    percentage: 42,
  },
  {
    label: "720p",
    percentage: 31,
  },
  {
    label: "480p",
    percentage: 18,
  },
  {
    label: "360p",
    percentage: 9,
  },
];

const problematicTitles = [
  {
    rank: "01",
    title: "Dune",
    errors: "1.42%",
    sessions: "18.2K",
    issue: "Segment timeout",
  },
  {
    rank: "02",
    title: "The Batman",
    errors: "0.91%",
    sessions: "14.8K",
    issue: "Startup delay",
  },
  {
    rank: "03",
    title: "Arrival",
    errors: "0.72%",
    sessions: "11.4K",
    issue: "CDN response",
  },
  {
    rank: "04",
    title: "Oppenheimer",
    errors: "0.61%",
    sessions: "9.7K",
    issue: "Manifest error",
  },
];

const playbackErrors = [
  {
    code: "404",
    name: "Segment not found",
    count: 48,
    percentage: "62%",
  },
  {
    code: "403",
    name: "Access denied",
    count: 12,
    percentage: "16%",
  },
  {
    code: "500",
    name: "Origin failure",
    count: 6,
    percentage: "8%",
  },
  {
    code: "502",
    name: "Gateway error",
    count: 4,
    percentage: "5%",
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

function StatusDot({
  type = "healthy",
}: {
  type?: "healthy" | "warning" | "error";
}) {
  return (
    <span
      className={[
        "h-1.5 w-1.5 rounded-full",
        type === "healthy" && "bg-emerald-400",
        type === "warning" && "bg-amber-400",
        type === "error" && "bg-red-400",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function MetricCard({
  label,
  value,
  change,
  detail,
  icon: Icon,
  direction = "up",
  warning = false,
}: {
  label: string;
  value: string;
  change: string;
  detail: string;
  icon: React.ElementType;
  direction?: "up" | "down";
  warning?: boolean;
}) {
  const positive =
    direction === "up" && !warning
      ? true
      : direction === "down" && warning
        ? true
        : false;

  return (
    <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <SectionLabel icon={Icon}>{label}</SectionLabel>

        <div
          className={[
            "flex items-center gap-1 text-[11px]",
            positive ? "text-emerald-400" : "text-red-400",
          ].join(" ")}
        >
          {direction === "up" ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}

          {change}
        </div>
      </div>

      <div className="font-mori text-5xl font-medium tracking-[-0.06em] sm:text-6xl">
        {value}
      </div>

      <p className="mt-3 text-xs text-white/25">{detail}</p>
    </section>
  );
}

export default function AdminPlayback() {
  const [range, setRange] = useState("Last 24 hours");

  return (
    <div
      className="min-h-screen w-full overflow-y-auto text-white"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <main className="mx-auto w-full max-w-[1600px] px-5 py-6 ">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-mori text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              Playback
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Monitor streaming quality, delivery performance and playback
              failures across your platform.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#131416] px-4 text-xs text-white/45 transition hover:bg-white/[0.04] hover:text-white">
              <Download size={14} />
              Export
            </button>

            <div className="relative">
              <select
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className="h-11 appearance-none rounded-xl border border-white/[0.07] bg-[#131416] pl-4 pr-10 text-xs text-white/55 outline-none"
              >
                <option>Last hour</option>
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/25"
              />
            </div>
          </div>
        </header>

        {/* Bento */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Top metrics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:col-span-12">
            <MetricCard
              label="Startup"
              value="1.8s"
              change="12%"
              detail="average time until first frame"
              icon={Clock3}
              direction="down"
            />

            <MetricCard
              label="Rebuffer"
              value="0.42%"
              change="8.4%"
              detail="sessions experiencing buffering"
              icon={Signal}
              direction="down"
              warning
            />

            <MetricCard
              label="Playback Success"
              value="99.94%"
              change="0.3%"
              detail="sessions starting successfully"
              icon={PlayIcon}
            />
          </div>

          {/* Playback health */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-8">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Activity}>Playback Health</SectionLabel>

              <div className="flex items-center gap-2 text-xs text-white/30">
                <StatusDot />
                Healthy
              </div>
            </div>

            <div className="mb-5 flex items-end gap-3">
              <span className="font-mori text-4xl tracking-[-0.05em]">
                99.94%
              </span>

              <span className="pb-1 text-xs text-emerald-400">+0.3%</span>
            </div>

            <div className="relative h-[280px]">
              {/* Grid */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[100, 99.95, 99.9, 99.85, 99.8].map((value) => (
                  <div key={value} className="flex items-center gap-3">
                    <span className="w-10 text-right text-[10px] text-white/15">
                      {value}%
                    </span>

                    <div className="h-px flex-1 bg-white/[0.045]" />
                  </div>
                ))}
              </div>

              <svg
                viewBox="0 0 900 250"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-14 right-0 h-[250px] w-[calc(100%-56px)]"
              >
                <path
                  d="M0 116 C50 112 70 121 110 113 C150 105 170 121 210 109 C250 98 280 112 320 101 C360 90 390 108 430 94 C470 81 510 101 550 88 C590 76 620 96 660 82 C700 69 735 89 770 72 C810 55 850 74 900 51"
                  fill="none"
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="ml-14 flex justify-between text-[10px] uppercase tracking-[0.14em] text-white/15">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Now</span>
            </div>
          </section>

          {/* Current state */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-4">
            <SectionLabel icon={Gauge}>Current Playback</SectionLabel>

            <div className="font-mori text-6xl font-medium tracking-[-0.07em]">
              24.8K
            </div>

            <p className="mt-3 text-xs text-white/25">
              active playback sessions right now
            </p>

            <div className="mt-9 space-y-5">
              <PlaybackStat label="Starting" value="1,284" />

              <PlaybackStat label="Buffering" value="104" />

              <PlaybackStat label="Playing" value="23,412" />
            </div>
          </section>

          {/* Renditions */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-7">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Video}>Rendition Distribution</SectionLabel>

              <span className="text-xs text-white/25">{range}</span>
            </div>

            <div className="space-y-7">
              {renditionData.map((rendition) => (
                <div key={rendition.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-white/50">
                      {rendition.label}
                    </span>

                    <span className="font-mono text-xs text-white/30">
                      {rendition.percentage}%
                    </span>
                  </div>

                  <div className="h-[4px] bg-white/[0.06]">
                    <div
                      className="h-full bg-white/45"
                      style={{
                        width: `${rendition.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 grid grid-cols-2 gap-4 border-t border-white/[0.05] pt-5 sm:grid-cols-4">
              <MiniStat label="Avg bitrate" value="3.8 Mbps" />

              <MiniStat label="Peak bitrate" value="6.2 Mbps" />

              <MiniStat label="Sessions" value="84.2K" />

              <MiniStat label="Adaptive" value="91%" />
            </div>
          </section>

          {/* CDN */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-5">
            <SectionLabel icon={Cloud}>CDN Delivery</SectionLabel>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              <MiniStat label="Cache hit" value="94.8%" />

              <MiniStat label="Origin" value="5.2%" />

              <MiniStat label="Latency" value="82ms" />

              <MiniStat label="Bandwidth" value="2.8 TB" />
            </div>

            <div className="mt-9 border-t border-white/[0.05] pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe2
                    size={14}
                    className="text-white/25"
                    strokeWidth={1.5}
                  />

                  <span className="text-xs text-white/35">Edge coverage</span>
                </div>

                <span className="font-mono text-xs text-white/45">
                  96 regions
                </span>
              </div>
            </div>
          </section>

          {/* Problematic titles */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-7">
            <div className="flex items-start justify-between">
              <SectionLabel icon={AlertCircle}>Problematic Titles</SectionLabel>

              <span className="text-xs text-white/25">highest error rate</span>
            </div>

            <div>
              {problematicTitles.map((movie, index) => (
                <div
                  key={movie.title}
                  className={[
                    "grid grid-cols-[35px_minmax(120px,1fr)_80px_80px] items-center gap-4 py-4",
                    index !== problematicTitles.length - 1 &&
                      "border-b border-white/[0.05]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="font-mono text-[10px] text-white/20">
                    {movie.rank}
                  </span>

                  <div className="min-w-0">
                    <div className="truncate text-sm text-white/60">
                      {movie.title}
                    </div>

                    <div className="mt-1 truncate text-[10px] text-white/20">
                      {movie.issue}
                    </div>
                  </div>

                  <span className="text-right font-mono text-xs text-red-400/70">
                    {movie.errors}
                  </span>

                  <span className="text-right font-mono text-[10px] text-white/25">
                    {movie.sessions}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Playback errors */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-5">
            <div className="flex items-start justify-between">
              <SectionLabel icon={AlertCircle}>Playback Errors</SectionLabel>

              <span className="font-mono text-xs text-red-400/70">
                77 total
              </span>
            </div>

            <div className="space-y-5">
              {playbackErrors.map((error) => (
                <div key={error.code}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-red-400/70">
                        {error.code}
                      </span>

                      <span className="text-xs text-white/40">
                        {error.name}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-white/25">
                      {error.count}
                    </span>
                  </div>

                  <div className="mt-2 h-[3px] bg-white/[0.06]">
                    <div
                      className="h-full bg-red-400/40"
                      style={{
                        width: error.percentage,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quality */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-5">
            <SectionLabel icon={BarChart3}>Quality</SectionLabel>

            <div className="space-y-6">
              <QualityRow label="First frame" value="1.8s" status="good" />

              <QualityRow label="Video startup" value="1.6s" status="good" />

              <QualityRow label="Audio startup" value="1.2s" status="good" />

              <QualityRow label="Rebuffer ratio" value="0.42%" status="good" />

              <QualityRow
                label="Playback failure"
                value="0.08%"
                status="good"
              />
            </div>
          </section>

          {/* Network */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-7">
            <SectionLabel icon={Signal}>Network Conditions</SectionLabel>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <NetworkMetric label="Wi-Fi" value="61%" detail="of sessions" />

              <NetworkMetric label="5G / 4G" value="29%" detail="of sessions" />

              <NetworkMetric
                label="Ethernet"
                value="10%"
                detail="of sessions"
              />
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-white/[0.05] pt-5">
              <HardDrive
                size={14}
                className="text-white/25"
                strokeWidth={1.5}
              />

              <span className="text-xs text-white/30">
                Median connection speed
              </span>

              <span className="ml-auto font-mono text-xs text-white/50">
                48.2 Mbps
              </span>
            </div>
          </section>

          {/* Full width status */}
          <section className="rounded-[24px] bg-[#131416] p-6 sm:p-7 xl:col-span-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <SectionLabel icon={Server}>
                  Streaming Infrastructure
                </SectionLabel>

                <div className="flex items-center gap-3">
                  <StatusDot />

                  <span className="text-sm text-white/65">
                    All playback services operational
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
                <InfrastructureMetric label="Origin" value="Online" />

                <InfrastructureMetric label="CDN" value="Online" />

                <InfrastructureMetric label="HLS" value="Healthy" />

                <InfrastructureMetric label="Manifests" value="Healthy" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function PlayIcon({ size = 13 }: { size?: number }) {
  return <Video size={size} strokeWidth={1.6} />;
}

function PlaybackStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 last:border-0 last:pb-0">
      <span className="text-xs text-white/30">{label}</span>

      <span className="font-mono text-xs text-white/55">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/20">
        {label}
      </div>

      <div className="mt-2 font-mono text-sm text-white/55">{value}</div>
    </div>
  );
}

function QualityRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "good" | "warning";
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        <StatusDot type={status === "good" ? "healthy" : "warning"} />

        <span className="text-xs text-white/40">{label}</span>
      </div>

      <span className="font-mono text-xs text-white/50">{value}</span>
    </div>
  );
}

function NetworkMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/20">
        {label}
      </div>

      <div className="mt-4 font-mori text-3xl tracking-[-0.05em] text-white/75">
        {value}
      </div>

      <div className="mt-1 text-[10px] text-white/20">{detail}</div>
    </div>
  );
}

function InfrastructureMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/20">
        {label}
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
        <StatusDot />
        {value}
      </div>
    </div>
  );
}

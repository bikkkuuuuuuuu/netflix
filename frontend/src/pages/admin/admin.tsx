import React from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Database,
  Film,
  HardDrive,
  Play,
  Server,
  Upload,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const viewingData = [
  31, 42, 38, 55, 49, 62, 58, 71, 66, 79, 74, 88, 81, 92, 86, 97, 91, 104, 96,
  112, 107, 119, 114, 126,
];

const topTitles = [
  { title: "Dune", views: "12.8K", change: "+18.4%" },
  { title: "Oppenheimer", views: "9.4K", change: "+11.2%" },
  { title: "Arrival", views: "7.2K", change: "+8.7%" },
  { title: "The Batman", views: "6.8K", change: "+5.3%" },
];

const published = [
  {
    title: "Dune",
    year: "2021",
    time: "18 min ago",
  },
  {
    title: "The Batman",
    year: "2022",
    time: "2 hours ago",
  },
  {
    title: "Arrival",
    year: "2016",
    time: "5 hours ago",
  },
  {
    title: "Oppenheimer",
    year: "2023",
    time: "Yesterday",
  },
];

const system = [
  { label: "API", value: "Healthy" },
  { label: "Redis", value: "Healthy" },
  { label: "Workers", value: "Healthy" },
  { label: "CDN", value: "Healthy" },
];

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  change,
  large = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  change?: string;
  large?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px]  bg-[#131416] p-6 ${
        large ? "min-h-[190px]" : "min-h-[170px]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
          <Icon size={18} strokeWidth={1.6} className="text-white/70" />
        </div>

        {change && <span className="text-xs text-white/40">{change}</span>}
      </div>

      <div className="mt-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
          {label}
        </p>

        <div className="mt-2 flex items-end gap-3">
          <span
            className={`font-mori font-medium tracking-[-0.04em] text-white ${
              large ? "text-5xl" : "text-4xl"
            }`}
          >
            {value}
          </span>
        </div>

        <p className="mt-2 text-sm text-white/40">{detail}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
      {children}
    </p>
  );
}

function StatusDot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />;
}

export default function Admin() {
  const width = 900;
  const height = 260;

  const max = Math.max(...viewingData);
  const min = Math.min(...viewingData);

  const points = viewingData
    .map((value, index) => {
      const x = (index / (viewingData.length - 1)) * width;
      const y = height - ((value - min) / (max - min)) * (height - 30) - 15;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <main
      className="min-h-screen w-full overflow-y-auto  text-white"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-6 ">
        {/* Header */}
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-mori text-4xl font-medium tracking-[-0.05em] md:text-6xl">
              Overview
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Everything happening across your streaming platform, from viewers
              and titles to processing and delivery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-11 rounded-xl border border-white/[0.07] bg-[#131416] px-4 text-sm text-white/65 transition hover:bg-white/[0.06]">
              Last 24 hours
            </button>

            <NavLink
              to="/upload"
              className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <Upload size={15} />
              Upload title
            </NavLink>
          </div>
        </header>

        {/* Primary metrics */}
        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Active viewers"
            value="24.8K"
            detail="Currently watching"
            change="+12.4%"
            large
          />

          <MetricCard
            icon={Film}
            label="Titles"
            value="184"
            detail="176 published"
            large
          />

          <MetricCard
            icon={Play}
            label="Playback success"
            value="99.94%"
            detail="Across all sessions"
            change="-0.02%"
            large
          />

          <MetricCard
            icon={Wifi}
            label="Delivery"
            value="2.4 TB"
            detail="Transferred today"
            change="+8.2%"
            large
          />
        </section>

        {/* Viewing activity */}
        <section className="mt-4 rounded-[28px]  bg-[#131416] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <SectionLabel>Viewing activity</SectionLabel>

              <div className="mt-3 flex items-end gap-3">
                <span className="font-mori text-4xl tracking-[-0.05em]">
                  126K
                </span>

                <span className="mb-1 text-xs text-white/35">plays today</span>
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs text-white/35">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Now</span>
            </div>
          </div>

          <div className="mt-8 h-[260px] w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <line
                x1="0"
                y1="60"
                x2={width}
                y2="60"
                stroke="rgba(255,255,255,0.05)"
              />

              <line
                x1="0"
                y1="130"
                x2={width}
                y2="130"
                stroke="rgba(255,255,255,0.05)"
              />

              <line
                x1="0"
                y1="200"
                x2={width}
                y2="200"
                stroke="rgba(255,255,255,0.05)"
              />

              <polyline
                points={points}
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </section>

        {/* Middle Bento */}
        <section className="mt-4 grid gap-4 xl:grid-cols-12">
          {/* Processing */}
          <div className="rounded-[24px]  bg-[#131416] p-6 xl:col-span-4">
            <div className="flex items-start justify-between">
              <div>
                <SectionLabel>Processing</SectionLabel>
                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Media pipeline
                </h2>
              </div>

              <Zap size={19} className="text-white/30" />
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl tracking-[-0.04em]">3</p>
                  <p className="mt-1 text-xs text-white/35">jobs running</p>
                </div>

                <Clock3 size={17} className="mb-1 text-white/25" />
              </div>

              <div className="h-px bg-white/[0.05]" />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xl">8</p>
                  <p className="mt-1 text-[11px] text-white/30">queued</p>
                </div>

                <div>
                  <p className="text-xl">0</p>
                  <p className="mt-1 text-[11px] text-white/30">failed</p>
                </div>

                <div>
                  <p className="text-xl">42</p>
                  <p className="mt-1 text-[11px] text-white/30">completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="rounded-[24px]  bg-[#131416] p-6 xl:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Recently published</SectionLabel>
                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Latest titles
                </h2>
              </div>

              <ArrowUpRight size={18} className="text-white/30" />
            </div>

            <div className="mt-7">
              {published.map((movie, index) => (
                <div
                  key={movie.title}
                  className={`flex items-center justify-between py-4 ${
                    index !== published.length - 1
                      ? "border-b border-white/[0.05]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04]">
                      <Film size={16} className="text-white/30" />
                    </div>

                    <div>
                      <p className="text-sm">{movie.title}</p>
                      <p className="mt-1 text-xs text-white/30">{movie.year}</p>
                    </div>
                  </div>

                  <span className="text-xs text-white/30">{movie.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System */}
          <div className="rounded-[24px]  bg-[#131416] p-6 xl:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>System</SectionLabel>
                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Infrastructure
                </h2>
              </div>

              <Server size={18} className="text-white/30" />
            </div>

            <div className="mt-7 space-y-5">
              {system.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <StatusDot />
                    <span className="text-sm text-white/65">{item.label}</span>
                  </div>

                  <span className="text-xs text-white/30">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom */}
        <section className="mt-4 grid gap-4 xl:grid-cols-12">
          {/* Top titles */}
          <div className="rounded-[24px]  bg-[#131416] p-6 xl:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Top titles</SectionLabel>
                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  What people are watching
                </h2>
              </div>

              <Play size={18} className="text-white/30" />
            </div>

            <div className="mt-7 space-y-5">
              {topTitles.map((item, index) => (
                <div key={item.title} className="flex items-center gap-4">
                  <span className="w-5 text-xs text-white/25">
                    0{index + 1}
                  </span>

                  <div className="h-10 w-10 rounded-lg bg-white/[0.04]" />

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-4">
                      <span className="truncate text-sm">{item.title}</span>

                      <span className="text-xs text-white/40">
                        {item.views}
                      </span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full bg-white/40"
                        style={{
                          width: `${100 - index * 17}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="hidden text-xs text-white/30 sm:block">
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Storage snapshot */}
          <div className="rounded-[24px]  bg-[#131416] p-6 xl:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Storage</SectionLabel>
                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Media footprint
                </h2>
              </div>

              <HardDrive size={18} className="text-white/30" />
            </div>

            <div className="mt-8 flex items-end justify-between">
              <div>
                <span className="font-mori text-5xl tracking-[-0.06em]">
                  2.8
                </span>
                <span className="ml-2 text-sm text-white/35">TB</span>
              </div>

              <span className="text-xs text-white/35">71% used</span>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="h-full rounded-full bg-white/60"
                style={{ width: "71%" }}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <p className="text-xl">1.9 TB</p>
                <p className="mt-1 text-xs text-white/30">HLS media</p>
              </div>

              <div>
                <p className="text-xl">780 GB</p>
                <p className="mt-1 text-xs text-white/30">Source files</p>
              </div>
            </div>

            <button className="mt-8 flex w-full items-center justify-between border-t border-white/[0.05] pt-5 text-sm text-white/50 transition hover:text-white">
              <span>Open storage</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

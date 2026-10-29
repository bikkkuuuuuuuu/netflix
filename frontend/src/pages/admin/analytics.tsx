import React, { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Download,
  Play,
  Tv,
  Users,
  Video,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

const topTitles = [
  {
    rank: "01",
    title: "Interstellar",
    hours: "184K",
    viewers: "28.4K",
    completion: 78,
  },
  {
    rank: "02",
    title: "Dune",
    hours: "161K",
    viewers: "24.8K",
    completion: 74,
  },
  {
    rank: "03",
    title: "Oppenheimer",
    hours: "148K",
    viewers: "21.7K",
    completion: 71,
  },
  {
    rank: "04",
    title: "The Batman",
    hours: "129K",
    viewers: "19.3K",
    completion: 68,
  },
  {
    rank: "05",
    title: "Arrival",
    hours: "104K",
    viewers: "16.8K",
    completion: 65,
  },
];

const completionTitles = [
  {
    title: "Interstellar",
    completion: 78,
  },
  {
    title: "Dune",
    completion: 74,
  },
  {
    title: "Oppenheimer",
    completion: 71,
  },
  {
    title: "The Batman",
    completion: 68,
  },
];

const devices = [
  {
    label: "TV",
    value: 42,
    icon: Tv,
  },
  {
    label: "Mobile",
    value: 31,
    icon: Smartphone,
  },
  {
    label: "Web",
    value: 19,
    icon: Monitor,
  },
  {
    label: "Tablet",
    value: 8,
    icon: Tablet,
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

function MetricCard({
  label,
  value,
  change,
  detail,
  icon: Icon,
  negative = false,
}: {
  label: string;
  value: string;
  change: string;
  detail: string;
  icon: React.ElementType;
  negative?: boolean;
}) {
  return (
    <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <SectionLabel icon={Icon}>{label}</SectionLabel>

        <div
          className={[
            "flex items-center gap-1 text-[11px]",
            negative ? "text-red-400" : "text-emerald-400",
          ].join(" ")}
        >
          {negative ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}

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

export default function AdminAnalytics() {
  const [range, setRange] = useState("Last 30 days");

  return (
    <div
      className="min-h-screen w-full overflow-y-auto  text-white"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <main className="mx-auto w-full max-w-[1600px] px-5 py-6 ">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
         

            <h1 className="font-mori text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              Analytics
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Understand what people are watching, where they are watching it,
              and how they experience your platform.
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
                className="h-11 appearance-none rounded-xl border border-white/[0.07] bg-[#131416] pl-4 pr-10 text-xs text-white/55 outline-none transition hover:bg-white/[0.04]"
              >
                <option>Today</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/25"
              />
            </div>
          </div>
        </header>

        {/* Main Bento */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Metrics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:col-span-12">
            <MetricCard
              label="Watch Time"
              value="1.82M"
              change="18.4%"
              detail="hours watched"
              icon={Clock3}
            />

            <MetricCard
              label="Unique Viewers"
              value="84.2K"
              change="12.7%"
              detail="people watched something"
              icon={Users}
            />

            <MetricCard
              label="Completion"
              value="72.8%"
              change="4.1%"
              detail="average title completion"
              icon={Play}
            />
          </div>

          {/* Watch time */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-8">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Clock3}>Watch Time</SectionLabel>

              <span className="text-xs text-white/25">{range}</span>
            </div>

            <div className="mb-5 flex items-end gap-3">
              <span className="font-mori text-4xl tracking-[-0.05em]">
                1.82M
              </span>

              <span className="pb-1 text-xs text-emerald-400">+18.4%</span>
            </div>

            <div className="relative h-[280px]">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[100, 75, 50, 25, 0].map((value) => (
                  <div key={value} className="flex items-center gap-3">
                    <span className="w-8 text-right text-[10px] text-white/15">
                      {value}
                    </span>

                    <div className="h-px flex-1 bg-white/[0.045]" />
                  </div>
                ))}
              </div>

              <svg
                viewBox="0 0 900 250"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-12 right-0 h-[250px] w-[calc(100%-48px)]"
              >
                <path
                  d="M0 214 C50 205, 70 190, 110 194 C150 198, 170 155, 210 166 C250 177, 270 137, 315 148 C360 160, 375 108, 420 122 C460 136, 490 94, 530 105 C575 118, 590 77, 635 91 C675 103, 710 55, 750 70 C795 86, 820 35, 900 42"
                  fill="none"
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="ml-11 flex justify-between text-[10px] uppercase tracking-[0.14em] text-white/15">
              <span>Sep 5</span>
              <span>Sep 12</span>
              <span>Sep 19</span>
              <span>Sep 26</span>
              <span>Oct 4</span>
            </div>
          </section>

          {/* Audience */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-4">
            <SectionLabel icon={Users}>Audience</SectionLabel>

            <div className="font-mori text-6xl font-medium tracking-[-0.07em]">
              84.2K
            </div>

            <p className="mt-3 text-xs text-white/25">
              unique viewers during {range.toLowerCase()}
            </p>

            <div className="mt-10 space-y-5">
              <AudienceMetric label="New viewers" value="24.8K" percent="29%" />

              <AudienceMetric label="Returning" value="59.4K" percent="71%" />
            </div>
          </section>

          {/* Top titles */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-7">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Video}>Top Titles</SectionLabel>

              <button className="flex items-center gap-1 text-xs text-white/25 transition hover:text-white">
                Full report
                <ChevronDown size={13} />
              </button>
            </div>

            <div>
              {topTitles.map((movie, index) => (
                <div
                  key={movie.title}
                  className={[
                    "grid grid-cols-[35px_minmax(140px,1fr)_100px_90px] items-center gap-4 py-4",
                    index !== topTitles.length - 1 &&
                      "border-b border-white/[0.05]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="font-mono text-[10px] text-white/20">
                    {movie.rank}
                  </span>

                  <div className="min-w-0">
                    <div className="truncate text-sm text-white/65">
                      {movie.title}
                    </div>

                    <div className="mt-1 text-[10px] text-white/20">
                      {movie.viewers} viewers
                    </div>
                  </div>

                  <span className="text-right font-mono text-xs text-white/40">
                    {movie.hours}
                  </span>

                  <div className="text-right">
                    <span className="text-xs text-white/45">
                      {movie.completion}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Device mix */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-5">
            <SectionLabel icon={Tv}>Device Mix</SectionLabel>

            <div className="space-y-6">
              {devices.map((device) => {
                const Icon = device.icon;

                return (
                  <div key={device.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          size={14}
                          strokeWidth={1.5}
                          className="text-white/30"
                        />

                        <span className="text-xs text-white/50">
                          {device.label}
                        </span>
                      </div>

                      <span className="font-mono text-xs text-white/35">
                        {device.value}%
                      </span>
                    </div>

                    <div className="h-[3px] bg-white/[0.06]">
                      <div
                        className="h-full bg-white/45"
                        style={{
                          width: `${device.value}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-9 border-t border-white/[0.05] pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/25">
                  Most common device
                </span>

                <span className="text-xs text-white/55">Smart TV</span>
              </div>
            </div>
          </section>

          {/* Completion */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-7">
            <div className="flex items-start justify-between">
              <SectionLabel icon={Play}>Completion</SectionLabel>

              <span className="font-mono text-xs text-white/25">
                avg. 72.8%
              </span>
            </div>

            <div className="space-y-5">
              {completionTitles.map((movie) => (
                <div
                  key={movie.title}
                  className="grid grid-cols-[150px_1fr_45px] items-center gap-4"
                >
                  <span className="truncate text-xs text-white/45">
                    {movie.title}
                  </span>

                  <div className="h-[3px] bg-white/[0.06]">
                    <div
                      className="h-full bg-white/45"
                      style={{
                        width: `${movie.completion}%`,
                      }}
                    />
                  </div>

                  <span className="text-right font-mono text-xs text-white/35">
                    {movie.completion}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Playback */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-5">
            <SectionLabel icon={Activity}>Playback</SectionLabel>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              <PlaybackMetric label="Startup" value="1.8s" />

              <PlaybackMetric label="Rebuffer" value="0.42%" />

              <PlaybackMetric label="Errors" value="0.08%" />

              <PlaybackMetric label="Availability" value="99.94%" />
            </div>
          </section>

          {/* Engagement */}
          <section className="rounded-[24px]  bg-[#131416] p-6 sm:p-7 xl:col-span-12">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <SectionLabel icon={Activity}>Engagement</SectionLabel>

                <div className="font-mori text-5xl tracking-[-0.06em]">
                  2h 18m
                </div>

                <p className="mt-2 text-xs text-white/25">
                  average viewing session
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <SmallMetric label="Starts" value="284K" />

                <SmallMetric label="Sessions" value="128K" />

                <SmallMetric label="Titles / session" value="2.4" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function AudienceMetric({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{label}</span>

        <span className="font-mono text-xs text-white/30">{value}</span>
      </div>

      <div className="mt-2 h-[3px] bg-white/[0.06]">
        <div
          className="h-full bg-white/40"
          style={{
            width: percent,
          }}
        />
      </div>
    </div>
  );
}

function PlaybackMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/20">
        {label}
      </div>

      <div className="mt-3 font-mono text-lg text-white/65">{value}</div>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-white/20">
        {label}
      </div>

      <div className="mt-2 font-mono text-sm text-white/55">{value}</div>
    </div>
  );
}

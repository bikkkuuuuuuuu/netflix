import React from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Database,
  FileVideo,
  HardDrive,
  Image,
  MoreHorizontal,
  Server,
  Trash2,
} from "lucide-react";

const storageBreakdown = [
  {
    label: "HLS renditions",
    size: "1.9 TB",
    percentage: 68,
  },
  {
    label: "Source videos",
    size: "780 GB",
    percentage: 28,
  },
  {
    label: "Artwork",
    size: "96 GB",
    percentage: 3,
  },
  {
    label: "Subtitles",
    size: "12 GB",
    percentage: 1,
  },
];

const largestTitles = [
  {
    title: "Dune",
    size: "184 GB",
    files: "2,841",
  },
  {
    title: "Oppenheimer",
    size: "161 GB",
    files: "2,604",
  },
  {
    title: "The Batman",
    size: "143 GB",
    files: "2,304",
  },
  {
    title: "Interstellar",
    size: "127 GB",
    files: "2,116",
  },
];

const storageActivity = [
  {
    title: "Dune HLS completed",
    detail: "+42.8 GB",
    time: "18 min ago",
    icon: FileVideo,
  },
  {
    title: "Arrival uploaded",
    detail: "+18.2 GB",
    time: "2 hours ago",
    icon: ArrowDownToLine,
  },
  {
    title: "Batman artwork updated",
    detail: "+240 MB",
    time: "5 hours ago",
    icon: Image,
  },
  {
    title: "Temporary files cleaned",
    detail: "-8.4 GB",
    time: "Yesterday",
    icon: Trash2,
  },
];

const mediaFiles = [
  {
    movie: "Dune",
    type: "HLS",
    size: "184 GB",
    files: "2,841",
    location: "movies/6ab97…/hls",
  },
  {
    movie: "Oppenheimer",
    type: "HLS",
    size: "161 GB",
    files: "2,604",
    location: "movies/91f23…/hls",
  },
  {
    movie: "The Batman",
    type: "Source",
    size: "48.6 GB",
    files: "1",
    location: "movies/7de12…/source",
  },
  {
    movie: "Arrival",
    type: "Source",
    size: "42.1 GB",
    files: "1",
    location: "movies/4b721…/source",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
      {children}
    </p>
  );
}

function StorageIcon({ type }: { type: string }) {
  if (type === "Source") {
    return <FileVideo size={15} />;
  }

  if (type === "Artwork") {
    return <Image size={15} />;
  }

  return <Database size={15} />;
}

export default function AdminStorage() {
  return (
    <main
      className="min-h-screen w-full overflow-y-auto text-white"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Header */}
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-mori text-4xl font-medium tracking-[-0.05em] md:text-6xl">
              Storage
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Monitor originals, HLS renditions, artwork and the storage
              footprint of your media library.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#131416] px-4 text-sm text-white/60 transition hover:bg-white/[0.05]">
              <Server size={15} />
              Storage settings
            </button>

            <button className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90">
              <ArrowUpRight size={15} />
              Manage media
            </button>
          </div>
        </header>

        {/* Hero storage cards */}
        <section className="mt-10 grid gap-4 xl:grid-cols-12">
          <div className="rounded-[28px]  bg-[#131416] p-7 md:p-8 xl:col-span-7">
            <div className="flex items-start justify-between">
              <div>
                <SectionLabel>Total storage</SectionLabel>

                <div className="mt-5 flex items-end gap-3">
                  <span className="font-mori text-6xl tracking-[-0.07em]">
                    2.8
                  </span>

                  <span className="mb-2 text-sm text-white/30">TB used</span>
                </div>

                <p className="mt-2 text-sm text-white/35">
                  Across source media, HLS, artwork and subtitles
                </p>
              </div>

              <HardDrive
                size={21}
                strokeWidth={1.5}
                className="text-white/30"
              />
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between text-xs text-white/35">
                <span>2.8 TB used</span>
                <span>8.7 TB capacity</span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-white/60"
                  style={{ width: "71%" }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px]  bg-[#131416] p-7 md:p-8 xl:col-span-5">
            <SectionLabel>Disk utilization</SectionLabel>

            <div className="mt-5 flex items-end gap-3">
              <span className="font-mori text-6xl tracking-[-0.07em]">71%</span>

              <span className="mb-2 text-sm text-white/30">capacity used</span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-2xl">5.9 TB</p>
                <p className="mt-1 text-xs text-white/30">available</p>
              </div>

              <div>
                <p className="text-2xl">+184 GB</p>
                <p className="mt-1 text-xs text-white/30">this month</p>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-xs text-white/35">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Storage healthy
            </div>
          </div>
        </section>

        {/* Breakdown */}
        <section className="mt-4 rounded-[28px]  bg-[#131416] p-7 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <SectionLabel>Storage breakdown</SectionLabel>

              <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                Where your space goes
              </h2>
            </div>

            <Database size={19} className="text-white/25" />
          </div>

          <div className="mt-9 space-y-7">
            {storageBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-white/70">{item.label}</p>

                    <p className="mt-1 text-xs text-white/30">
                      {item.percentage}% of storage
                    </p>
                  </div>

                  <p className="text-sm text-white/55">{item.size}</p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-white/45"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento middle */}
        <section className="mt-4 grid gap-4 xl:grid-cols-12">
          {/* Largest */}
          <div className="rounded-[24px]  bg-[#131416] p-6 xl:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Largest titles</SectionLabel>

                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Biggest media footprints
                </h2>
              </div>

              <MoreHorizontal size={18} className="text-white/25" />
            </div>

            <div className="mt-7 space-y-5">
              {largestTitles.map((item, index) => (
                <div key={item.title} className="flex items-center gap-4">
                  <span className="w-5 text-xs text-white/25">
                    0{index + 1}
                  </span>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                    <FileVideo size={16} className="text-white/30" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.title}</p>

                    <p className="mt-1 text-xs text-white/30">
                      {item.files} files
                    </p>
                  </div>

                  <span className="text-sm text-white/50">{item.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-[24px]  bg-[#131416] p-6 xl:col-span-7">
            <div>
              <SectionLabel>Recent storage activity</SectionLabel>

              <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                Media movement
              </h2>
            </div>

            <div className="mt-7 grid gap-x-8 md:grid-cols-2">
              {storageActivity.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-4 border-b border-white/[0.05] py-5 first:pt-0 md:[&:nth-child(2)]:pt-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                      <Icon size={15} className="text-white/35" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white/70">{item.title}</p>

                      <div className="mt-2 flex items-center justify-between gap-4">
                        <span className="text-xs text-white/30">
                          {item.time}
                        </span>

                        <span className="text-xs text-white/45">
                          {item.detail}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Media files */}
        <section className="mt-4 overflow-hidden rounded-[28px]  bg-[#131416]">
          <div className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-end md:p-8">
            <div>
              <SectionLabel>Media files</SectionLabel>

              <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                Storage inventory
              </h2>

              <p className="mt-2 text-sm text-white/35">
                Browse the physical media currently stored by your platform.
              </p>
            </div>

            <button className="flex items-center gap-2 text-sm text-white/40 transition hover:text-white">
              View all
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-y border-white/[0.05] text-left">
                  <th className="px-8 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Movie
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Type
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Size
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Files
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Location
                  </th>

                  <th className="px-8 py-4" />
                </tr>
              </thead>

              <tbody>
                {mediaFiles.map((file) => (
                  <tr
                    key={`${file.movie}-${file.type}`}
                    className="border-b border-white/[0.05] last:border-0"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                          <StorageIcon type={file.type} />
                        </div>

                        <span className="text-sm">{file.movie}</span>
                      </div>
                    </td>

                    <td className="px-4 py-5 text-sm text-white/45">
                      {file.type}
                    </td>

                    <td className="px-4 py-5 text-sm text-white/60">
                      {file.size}
                    </td>

                    <td className="px-4 py-5 text-sm text-white/40">
                      {file.files}
                    </td>

                    <td className="px-4 py-5 font-mono text-xs text-white/25">
                      {file.location}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <button className="text-white/25 transition hover:text-white">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Storage architecture */}
        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px]  bg-[#131416] p-6">
            <FileVideo size={18} className="text-white/30" />

            <SectionLabel>Originals</SectionLabel>

            <p className="mt-3 text-2xl tracking-[-0.04em]">780 GB</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Original uploaded source files retained for reprocessing and
              archival.
            </p>
          </div>

          <div className="rounded-[24px]  bg-[#131416] p-6">
            <Database size={18} className="text-white/30" />

            <SectionLabel>HLS media</SectionLabel>

            <p className="mt-3 text-2xl tracking-[-0.04em]">1.9 TB</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Segments and playlists generated by the transcoding workers.
            </p>
          </div>

          <div className="rounded-[24px]  bg-[#131416] p-6">
            <Server size={18} className="text-white/30" />

            <SectionLabel>Delivery</SectionLabel>

            <p className="mt-3 text-2xl tracking-[-0.04em]">94.8%</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              CDN cache hit ratio reducing requests reaching the origin.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

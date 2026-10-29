import React from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Ban,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Edit3,
  Globe2,
  Laptop,
  LogOut,
  Mail,
  Monitor,
  MoreHorizontal,
  Play,
  Smartphone,
  ShieldCheck,
  Trash2,
  Tv,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";

const watchHistory = [
  {
    title: "Dune",
    year: "2021",
    progress: 86,
    duration: "1h 42m",
    watched: "Today, 8:42 PM",
  },
  {
    title: "Oppenheimer",
    year: "2023",
    progress: 64,
    duration: "2h 11m",
    watched: "Yesterday",
  },
  {
    title: "Arrival",
    year: "2016",
    progress: 100,
    duration: "1h 52m",
    watched: "Sep 29",
  },
  {
    title: "The Batman",
    year: "2022",
    progress: 38,
    duration: "52m",
    watched: "Sep 27",
  },
];

const devices = [
  {
    name: "MacBook Pro",
    detail: "Chrome · macOS",
    location: "Kathmandu, Nepal",
    lastActive: "Current device",
    icon: Laptop,
    current: true,
  },
  {
    name: "iPhone 16",
    detail: "Netflix · iOS",
    location: "Kathmandu, Nepal",
    lastActive: "2 hours ago",
    icon: Smartphone,
    current: false,
  },
  {
    name: "Samsung TV",
    detail: "Netflix · Tizen",
    location: "Kathmandu, Nepal",
    lastActive: "Yesterday",
    icon: Tv,
    current: false,
  },
];

const sessions = [
  {
    device: "Chrome / macOS",
    location: "Kathmandu, Nepal",
    ip: "103.69.xx.xx",
    status: "Active",
    time: "Now",
  },
  {
    device: "Netflix / iOS",
    location: "Kathmandu, Nepal",
    ip: "103.69.xx.xx",
    status: "Ended",
    time: "2h ago",
  },
  {
    device: "Netflix / Tizen",
    location: "Kathmandu, Nepal",
    ip: "103.69.xx.xx",
    status: "Ended",
    time: "Yesterday",
  },
];

const activities = [
  {
    title: "Started watching Dune",
    detail: "Playback session started",
    time: "8:42 PM",
    icon: Play,
  },
  {
    title: "Signed in",
    detail: "Chrome on macOS",
    time: "8:39 PM",
    icon: LogOut,
  },
  {
    title: "Device added",
    detail: "MacBook Pro",
    time: "8:38 PM",
    icon: Laptop,
  },
  {
    title: "Password changed",
    detail: "Account security",
    time: "Sep 28",
    icon: ShieldCheck,
  },
  {
    title: "Subscription renewed",
    detail: "Premium plan",
    time: "Sep 18",
    icon: CreditCard,
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
      {children}
    </p>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[24px]  bg-[#131416] p-6 md:p-7 ${className}`}>
      {children}
    </section>
  );
}

function DeviceIcon({ type }: { type: "laptop" | "phone" | "tv" }) {
  const Icon = type === "laptop" ? Laptop : type === "phone" ? Smartphone : Tv;

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04]">
      <Icon size={17} className="text-white/50" />
    </div>
  );
}

export default function AdminUserDetail() {
  return (
    <main className="min-h-screen w-full overflow-y-auto  text-white">
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Top navigation */}

        {/* User header */}
        <header className=" flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] bg-white/[0.06] text-xl text-white/60">
              AM
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-mori text-4xl font-medium tracking-[-0.05em] md:text-5xl">
                  Alex Morgan
                </h1>

                <div className="flex items-center gap-2 text-xs text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </div>
              </div>

              <p className="mt-2 text-sm text-white/35">
                alex.morgan@example.com
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/30">
                <span>Premium member</span>
                <span>Joined Sep 18, 2026</span>
                <span>18h 42m watched</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#131416] px-4 text-sm text-white/55 transition hover:bg-white/[0.05] hover:text-white">
              <Edit3 size={15} />
              Edit user
            </button>

            <button className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.07] px-4 text-sm text-white/55 transition hover:bg-white/[0.05] hover:text-white">
              <Ban size={15} />
              Suspend
            </button>
          </div>
        </header>

        {/* Profile + subscription */}
        <section className="mt-10 grid gap-4 xl:grid-cols-12">
          {/* Profile */}
          <Card className="xl:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Profile</SectionLabel>

                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Account information
                </h2>
              </div>

              <User size={18} className="text-white/25" />
            </div>

            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              <div>
                <p className="text-xs text-white/30">Full name</p>
                <p className="mt-2 text-sm text-white/70">Alex Morgan</p>
              </div>

              <div>
                <p className="text-xs text-white/30">Email</p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-sm text-white/70">
                    alex.morgan@example.com
                  </p>

                  <Check size={14} className="text-emerald-400" />
                </div>
              </div>

              <div>
                <p className="text-xs text-white/30">Phone number</p>

                <p className="mt-2 text-sm text-white/70">+1 555 018 2940</p>
              </div>

              <div>
                <p className="text-xs text-white/30">Member since</p>

                <p className="mt-2 text-sm text-white/70">September 18, 2026</p>
              </div>

              <div>
                <p className="text-xs text-white/30">Country</p>

                <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                  <Globe2 size={14} className="text-white/25" />
                  Nepal
                </div>
              </div>

              <div>
                <p className="text-xs text-white/30">Account ID</p>

                <p className="mt-2 font-mono text-xs text-white/45">
                  usr_01H8M2X7Q9
                </p>
              </div>
            </div>
          </Card>

          {/* Subscription */}
          <Card className="xl:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Subscription</SectionLabel>

                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Premium
                </h2>
              </div>

              <CreditCard size={18} className="text-white/25" />
            </div>

            <div className="mt-8">
              <div className="flex items-end gap-2">
                <span className="font-mori text-4xl tracking-[-0.05em]">
                  $19.99
                </span>

                <span className="mb-1 text-xs text-white/30">/ month</span>
              </div>

              <p className="mt-2 text-xs text-white/35">
                Renews October 18, 2026
              </p>
            </div>

            <div className="mt-7 space-y-4 border-t border-white/[0.05] pt-6">
              <div className="flex justify-between">
                <span className="text-xs text-white/30">Payment method</span>

                <span className="text-xs text-white/55">Visa •••• 4242</span>
              </div>

              <div className="flex justify-between">
                <span className="text-xs text-white/30">Billing status</span>

                <span className="flex items-center gap-2 text-xs text-white/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Paid
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-xs text-white/30">Started</span>

                <span className="text-xs text-white/55">Sep 18, 2026</span>
              </div>
            </div>

            <button className="mt-7 flex items-center gap-2 text-sm text-white/40 transition hover:text-white">
              Manage subscription
              <ArrowUpRight size={14} />
            </button>
          </Card>
        </section>

        {/* Watch history */}
        <Card className="mt-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <SectionLabel>Watch history</SectionLabel>

              <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                Recently watched
              </h2>
            </div>

            <button className="flex items-center gap-2 text-sm text-white/35 transition hover:text-white">
              View complete history
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="mt-7 overflow-x-auto">
            <div className="min-w-[760px]">
              {watchHistory.map((movie, index) => (
                <div
                  key={movie.title}
                  className={`grid grid-cols-[minmax(220px,1fr)_130px_100px_150px] items-center gap-4 py-5 ${
                    index !== watchHistory.length - 1
                      ? "border-b border-white/[0.05]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                      <FilmPlaceholder />
                    </div>

                    <div>
                      <p className="text-sm text-white/75">{movie.title}</p>

                      <p className="mt-1 text-xs text-white/30">
                        {movie.year} · {movie.duration}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-white/30">
                      <span>Progress</span>
                      <span>{movie.progress}%</span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full bg-white/50"
                        style={{
                          width: `${movie.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-white/35">
                    {movie.progress === 100 ? "Completed" : "In progress"}
                  </div>

                  <div className="text-right text-xs text-white/30">
                    {movie.watched}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Devices + sessions */}
        <section className="mt-4 grid gap-4 xl:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Devices</SectionLabel>

                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Registered devices
                </h2>
              </div>

              <Monitor size={18} className="text-white/25" />
            </div>

            <div className="mt-7">
              {devices.map((device, index) => {
                const Icon = device.icon;

                return (
                  <div
                    key={device.name}
                    className={`flex items-center gap-4 py-5 ${
                      index !== devices.length - 1
                        ? "border-b border-white/[0.05]"
                        : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04]">
                      <Icon size={17} className="text-white/45" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-white/70">{device.name}</p>

                        {device.current && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}
                      </div>

                      <p className="mt-1 text-xs text-white/30">
                        {device.detail}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-white/45">
                        {device.lastActive}
                      </p>

                      <p className="mt-1 text-[11px] text-white/25">
                        {device.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Sessions</SectionLabel>

                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Recent sign-ins
                </h2>
              </div>

              <ShieldCheck size={18} className="text-white/25" />
            </div>

            <div className="mt-7">
              {sessions.map((session, index) => (
                <div
                  key={`${session.device}-${session.time}`}
                  className={`flex items-center gap-4 py-5 ${
                    index !== sessions.length - 1
                      ? "border-b border-white/[0.05]"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                    <Globe2 size={16} className="text-white/40" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white/65">{session.device}</p>

                    <p className="mt-1 text-xs text-white/30">
                      {session.location}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {session.status === "Active" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}

                      <span className="text-xs text-white/45">
                        {session.status}
                      </span>
                    </div>

                    <p className="mt-1 font-mono text-[10px] text-white/20">
                      {session.ip}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-5 flex items-center gap-2 text-sm text-white/35 transition hover:text-white">
              Revoke all sessions
              <LogOut size={14} />
            </button>
          </Card>
        </section>

        {/* Activity + security */}
        <section className="mt-4 grid gap-4 xl:grid-cols-7">
          <Card className="xl:col-span-4">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel>Activity</SectionLabel>

                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  Account timeline
                </h2>
              </div>

              <Clock3 size={18} className="text-white/25" />
            </div>

            <div className="mt-8">
              {activities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={`${activity.title}-${activity.time}`}
                    className="relative flex gap-4 pb-7"
                  >
                    {index !== activities.length - 1 && (
                      <div className="absolute left-[17px] top-9 h-full w-px bg-white/[0.06]" />
                    )}

                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full  bg-[#131416]">
                      <Icon size={14} className="text-white/40" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-white/65">
                            {activity.title}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            {activity.detail}
                          </p>
                        </div>

                        <span className="shrink-0 text-[11px] text-white/25">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="xl:col-span-3">
            <div>
              <SectionLabel>Account security</SectionLabel>

              <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                Security
              </h2>
            </div>

            <div className="mt-8 space-y-5">
              <SecurityRow label="Email" value="Verified" icon={Mail} />

              <SecurityRow
                label="Password"
                value="Changed Sep 28"
                icon={ShieldCheck}
              />

              <SecurityRow
                label="Two-factor auth"
                value="Enabled"
                icon={ShieldCheck}
              />

              <SecurityRow label="Active sessions" value="1" icon={Users} />
            </div>
          </Card>
        </section>

        {/* Danger zone */}
        <section className="mt-4 rounded-[24px]  bg-[#131416] p-6 md:p-7">
          <SectionLabel>Account actions</SectionLabel>

          <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
            Manage account
          </h2>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <ActionButton
              icon={Ban}
              title="Suspend account"
              description="Prevent this account from signing in."
            />

            <ActionButton
              icon={LogOut}
              title="Revoke sessions"
              description="Sign the user out from every device."
            />

            <ActionButton
              icon={Trash2}
              title="Delete account"
              description="Permanently remove this user account."
              destructive
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function SecurityRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
        <Icon size={15} className="text-white/35" />
      </div>

      <div className="flex-1">
        <p className="text-sm text-white/60">{label}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="text-xs text-white/35">{value}</span>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  description,
  destructive = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  destructive?: boolean;
}) {
  return (
    <button
      className={`group flex items-start gap-4 rounded-xl border p-4 text-left transition ${
        destructive
          ? "border-white/[0.06] hover:border-red-400/20 hover:bg-red-400/[0.03]"
          : "border-white/[0.06] hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
        <Icon
          size={15}
          className={destructive ? "text-red-400/60" : "text-white/35"}
        />
      </div>

      <div className="min-w-0">
        <p
          className={`text-sm ${
            destructive ? "text-red-400/80" : "text-white/65"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/25">{description}</p>
      </div>

      <ChevronRight
        size={15}
        className="ml-auto mt-1 shrink-0 text-white/15 transition group-hover:text-white/40"
      />
    </button>
  );
}

function FilmPlaceholder() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-white/[0.04]" />

      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
    </div>
  );
}

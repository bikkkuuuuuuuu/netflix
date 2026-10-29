import React, { useMemo, useState } from "react";
import {
  Ban,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Shield,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Clock3,
  Eye,
} from "lucide-react";

type UserStatus = "Active" | "Suspended" | "Pending";
type UserRole = "User" | "Admin" | "Moderator";
type UserPlan = "Free" | "Standard" | "Premium";

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: UserRole;
  plan: UserPlan;
  status: UserStatus;
  lastActive: string;
  joined: string;
  watchTime: string;
  devices: number;
}

const users: User[] = [
  {
    id: "usr_001",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    initials: "AM",
    role: "User",
    plan: "Premium",
    status: "Active",
    lastActive: "4 min ago",
    joined: "Sep 18, 2026",
    watchTime: "18h 42m",
    devices: 3,
  },
  {
    id: "usr_002",
    name: "Bikash Pandey",
    email: "bikash@example.com",
    initials: "BP",
    role: "Admin",
    plan: "Premium",
    status: "Active",
    lastActive: "12 min ago",
    joined: "Aug 02, 2026",
    watchTime: "31h 18m",
    devices: 4,
  },
  {
    id: "usr_003",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    initials: "SC",
    role: "User",
    plan: "Standard",
    status: "Active",
    lastActive: "2 days ago",
    joined: "Jul 21, 2026",
    watchTime: "12h 09m",
    devices: 2,
  },
  {
    id: "usr_004",
    name: "Daniel Kim",
    email: "daniel.kim@example.com",
    initials: "DK",
    role: "User",
    plan: "Premium",
    status: "Suspended",
    lastActive: "8 days ago",
    joined: "Jun 12, 2026",
    watchTime: "42h 11m",
    devices: 5,
  },
  {
    id: "usr_005",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    initials: "EW",
    role: "User",
    plan: "Free",
    status: "Active",
    lastActive: "1 hour ago",
    joined: "Sep 27, 2026",
    watchTime: "3h 21m",
    devices: 1,
  },
  {
    id: "usr_006",
    name: "Noah Williams",
    email: "noah.williams@example.com",
    initials: "NW",
    role: "Moderator",
    plan: "Premium",
    status: "Active",
    lastActive: "26 min ago",
    joined: "May 04, 2026",
    watchTime: "22h 48m",
    devices: 3,
  },
  {
    id: "usr_007",
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    initials: "OB",
    role: "User",
    plan: "Standard",
    status: "Pending",
    lastActive: "Never",
    joined: "Oct 02, 2026",
    watchTime: "0h 00m",
    devices: 0,
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
      {children}
    </p>
  );
}

function StatusIndicator({ status }: { status: UserStatus }) {
  const isActive = status === "Active";
  const isPending = status === "Pending";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive
            ? "bg-emerald-400"
            : isPending
              ? "bg-amber-400"
              : "bg-white/20"
        }`}
      />

      <span className="text-xs text-white/50">{status}</span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  change,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  change?: string;
}) {
  return (
    <div className="min-h-[175px] rounded-[24px]  bg-[#131416] p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
          <Icon size={18} strokeWidth={1.6} className="text-white/60" />
        </div>

        {change && <span className="text-xs text-white/30">{change}</span>}
      </div>

      <div className="mt-8">
        <SectionLabel>{label}</SectionLabel>

        <div className="mt-2 flex items-end gap-3">
          <span className="font-mori text-4xl tracking-[-0.05em]">{value}</span>
        </div>

        <p className="mt-2 text-xs text-white/35">{detail}</p>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | UserStatus>("All");
  const [role, setRole] = useState<"All" | UserRole>("All");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesStatus = status === "All" || user.status === status;

      const matchesRole = role === "All" || user.role === role;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [search, status, role]);

  const allVisibleSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selectedUsers.includes(user.id));

  function toggleUser(id: string) {
    setSelectedUsers((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleAll() {
    if (allVisibleSelected) {
      setSelectedUsers((current) =>
        current.filter((id) => !filteredUsers.some((user) => user.id === id)),
      );
      return;
    }

    setSelectedUsers((current) => [
      ...new Set([...current, ...filteredUsers.map((user) => user.id)]),
    ]);
  }

  return (
    <main
      className="min-h-screen w-full overflow-y-auto  text-white"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Header */}
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-mori text-4xl font-medium tracking-[-0.05em] md:text-6xl">
              Users
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage accounts, roles, subscriptions and access across your
              platform.
            </p>
          </div>

          <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90">
            <UserPlus size={15} />
            Add user
          </button>
        </header>

        {/* Stats */}
        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total users"
            value="18,492"
            detail="Registered accounts"
            change="+8.4%"
          />

          <StatCard
            icon={UserCheck}
            label="Active this month"
            value="17,906"
            detail="96.8% of all users"
          />

          <StatCard
            icon={UserPlus}
            label="New this month"
            value="426"
            detail="Compared with 381 last month"
            change="+12.1%"
          />

          <StatCard
            icon={Shield}
            label="Staff accounts"
            value="160"
            detail="Admins and moderators"
          />
        </section>

        {/* User management */}
        <section className="mt-4 overflow-hidden rounded-[28px]  bg-[#131416]">
          {/* Toolbar */}
          <div className="border-b border-white/[0.06] p-6 md:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <SectionLabel>Account directory</SectionLabel>

                <h2 className="mt-3 font-mori text-2xl tracking-[-0.04em]">
                  All users
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search users..."
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#0e0f11] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/[0.14] sm:w-[260px]"
                  />
                </div>

                {/* Status */}
                <div className="relative">
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as "All" | UserStatus)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.07] bg-[#0e0f11] px-4 pr-10 text-sm text-white/60 outline-none sm:w-[150px]"
                  >
                    <option value="All">All status</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                  />
                </div>

                {/* Role */}
                <div className="relative">
                  <select
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as "All" | UserRole)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.07] bg-[#0e0f11] px-4 pr-10 text-sm text-white/60 outline-none sm:w-[145px]"
                  >
                    <option value="All">All roles</option>
                    <option value="User">Users</option>
                    <option value="Moderator">Moderators</option>
                    <option value="Admin">Admins</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                  />
                </div>
              </div>
            </div>

            {/* Bulk controls */}
            {selectedUsers.length > 0 && (
              <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-5">
                <span className="text-sm text-white/45">
                  {selectedUsers.length} users selected
                </span>

                <div className="flex gap-2">
                  <button className="h-9 rounded-lg border border-white/[0.07] px-3 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white">
                    Change role
                  </button>

                  <button className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] px-3 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white">
                    <Ban size={13} />
                    Suspend
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-white/[0.05] text-left">
                  <th className="w-14 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 accent-white"
                    />
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    User
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Role
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Plan
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Last active
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Joined
                  </th>

                  <th className="px-4 py-4 text-[10px] font-normal uppercase tracking-[0.18em] text-white/25">
                    Status
                  </th>

                  <th className="w-14 px-6 py-4" />
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/[0.05] transition hover:bg-white/[0.015]"
                  >
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                        className="h-4 w-4 accent-white"
                      />
                    </td>

                    {/* User */}
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xs text-white/60">
                          {user.initials}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm text-white/80">
                            {user.name}
                          </p>

                          <p className="mt-1 truncate text-xs text-white/30">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-5">
                      <span className="text-sm text-white/50">{user.role}</span>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-5">
                      <span className="text-sm text-white/50">{user.plan}</span>
                    </td>

                    {/* Last active */}
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <Clock3 size={13} className="text-white/20" />

                        <span className="text-sm text-white/45">
                          {user.lastActive}
                        </span>
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-5 text-sm text-white/35">
                      {user.joined}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-5">
                      <StatusIndicator status={user.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.05] hover:text-white">
                        <MoreHorizontal size={17} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <UserX size={24} className="mx-auto text-white/20" />

                      <p className="mt-4 text-sm text-white/50">
                        No users found
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col justify-between gap-4 border-t border-white/[0.05] px-6 py-5 sm:flex-row sm:items-center">
            <p className="text-xs text-white/30">
              Showing{" "}
              <span className="text-white/50">1–{filteredUsers.length}</span> of
              18,492 users
            </p>

            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg  text-white/25 transition hover:bg-white/[0.04] hover:text-white">
                <ChevronLeft size={15} />
              </button>

              <button className="h-9 min-w-9 rounded-lg bg-white px-3 text-xs font-medium text-black">
                1
              </button>

              <button className="h-9 min-w-9 rounded-lg  px-3 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white">
                2
              </button>

              <button className="h-9 min-w-9 rounded-lg  px-3 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white">
                3
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-lg  text-white/25 transition hover:bg-white/[0.04] hover:text-white">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Secondary overview */}
        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px]  bg-[#131416] p-6">
            <Eye size={18} className="text-white/30" />

            <SectionLabel>Watching now</SectionLabel>

            <p className="mt-3 font-mori text-3xl tracking-[-0.05em]">24.8K</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Users currently streaming content across all devices.
            </p>
          </div>

          <div className="rounded-[24px]  bg-[#131416] p-6">
            <UserCheck size={18} className="text-white/30" />

            <SectionLabel>Verified accounts</SectionLabel>

            <p className="mt-3 font-mori text-3xl tracking-[-0.05em]">17,284</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Accounts with verified email addresses.
            </p>
          </div>

          <div className="rounded-[24px]  bg-[#131416] p-6">
            <Ban size={18} className="text-white/30" />

            <SectionLabel>Suspended accounts</SectionLabel>

            <p className="mt-3 font-mori text-3xl tracking-[-0.05em]">3</p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Accounts currently restricted from accessing the platform.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

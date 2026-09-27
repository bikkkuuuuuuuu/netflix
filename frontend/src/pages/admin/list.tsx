import { useState, useMemo } from "react";
import {
  Film,
  Plus,
  Trash2,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Edit3,
  Eye,
  Server,
  ArrowUpDown,
  Flame,
  CheckSquare,
  Square,
  Database,
} from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  type: "Movie" | "TV Show";
  year: string;
  genre: string[];
  status: "Published" | "Draft" | "Scheduled" | "Archived";
  rating: string;
  views: string;
  isFeatured: boolean;
  poster: string;
  size: string;
  updatedAt: string;
}

interface ActivityItem {
  id: string;
  title: string;
  action: string;
  time: string;
  status: "success" | "pending";
}

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "m-1",
    title: "Dune: Part Two",
    type: "Movie",
    year: "2024",
    genre: ["Sci-Fi", "Adventure"],
    status: "Published",
    rating: "8.6",
    views: "1.4M",
    isFeatured: true,
    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop",
    size: "18.4 GB",
    updatedAt: "2 hours ago",
  },
  {
    id: "m-2",
    title: "Severance Season 2",
    type: "TV Show",
    year: "2025",
    genre: ["Sci-Fi", "Thriller"],
    status: "Draft",
    rating: "8.7",
    views: "890K",
    isFeatured: true,
    poster:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop",
    size: "42.0 GB",
    updatedAt: "30 mins ago",
  },
  {
    id: "m-3",
    title: "Blade Runner 2049",
    type: "Movie",
    year: "2017",
    genre: ["Sci-Fi", "Drama"],
    status: "Published",
    rating: "8.0",
    views: "3.1M",
    isFeatured: false,
    poster:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300&auto=format&fit=crop",
    size: "14.2 GB",
    updatedAt: "1 day ago",
  },
  {
    id: "m-4",
    title: "Cyberpunk: Edgerunners S2",
    type: "TV Show",
    year: "2026",
    genre: ["Animation", "Action"],
    status: "Scheduled",
    rating: "8.3",
    views: "420K",
    isFeatured: false,
    poster:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=300&auto=format&fit=crop",
    size: "12.8 GB",
    updatedAt: "3 days ago",
  },
  {
    id: "m-5",
    title: "The Batman: Part II",
    type: "Movie",
    year: "2026",
    genre: ["Action", "Crime"],
    status: "Draft",
    rating: "8.5",
    views: "110K",
    isFeatured: false,
    poster:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&auto=format&fit=crop",
    size: "22.1 GB",
    updatedAt: "5 hours ago",
  },
  {
    id: "m-6",
    title: "Interstellar Extended Edition",
    type: "Movie",
    year: "2014",
    genre: ["Sci-Fi", "Drama"],
    status: "Archived",
    rating: "8.7",
    views: "5.2M",
    isFeatured: false,
    poster:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop",
    size: "35.0 GB",
    updatedAt: "2 weeks ago",
  },
];

export default function AdminList() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [notification, setNotification] = useState<string | null>(null);

  // Filters & Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Published" | "Draft" | "Scheduled" | "Archived"
  >("All");
  const [sortBy, setSortBy] = useState<"newest" | "rating" | "views">("newest");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals / Drawers
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Activity Feed
  const [activity, setActivity] = useState<ActivityItem[]>([
    {
      id: "a-1",
      title: "Dune: Part Two",
      action: "Published to Catalog",
      time: "10 mins ago",
      status: "success",
    },
    {
      id: "a-2",
      title: "Severance Season 2",
      action: "Transcoding 4K Stream",
      time: "25 mins ago",
      status: "pending",
    },
    {
      id: "a-3",
      title: "Blade Runner 2049",
      action: "Metadata Updated",
      time: "1 hour ago",
      status: "success",
    },
  ]);

  // Toast Helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredList = useMemo(() => {
    return mediaList
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.genre.some((g) =>
            g.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "rating")
          return parseFloat(b.rating) - parseFloat(a.rating);
        if (sortBy === "views")
          return parseFloat(b.views) - parseFloat(a.views);
        return 0; // Default order
      });
  }, [mediaList, searchQuery, statusFilter, sortBy]);

  // Bulk Actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkPublish = () => {
    setMediaList((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: "Published" } : item,
      ),
    );
    showToast(`Published ${selectedIds.length} titles`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setMediaList((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id)),
    );
    showToast(`Deleted ${selectedIds.length} items`);
    setSelectedIds([]);
  };

  const toggleFeatured = (id: string) => {
    setMediaList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFeatured: !item.isFeatured } : item,
      ),
    );
    showToast("Hero banner updated");
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pr-1">
      {/* TOP SECTION: MEDIA MANAGEMENT GRID (9 COLS) + RIGHT LIGHT SUMMARY (3 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT (9 COLS): MEDIA TABLE & LIST FILTER MANAGER */}
        <div className="lg:col-span-9 bg-[#121316] rounded-[30px] p-5 shadow-xl border border-white/5 flex flex-col justify-between min-h-[460px]">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" />
                <span>Catalog Media Inventory</span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Manage streaming content, status states, and feature flags
              </p>
            </div>

            {/* Live Search & Sorting */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search title, genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1c23] text-xs font-semibold text-white placeholder-neutral-500 pl-8 pr-3 py-2 rounded-xl border border-white/5 outline-none focus:border-red-500/50"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#1a1c23] p-1 rounded-xl border border-white/5">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 ml-2" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-neutral-300 pr-2 py-1 outline-none cursor-pointer"
                >
                  <option value="newest" className="bg-[#1a1c23]">
                    Newest
                  </option>
                  <option value="rating" className="bg-[#1a1c23]">
                    Rating
                  </option>
                  <option value="views" className="bg-[#1a1c23]">
                    Views
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Filter Tabs & Bulk Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-white/5">
            <div className="flex items-center gap-1 bg-[#1a1c23] p-1 rounded-xl border border-white/5">
              {(
                ["All", "Published", "Draft", "Scheduled", "Archived"] as const
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === tab
                      ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Bulk Controls */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in">
                <span className="text-xs text-neutral-400 font-semibold">
                  {selectedIds.length} Selected
                </span>
                <button
                  onClick={handleBulkPublish}
                  className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold rounded-lg transition-colors"
                >
                  Publish
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 text-xs font-bold rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Media Table */}
          <div className="overflow-x-auto my-2 max-h-[320px] overflow-y-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider border-b border-white/5 pb-2">
                  <th className="py-2.5 px-3">
                    <button
                      onClick={toggleSelectAll}
                      className="text-neutral-400 hover:text-white"
                    >
                      {selectedIds.length > 0 &&
                      selectedIds.length === filteredList.length ? (
                        <CheckSquare className="w-4 h-4 text-red-500" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-2">Media Title</th>
                  <th className="py-2.5 px-2">Type</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">Rating</th>
                  <th className="py-2.5 px-2">Views</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredList.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/[0.02] transition-colors group ${
                        isSelected ? "bg-red-950/20" : ""
                      }`}
                    >
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleSelectItem(item.id)}
                          className="text-neutral-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-red-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-9 h-11 rounded-lg object-cover shadow-sm border border-white/10 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-white text-xs group-hover:text-red-400 transition-colors">
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              {item.year} • {item.genre.join(", ")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-medium text-neutral-300">
                        {item.type}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            item.status === "Published"
                              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                              : item.status === "Draft"
                                ? "bg-amber-950/60 border-amber-500/40 text-amber-400"
                                : item.status === "Scheduled"
                                  ? "bg-blue-950/60 border-blue-500/40 text-blue-400"
                                  : "bg-neutral-800 border-white/10 text-neutral-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-bold text-amber-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {item.rating}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-neutral-300">
                        {item.views}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleFeatured(item.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              item.isFeatured
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                : "bg-neutral-800 text-neutral-500 border-white/5 hover:text-white"
                            }`}
                            title="Toggle Hero Featured"
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-white/5 transition-colors"
                            title="Preview Media"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-white/5 transition-colors"
                            title="Edit Title"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setMediaList(
                                mediaList.filter((m) => m.id !== item.id),
                              );
                              showToast(`Removed "${item.title}"`);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-600/20 text-neutral-500 hover:text-red-400 border border-white/5 transition-colors"
                            title="Delete Title"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Stats */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-3 border-t border-white/5">
            <span>
              Showing {filteredList.length} of {mediaList.length} items
            </span>
            <span>Active Server Bitrate: 45.2 Gbps</span>
          </div>
        </div>

        {/* RIGHT (3 COLS): ADMIN ANALYTICS & LIGHT PANEL */}
        <div className="lg:col-span-3 bg-[#e9ecee] rounded-[30px] p-5 flex flex-col justify-between shadow-md border border-white/80 text-neutral-800">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <Database className="w-4 h-4 text-red-600" />
                <span>Quick Summary</span>
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-neutral-300 text-neutral-800 px-2.5 py-1 rounded-full">
                Live Status
              </span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-white rounded-2xl border border-black/5 shadow-sm">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                  Total Titles
                </span>
                <span className="text-lg font-black text-neutral-900">
                  {mediaList.length}
                </span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-black/5 shadow-sm">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                  Active Streams
                </span>
                <span className="text-lg font-black text-red-600">14.8k</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-black/5 shadow-sm">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                  Storage Used
                </span>
                <span className="text-lg font-black text-neutral-900">
                  4.2 TB
                </span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-black/5 shadow-sm">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                  Draft Queue
                </span>
                <span className="text-lg font-black text-amber-600">
                  {mediaList.filter((m) => m.status === "Draft").length}
                </span>
              </div>
            </div>

            {/* Storage Breakdown Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-black/5 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                <span>4K Stream Storage Allocation</span>
                <span>84%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden flex">
                <div className="bg-red-600 h-full w-[60%]" title="Movies 60%" />
                <div
                  className="bg-amber-500 h-full w-[24%]"
                  title="TV Series 24%"
                />
                <div
                  className="bg-neutral-300 h-full w-[16%]"
                  title="Unallocated 16%"
                />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-neutral-500 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600" /> Movies
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> TV
                  Shows
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => showToast("Opening Upload Wizard...")}
            className="w-full mt-4 py-3.5 rounded-full bg-[#121316] text-white text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-red-500" />
            <span>Add New Title</span>
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION: 12 COLS GRID SPLIT (5 : 4 : 3) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4">
        {/* CARD 1 (5 COLS): FEATURED HERO BANNER MANAGER */}
        <div className="md:col-span-5 bg-[#121316] rounded-[30px] p-5 flex flex-col justify-between shadow-lg border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-amber-400" /> Hero Banner Showcase
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              Top Priority Stream
            </span>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto no-scrollbar">
            {mediaList
              .filter((m) => m.isFeatured)
              .map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-2xl bg-[#1a1c23] border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white leading-tight">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-neutral-400">
                        {item.type} • {item.views} views
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFeatured(item.id)}
                    className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold hover:bg-red-600/30"
                  >
                    Unfeature
                  </button>
                </div>
              ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
            <span>
              Showcase slots:{" "}
              <strong>
                {mediaList.filter((m) => m.isFeatured).length} / 5 Active
              </strong>
            </span>
            <button
              onClick={() => showToast("Hero banner reordered")}
              className="text-red-400 hover:text-red-300 font-bold"
            >
              Manage Priority →
            </button>
          </div>
        </div>

        {/* CARD 2 (4 COLS): RECENT ACTIVITY LOG */}
        <div className="md:col-span-4 bg-[#18191c] rounded-[30px] p-5 flex flex-col justify-between shadow-lg border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-500" /> Recent Activity Log
            </h4>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex flex-col gap-2.5 my-auto py-1">
            {activity.map((act) => (
              <div key={act.id} className="flex items-start gap-2 text-left">
                {act.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-xs font-bold text-white leading-tight">
                    {act.title}
                  </h5>
                  <p className="text-[10px] text-neutral-400">{act.action}</p>
                  <span className="text-[9px] text-neutral-500">
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => showToast("Audit logs exported")}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold border border-white/5 transition-all"
          >
            View Audit Trail
          </button>
        </div>

        {/* CARD 3 (3 COLS): QUICK STATUS WIDGET */}
        <div className="md:col-span-3 bg-red-950/80 rounded-[30px] p-5 flex flex-col justify-between shadow-lg border border-red-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
              <Server className="w-4 h-4 text-red-400" />
              <span>Transcoder Engine</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>

          <div className="my-auto space-y-2">
            <div className="flex justify-between text-xs font-bold text-white">
              <span>H.265 Transcode Cluster</span>
              <span className="text-emerald-400">Optimal</span>
            </div>
            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-amber-400 h-full w-[72%]" />
            </div>
            <p className="text-[10px] text-red-200/80">
              3 active rendering nodes processing 4K IMAX source streams.
            </p>
          </div>

          <button
            onClick={() => showToast("CDN cache cleared successfully")}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all"
          >
            Flush CDN Edge Cache
          </button>
        </div>
      </div>
    </div>
  );
}

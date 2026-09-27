import React, { useState, useMemo } from "react";
import {
  Home,
  Film,
  Tv,
  Settings,
  Upload,
  Plus,
  Check,
  Trash2,
  FileText,
  Video,
  Image as ImageIcon,
  Sparkles,
  Layers,
  FolderPlus,
  Star,
  Clock,
  X,
  SlidersHorizontal,
  HardDrive,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Play,
  Maximize2,
} from "lucide-react";

interface DraftItem {
  id: string;
  title: string;
  type: "Movie" | "TV Show";
  size: string;
  progress: number;
  status: "Draft" | "Uploading" | "Ready";
}

interface ActivityItem {
  id: string;
  title: string;
  action: string;
  time: string;
  status: "success" | "pending";
}

export default function AdminUpload() {
  const [activeNav, setActiveNav] = useState("upload");
  const [activeTab, setActiveTab] = useState<"new" | "manage">("new");
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState<"Movie" | "TV Show" | "Anime">(
    "Movie",
  );
  const [genre, setGenre] = useState("Sci-Fi");
  const [year, setYear] = useState("2026");
  const [imdbRating, setImdbRating] = useState("8.5");
  const [maturity, setMaturity] = useState("PG-13");
  const [description, setDescription] = useState("");
  const [castInput, setCastInput] = useState("");
  const [castList, setCastList] = useState<string[]>([
    "Timothée Chalamet",
    "Zendaya",
  ]);

  // Tech Specs State
  const [is4K, setIs4K] = useState(true);
  const [isHDR, setIsHDR] = useState(true);
  const [isDolby, setIsDolby] = useState(true);

  // Simulated File Upload State
  const [uploadProgress, setUploadProgress] = useState(78);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  // Draft items in right light panel
  const [drafts, setDrafts] = useState<DraftItem[]>([
    {
      id: "d-1",
      title: "Dune: Part Two (4K IMAX)",
      type: "Movie",
      size: "14.2 GB",
      progress: 100,
      status: "Ready",
    },
    {
      id: "d-2",
      title: "Severance Season 2 Ep 1",
      type: "TV Show",
      size: "3.8 GB",
      progress: 45,
      status: "Uploading",
    },
    {
      id: "d-3",
      title: "Cyberpunk: Edgerunners S2",
      type: "TV Show",
      size: "2.1 GB",
      progress: 0,
      status: "Draft",
    },
  ]);

  // Activity Feed
  const [activity, setActivity] = useState<ActivityItem[]>([
    {
      id: "a-1",
      title: "Interstellar",
      action: "Published to Catalog",
      time: "10 mins ago",
      status: "success",
    },
    {
      id: "a-2",
      title: "The Batman",
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

  const addCastMember = () => {
    if (castInput.trim() && !castList.includes(castInput.trim())) {
      setCastList([...castList, castInput.trim()]);
      setCastInput("");
      showToast("Cast member added");
    }
  };

  const removeCastMember = (name: string) => {
    setCastList(castList.filter((item) => item !== name));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Please enter a title for the media");
      return;
    }
    showToast(`Successfully published "${title}" to Catalog!`);
    setTitle("");
    setDescription("");
  };

  const startSimulatedUpload = () => {
    setIsSimulatingUpload(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingUpload(false);
          showToast("Video file encoding complete!");
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pr-1">
      {/* HEADER & TAB CONTROL BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121316]/80 p-3 rounded-2xl ">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Studio Management Studio
            </h2>
            <p className="text-[11px] text-neutral-400">
              Upload high-bitrate video streams & catalog metadata
            </p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-[#1a1c23] p-1 rounded-xl ">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "new"
                ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Upload New Media
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "manage"
                ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Manage Library
          </button>
        </div>
      </div>

      {/* TOP SECTION: FORM INPUT (8 COLS) + QUEUE DRAFTS (4 COLS) */}
      {}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT (8 COLS): MAIN EDIT FORM PANEL */}
        <div className="lg:col-span-8 bg-[#121316] rounded-[30px] p-5 md:p-6 shadow-xl  flex flex-col justify-between">
          <form onSubmit={handlePublish} className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                <span>General Metadata</span>
              </h3>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                Step 1 of 2
              </span>
            </div>

            {/* Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dune: Part Two"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1a1c23] text-xs font-semibold text-white placeholder-neutral-600 px-4 py-3 rounded-xl  outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Media Format
                </label>
                <select
                  value={mediaType}
                  onChange={(e: any) => setMediaType(e.target.value)}
                  className="w-full bg-[#1a1c23] text-xs font-semibold text-white px-4 py-3 rounded-xl  outline-none focus:border-red-500/50 transition-colors cursor-pointer"
                >
                  <option value="Movie">Movie (Feature Film)</option>
                  <option value="TV Show">TV Show (Series)</option>
                  <option value="Anime">Anime Series</option>
                </select>
              </div>
            </div>

            {/* Genre, Year, Rating, Maturity */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-[#1a1c23] text-xs font-semibold text-white px-3 py-3 rounded-xl  outline-none focus:border-red-500/50 cursor-pointer"
                >
                  <option>Sci-Fi</option>
                  <option>Action</option>
                  <option>Drama</option>
                  <option>Thriller</option>
                  <option>Comedy</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Release Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#1a1c23] text-xs font-semibold text-white px-3 py-3 rounded-xl  outline-none focus:border-red-500/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  IMDb Score
                </label>
                <input
                  type="text"
                  value={imdbRating}
                  onChange={(e) => setImdbRating(e.target.value)}
                  className="w-full bg-[#1a1c23] text-xs font-semibold text-amber-400 px-3 py-3 rounded-xl  outline-none focus:border-red-500/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Maturity Badge
                </label>
                <select
                  value={maturity}
                  onChange={(e) => setMaturity(e.target.value)}
                  className="w-full bg-[#1a1c23] text-xs font-semibold text-white px-3 py-3 rounded-xl  outline-none focus:border-red-500/50 cursor-pointer"
                >
                  <option>PG-13</option>
                  <option>R (18+)</option>
                  <option>TV-MA</option>
                  <option>PG</option>
                </select>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Synopsis / Summary
              </label>
              <textarea
                rows={3}
                placeholder="Enter detailed plot synopsis..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1a1c23] text-xs font-medium text-white placeholder-neutral-600 p-3.5 rounded-xl  outline-none focus:border-red-500/50 resize-none"
              />
            </div>

            {/* Submit Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => showToast("Saved to Draft Queue")}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition-all "
              >
                Save as Draft
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-lg shadow-red-900/50 flex items-center gap-2 transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Publish Title Immediately</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT (4 COLS): LIGHT DRAFTS & QUEUE PANEL */}
        {}
        <div className="lg:col-span-4 bg-[#e9ecee] rounded-[30px] p-5 flex flex-col justify-between shadow-md border border-white/80 text-neutral-800">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-600" />
                <span>Upload Queue & Drafts</span>
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-neutral-300 text-neutral-700 px-2.5 py-1 rounded-full">
                {drafts.length} Pending
              </span>
            </div>

            <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[310px] pr-1 no-scrollbar">
              {drafts.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white shadow-sm border border-black/5 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-neutral-500 block mt-0.5">
                        {item.type} • {item.size}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.status === "Ready"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Uploading"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  {item.progress < 100 && (
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                    <button
                      onClick={() => {
                        setDrafts(drafts.filter((d) => d.id !== item.id));
                        showToast(`Removed "${item.title}"`);
                      }}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Discard</span>
                    </button>

                    <button
                      onClick={() => showToast(`Pushed "${item.title}" live!`)}
                      className="text-[11px] font-bold text-neutral-900 hover:text-black"
                    >
                      Push Live →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Action */}
          <button
            onClick={() => showToast("Publishing all ready drafts...")}
            className="w-full mt-4 py-3.5 rounded-full bg-[#121316] text-white text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-md active:scale-95"
          >
            Publish All Ready Items
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION: 12 COLS GRID SPLIT (5 : 4 : 3) */}
      {}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4">
        {/* CARD 1 (5 COLS): FILE UPLOAD DROPZONE & ASSET PREVIEW */}
        <div className="md:col-span-5 bg-[#121316] rounded-[30px] p-5 flex flex-col justify-between shadow-lg ">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full">
              Media Streams & Assets
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              Step 2 of 2
            </span>
          </div>

          {/* Drag Drop Area */}
          <div
            onClick={startSimulatedUpload}
            className="border-2 border-dashed border-white/10 hover:border-red-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#1a1c23]/50 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 group-hover:bg-red-600/20 text-red-500 flex items-center justify-center mb-3 transition-colors">
              <Video className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">
              Click to Browse or Drag High-Bitrate Video (MP4 / MKV)
            </h4>
            <p className="text-[10px] text-neutral-500">
              Supports ProRes, H.265 4K UHD up to 50 GB
            </p>
          </div>

          {/* Encoding Bar */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex justify-between text-[11px] font-semibold text-neutral-300 mb-1">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-red-400" />
                <span>Transcoder Engine Progress</span>
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 2 (4 COLS): TECH SPECS & CAST TAGGER */}
        <div className="md:col-span-4 bg-[#18191c] rounded-[30px] p-5 flex flex-col justify-between shadow-lg ">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider border-b border-white/5 pb-2">
              Technical Badges & Cast
            </h4>

            {/* Quality Toggles */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "4K UHD", state: is4K, set: setIs4K },
                { label: "HDR10+", state: isHDR, set: setIsHDR },
                { label: "Dolby Atmos", state: isDolby, set: setIsDolby },
              ].map((tech) => (
                <button
                  key={tech.label}
                  type="button"
                  onClick={() => tech.set(!tech.state)}
                  className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                    tech.state
                      ? "bg-red-950/60 border-red-500/40 text-red-400"
                      : "bg-neutral-900 border-white/5 text-neutral-500"
                  }`}
                >
                  {tech.label}
                </button>
              ))}
            </div>

            {/* Cast Input */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase">
                Cast Member Tagging
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add Actor Name"
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCastMember())
                  }
                  className="flex-1 bg-[#1a1c23] text-xs font-medium text-white px-3 py-2 rounded-xl  outline-none"
                />
                <button
                  type="button"
                  onClick={addCastMember}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-20 overflow-y-auto no-scrollbar">
                {castList.map((actor) => (
                  <span
                    key={actor}
                    className="text-[10px] font-semibold bg-neutral-800 text-neutral-200 px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10"
                  >
                    <span>{actor}</span>
                    <X
                      onClick={() => removeCastMember(actor)}
                      className="w-3 h-3 cursor-pointer hover:text-red-400"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3 (3 COLS): ACTIVITY FEED */}
        <div className="md:col-span-3 bg-red-950/80 rounded-[30px] p-5 flex flex-col justify-between shadow-lg border border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Activity Feed</span>
            </div>
            <Clock className="w-4 h-4 text-red-300" />
          </div>

          <div className="flex flex-col gap-3 my-auto py-2">
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
                  <p className="text-[10px] text-red-200/80">{act.action}</p>
                  <span className="text-[9px] text-neutral-400">
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => showToast("Activity logs exported")}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all"
          >
            View Full Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}

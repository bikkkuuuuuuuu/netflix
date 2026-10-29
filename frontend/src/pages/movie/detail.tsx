import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Plus,
  Check,
  ThumbsUp,
  Share2,
  Star,
  Flame,
  ChevronRight,
  Info,
  Volume2,
  VolumeX,
  X,
  Maximize,
  RotateCcw,
  RotateCw,
  ArrowLeft,
  Award,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieSlider, { Movie } from "@/components/Cards/cards";
import { MOVIES, SuggestedMovies } from "@/data/movies";
interface Episode {
  id: number;
  season: number;
  episodeNum: number;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  progress?: number;
  videoUrl?: string;
}

interface CastMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface ShowDetail {
  id: string;
  title: string;
  type: "TV Show" | "Movie";
  bannerImage: string;
  posterImage: string;
  imdbRating: string;
  matchPercentage: string;
  year: string;
  maturityRating: string;
  seasonsCount: number;
  duration: string;
  genres: string[];
  description: string;
  creators: string[];
  audioLanguages: string[];
  qualityBadge: string;
  trendingRank: number;
}

const SHOW_DATA: ShowDetail = {
  id: "stranger-things",
  title: "Stranger Things",
  type: "TV Show",
  bannerImage: "/images/stranger.png",
  posterImage:
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
  imdbRating: "8.7",
  matchPercentage: "98%",
  year: "2025",
  maturityRating: "TV-MA",
  seasonsCount: 4,
  duration: "4 Seasons",
  genres: ["Sci-Fi", "Horror", "Drama", "Mystery"],
  description:
    "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl with telekinetic powers.",
  creators: ["The Duffer Brothers"],
  audioLanguages: ["English [Original]", "Spanish", "French", "Japanese"],
  qualityBadge: "4K Ultra HD · HDR · Dolby Atmos",
  trendingRank: 1,
};

const EPISODES_DATA: Episode[] = [
  {
    id: 101,
    season: 1,
    episodeNum: 1,
    title: "Chapter One: The Vanishing of Will Byers",
    duration: "48m",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop",
    description:
      "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
    progress: 100,
  },
  {
    id: 102,
    season: 1,
    episodeNum: 2,
    title: "Chapter Two: The Weirdo on Maple Street",
    duration: "55m",
    thumbnail:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500&auto=format&fit=crop",
    description:
      "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about a disturbing phone call.",
    progress: 65,
  },
  {
    id: 103,
    season: 1,
    episodeNum: 3,
    title: "Chapter Three: Holly, Jolly",
    duration: "51m",
    thumbnail:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop",
    description:
      "An increasingly concerned Nancy looks for Barb and finds out what Jonathan's been up to. Joyce is convinced Will is trying to communicate.",
    progress: 0,
  },
  {
    id: 104,
    season: 1,
    episodeNum: 4,
    title: "Chapter Four: The Body",
    duration: "50m",
    thumbnail:
      "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?q=80&w=500&auto=format&fit=crop",
    description:
      "Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover.",
    progress: 0,
  },
  {
    id: 401,
    season: 4,
    episodeNum: 1,
    title: "Chapter One: The Hellfire Club",
    duration: "1h 16m",
    thumbnail:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500&auto=format&fit=crop",
    description:
      "El struggles to fit in at school in California. In Hawkins, a high school D&D club faces panic as a supernatural threat reemerges.",
    progress: 85,
  },
  {
    id: 402,
    season: 4,
    episodeNum: 2,
    title: "Chapter Two: Vecna's Curse",
    duration: "1h 17m",
    thumbnail:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop",
    description:
      "A plane brings Mike to California. A dead body brings Hawkins to a halt. Nancy starts asking questions.",
    progress: 10,
  },
  {
    id: 403,
    season: 4,
    episodeNum: 3,
    title: "Chapter Three: The Monster and the Superhero",
    duration: "1h 03m",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop",
    description:
      "Murray and Joyce fly to Alaska. El faces the consequences of her actions. Robin and Nancy dig for dirt on Hawkins' demons.",
    progress: 0,
  },
];

const CAST_DATA: CastMember[] = [
  {
    id: 1,
    name: "Millie Bobby Brown",
    role: "Eleven",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Finn Wolfhard",
    role: "Mike Wheeler",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Winona Ryder",
    role: "Joyce Byers",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "David Harbour",
    role: "Jim Hopper",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Winona Ryder",
    role: "Joyce Byers",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "David Harbour",
    role: "Jim Hopper",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

export default function DetailPage() {
  const location = useLocation();

  const movie = location.state?.movie as Movie | undefined;
  // Navigation active tab state

  // Interaction States
  const playerRef = useRef<HTMLDivElement>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(4);

  // Video Modal Player State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentPlayingEpisode, setCurrentPlayingEpisode] =
    useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(25);
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navigate = useNavigate();
  // Toast Notification Trigger
  const triggerNotification = (msg: string) => {
    // setNotificationMsg(msg);
    console.log(msg);
    setTimeout(() => {}, 3000);
  };

  // Filter episodes based on selected season
  const filteredEpisodes = EPISODES_DATA.filter(
    (ep) => ep.season === selectedSeason,
  );

  // Launch Video Modal
  const handlePlayEpisode = (episode?: Episode) => {
    const epToPlay = episode || filteredEpisodes[0] || EPISODES_DATA[0];
    setCurrentPlayingEpisode(epToPlay);
    setIsVideoModalOpen(true);
    setIsPlaying(true);
  };

  useEffect(() => {
    let interval: any;
    if (isVideoModalOpen && isPlaying) {
      interval = setInterval(() => {
        setPlayerProgress((prev) => (prev >= 100 ? 0 : prev + 0.2));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isVideoModalOpen, isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isVideoModalOpen || !playerRef.current) return;

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await playerRef.current?.requestFullscreen();
        }
      } catch (error) {
        console.error("Fullscreen failed:", error);
      }
    };

    enterFullscreen();
  }, [isVideoModalOpen]);

  return (
    <>
      <div
        className="flex-1 flex flex-col gap-4 overflow-y-auto  pr-1"
        style={{ scrollbarWidth: "none" }}
      >
        {/* TOP GRID: HERO BANNER (9 COLS) + EPISODES BROWSE (3 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 relative rounded-[30px] overflow-hidden bg-black min-h-[440px] lg:min-h-[480px] flex flex-col justify-between p-6 md:p-8 shadow-2xl group border border-white/10 select-none">
            {/* Poster Backdrop with Ambient Overlay */}
            <img
              src={movie?.posterUrl}
              alt={movie?.title}
              className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-110 brightness-75 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/40 to-black/30 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />

            {/* Top Banner Badges */}
            <div className="relative z-20 flex items-center justify-between gap-2 flex-wrap">
              {/* Top 1 Badge */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-xs font-semibold text-white shadow-xl">
                <Flame className="w-4 h-4 fill-white animate-pulse" />
                <span>#{SHOW_DATA.trendingRank} in TV Shows Today</span>
              </div>

              {/* Metadata Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-xs font-bold  flex items-center gap-1 shadow-md">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>IMDb {SHOW_DATA.imdbRating}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-xs font-bold  shadow-md">
                  {SHOW_DATA.matchPercentage} Match
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-xs font-medium text-white/90 shadow-md">
                  {SHOW_DATA.year}
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-xs font-medium text-white/90 shadow-md">
                  {SHOW_DATA.maturityRating}
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-xs font-medium text-white/90 shadow-md">
                  {SHOW_DATA.duration}
                </div>

                {/* Audio Mute Toggle */}
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    triggerNotification(
                      isMuted ? "Audio Unmuted" : "Audio Muted",
                    );
                  }}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xl border border-white/15 text-white transition-all shadow-md active:scale-95"
                  title={isMuted ? "Unmute Preview" : "Mute Preview"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-red-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Main Info & Actions */}
            <div className="relative z-20 flex flex-col gap-4 max-w-2xl mt-auto pt-6">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-xl">
                {movie?.title}
              </h1>

              <p className="text-xs md:text-sm text-neutral-300 line-clamp-3 leading-relaxed drop-shadow-sm font-normal">
                {movie?.description}
              </p>

              {/* Genre Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {SHOW_DATA.genres.map((genre) => (
                  <span
                    key={genre}
                    className="text-[11px] font-semibold px-3.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Primary Action Buttons */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <button
                  onClick={() => {
                    navigate("/watch/" + movie?.id);
                  }}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                >
                  <Play className="w-4 h-4 fill-black text-black" />
                  <span>Play S{selectedSeason} E1</span>
                </button>

                <button
                  onClick={() => {
                    setInWatchlist(!inWatchlist);
                    triggerNotification(
                      !inWatchlist
                        ? "Added Stranger Things to Watchlist"
                        : "Removed from Watchlist",
                    );
                  }}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-full border backdrop-blur-xl text-xs font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                    inWatchlist
                      ? "bg-red-600 border-red-500 text-white"
                      : "bg-black/50 border-white/20 text-white hover:bg-black/70"
                  }`}
                >
                  {inWatchlist ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{inWatchlist ? "In Watchlist" : "Watchlist"}</span>
                </button>

                <button
                  onClick={() => {
                    setIsLiked(!isLiked);
                    triggerNotification(
                      !isLiked ? "Rated 1 Thumbs Up" : "Removed Rating",
                    );
                  }}
                  className={`p-3.5 rounded-full border backdrop-blur-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                    isLiked
                      ? "bg-white text-black border-white"
                      : "bg-black/50 border-white/20 text-white hover:bg-black/70"
                  }`}
                  title="I like this"
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${isLiked ? "fill-black" : ""}`}
                  />
                </button>

                <button
                  onClick={() =>
                    triggerNotification("Shareable link copied to clipboard!")
                  }
                  className="p-3.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white backdrop-blur-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-5 px-3 pt-6">
              <div>
                <h2 className="text-xl font-semibold text-white mt-1">
                  Cast & Characters
                </h2>
              </div>

              <button
                onClick={() => triggerNotification("Viewing full cast list")}
                className="group flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
              >
                See all
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-5 gap-y-6 px-3 pt-3">
              {CAST_DATA.slice(0, 5).map((actor) => (
                <button
                  key={actor.id}
                  onClick={() =>
                    triggerNotification(`Actor profile: ${actor.name}`)
                  }
                  className="group text-left"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1b1c20] mb-3">
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <h3 className="text-sm font-semibold text-white truncate">
                    {actor.name}
                  </h3>

                  <p className="text-xs text-neutral-500 truncate mt-1">
                    {actor.role}
                  </p>
                </button>
              ))}
            </div>
            <section className="max-w-4xl px-3 py-16">
              <div>
                <h2 className="text-xl font-semibold text-white mt-1">
                  Synopsis
                </h2>
              </div>

              <p className="text-sm mt-2 md:text-base leading-7 text-neutral-400">
                {movie?.description || SHOW_DATA.description}
              </p>
            </section>
            <MovieSlider title="More Like This" mapItems={3} MOVIES={MOVIES} />
            <MovieSlider
              title="Suggested For You"
              mapItems={3}
              MOVIES={SuggestedMovies}
            />
          </div>

          <div className="lg:col-span-3 self-start sticky bottom-4 space-y-6">
            <div className="lg:col-span-3 bg-[#121316] rounded-[30px] p-5 flex flex-col justify-between shadow-xl">
              <div className="flex flex-col h-full ">
                {/* Panel Header & Season Selector */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Episodes
                  </h2>

                  {/* Season Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        const s = Number(e.target.value);
                        setSelectedSeason(s);
                        triggerNotification(`Switched to Season ${s}`);
                      }}
                      className="appearance-none bg-[#14151a] text-white text-xs font-bold px-4 py-2 pr-8 rounded-full border border-black/10 outline-none cursor-pointer shadow-md hover:bg-neutral-800 transition-colors"
                    >
                      <option value={1}>Season 1</option>
                      <option value={2}>Season 2</option>
                      <option value={3}>Season 3</option>
                      <option value={4}>Season 4</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Episodes List */}
                <div
                  className="flex flex-col gap-3 overflow-y-auto max-h-[340px] lg:max-h-[360px] pr-1 no-scrollbar"
                  style={{
                    scrollbarWidth: "none",
                  }}
                >
                  {filteredEpisodes.length > 0 ? (
                    filteredEpisodes.map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => handlePlayEpisode(ep)}
                        className="group flex flex-col gap-2 p-2.5 rounded-2xl bg-[#121316]/85 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex gap-3 items-center">
                          {/* Thumbnail */}
                          <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-200">
                            <img
                              src={ep.thumbnail}
                              alt={ep.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                              <div className="w-7 h-7 rounded-full bg-white/90 text-black flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[14px] font-bold text-white truncate leading-tight">
                              {ep.episodeNum}. {ep.title}
                            </h4>
                            <p className="text-[11px] text-slay-500 font-medium mt-1 line-clamp-1">
                              {ep.description}
                            </p>
                            <span className="text-[10px] font-semibold text-neutral-400 mt-0.5 block">
                              {ep.duration}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {ep.progress !== undefined && ep.progress > 0 && (
                          <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-red-600 rounded-full"
                              style={{ width: `${ep.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs font-semibold text-neutral-500">
                      No episodes available for this season.
                    </div>
                  )}
                </div>
              </div>

              {/* View All Button */}
              <button
                onClick={() =>
                  triggerNotification("Opening full episode catalog...")
                }
                className="w-full mt-4 py-3.5 rounded-full bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase hover:bg-neutral-700 transition-colors shadow-md active:scale-95"
              >
                View All Episodes
              </button>
            </div>
            <div className="lg:col-span-3 bg-[#18191c] rounded-[30px] p-6 border border-white/[0.06]">
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Information
                </p>

                <h2 className="text-lg font-semibold text-white mt-1">
                  Show details
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-7">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Creator
                  </p>

                  <p className="text-sm text-white mt-1.5">
                    {SHOW_DATA.creators.join(", ")}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Year
                  </p>

                  <p className="text-sm text-white mt-1.5">{SHOW_DATA.year}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Genres
                  </p>

                  <p className="text-sm text-white mt-1.5">
                    {SHOW_DATA.genres.join(", ")}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Runtime
                  </p>

                  <p className="text-sm text-white mt-1.5">
                    {SHOW_DATA.duration}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Audio
                  </p>

                  <p className="text-sm text-white mt-1.5">
                    {SHOW_DATA.audioLanguages.length} Languages
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Quality
                  </p>

                  <p className="text-sm text-white mt-1.5">4K · HDR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Banner from "@/components/Banner/banner";
import MovieSlider from "@/components/Cards/cards";
import { SuggestedMovies } from "@/data/movies";
import { getBackendUrl, normalizeMovie, normalizeMovies } from "@/lib/utils";
import movieSvc from "@/services/movie.service";
import watchHistorySvc from "@/services/watchHistory.service";
import watchSvc from "@/services/watchlist.service";
import { Movie } from "@/types/data";
import {
  Play,
  Pause,
  ChevronRight,
  ListMusic,
  SkipBack,
  SkipForward,
  Maximize2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [nowPlayingState, setNowPlayingState] = useState(true);
  const [newlyArrived, setNewlyArrived] = useState<Movie[] | []>([]);

  const [recentlyWatched, setRecentlyWatched] = useState<any[]>([]);
  const [watchList, setWatchList] = useState<Movie[] | []>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: "action",
      name: "Action",
      count: "128 titles",
      image:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "drama",
      name: "Drama",
      count: "96 titles",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "thriller",
      name: "Thriller",
      count: "142 titles",
      image:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=200&auto=format&fit=crop",
      active: true,
    },
    {
      id: "comedy",
      name: "Comedy",
      count: "87 titles",
      image:
        "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?q=80&w=200&auto=format&fit=crop",
    },
  ]);
  const navigate = useNavigate();

  const selectCategory = (id: string) => {
    setCategories(
      categories.map((cat) => ({
        ...cat,
        active: cat.id === id,
      })),
    );
  };

  const fetchNewlyArrived = async () => {
    try {
      const response = await movieSvc.newlyArrived(6);
      const movies = normalizeMovies(response.detail.slice(2, 6));
      setNewlyArrived(movies);
    } catch (exception) {
      console.log(exception);
    }
  };
  const fetchRecentlyWatched = async () => {
    try {
      const response = await watchHistorySvc.fetchRecentWatches();
      setRecentlyWatched(response.detail);
    } catch (exception) {
      console.log(exception);
    }
  };
  const fetchWatchList = async () => {
    try {
      const response = await watchSvc.listMyWatchList();
      const normalizedMovies: Movie[] = response.detail
        .filter((item: any) => item?.movie?._id)
        .map((item: any) => normalizeMovie(item.movie));
      setWatchList(normalizedMovies);
    } catch (exception) {
      console.log(exception);
    }
  };
  const fetchSuggested = async () => {
    try {
      const response = await movieSvc.suggested();
      // setRecentlyWatched(response.detail);

      console.log(response);
    } catch (exception) {
      console.log(exception);
    }
  };
  const fetchforHome = async () => {
    try {
      const response = await movieSvc.home(6, "");
      const moviesWithUrls = normalizeMovies(response.detail);
      console.log(moviesWithUrls);
    } catch (exception) {
      console.log(exception);
    }
  };
  useEffect(() => {
    fetchforHome();
    fetchNewlyArrived();
    fetchSuggested();
    fetchRecentlyWatched();
    fetchWatchList();
  }, []);

  const latestWatched = recentlyWatched[0];
  const recentlyWatchedMovies: Movie[] = Array.from(
    new Map(
      recentlyWatched
        .filter((history) => history?.movie?._id)
        .map((history) => {
          const movie = normalizeMovie(history.movie);

          return [movie._id, movie];
        }),
    ).values(),
  );
  const watchedMovie = latestWatched?.movie;

  const progress =
    latestWatched?.duration > 0
      ? Math.min(
          100,
          Math.round((latestWatched.progress / latestWatched.duration) * 100),
        )
      : 0;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        className="grid min-h-0 min-w-0 flex-1 grid-cols-1 content-start gap-4 overflow-x-hidden overflow-y-auto overscroll-y-contain p-3 lg:grid-cols-12"
        style={{
          scrollbarWidth: "none",
        }}
      >
        <Banner />

        <NavLink
          to={"/watch/" + watchedMovie?._id}
          className="md:col-span-5 relative rounded-[24px] overflow-hidden bg-neutral-900 min-h-[320px] p-5 flex flex-col justify-between shadow-lg group"
        >
          <img
            src={getBackendUrl(watchedMovie?.poster) ?? "/images/dune.png"}
            alt={watchedMovie?.title || "Continue Watching"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover brightness-75 contrast-125 transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          <div className="relative z-10">
            <h3 className="text-base font-bold text-white tracking-tight">
              Continue Watching
            </h3>
            <p className="text-xs font-medium text-neutral-300">
              {watchedMovie?.title || "Discover something to watch"}
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-300">
              <button
                disabled={!watchedMovie?._id}
                onClick={() => {
                  if (!watchedMovie?._id) return;

                  navigate(`/player/${watchedMovie._id}`, {
                    state: {
                      resumeAt: latestWatched?.progress ?? 0,
                    },
                  });
                }}
                className="flex items-center gap-1.5 text-white font-semibold hover:text-red-400 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Resume</span>
              </button>

              <span>{progress}% watched</span>
            </div>

            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full shadow-[0_0_8px_#ffffff] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </NavLink>

        <div className="md:col-span-4 bg-[#18191c] rounded-[24px] min-h-[320px]  flex flex-col justify-between shadow-lg  relative overflow-hidden group">
          {/* Header */}
          <div className="flex p-4 items-center justify-between z-10">
            <h3 className="text-base font-bold text-white tracking-tight">
              Top Pick For You
            </h3>
          </div>

          {/* Deadpool Character Viewport */}
          <div className="absolute h-full w-full flex items-center justify-center">
            <img
              src="/images/spiderman.png"
              alt="Deadpool"
              className="h-full object-cover filter w-full  transition-transform duration-500"
            />
          </div>
        </div>
        <div className="lg:col-span-9">
          <MovieSlider
            title="Newly Arrived"
            mapItems={3}
            MOVIES={newlyArrived}
          />
          <MovieSlider
            title="Suggested For You"
            mapItems={3}
            MOVIES={SuggestedMovies}
          />
          {recentlyWatchedMovies.length > 0 && (
            <MovieSlider
              title="Recently Watched"
              mapItems={3}
              MOVIES={recentlyWatchedMovies}
            />
          )}
          {watchList.length > 0 && (
            <MovieSlider
              title="Your Watch List"
              mapItems={3}
              MOVIES={watchList}
            />
          )}
        </div>
        <div className="lg:col-span-3 self-start sticky bottom-16 space-y-6">
          <Browse categories={categories} onSelectCategory={selectCategory} />

          <div className="hidden md:block md:col-span-3 relative rounded-[24px] overflow-hidden bg-red-950 min-h-[320px] p-5  flex-col justify-between shadow-lg  group">
            {/* Asian Cinema Artwork (Red Theme Overlay) */}
            <img
              src="/images/inter.png"
              alt="Now Playing Poster"
              className="absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-75 scale-105 transition-transform duration-700"
            />

            {/* Header Info & Autoplay Toggle */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Now Playing</h3>
                <p className="text-[11px] font-medium text-neutral-300">
                  Wednesday S4E3
                </p>
              </div>
            </div>

            {/* Player Controls Center Row */}
            <div className="relative z-10 flex items-center justify-center gap-4 my-2">
              {/* Playlist Icon */}
              <button className="text-white/70 hover:text-white transition-colors">
                <ListMusic className="w-4 h-4" />
              </button>

              {/* Skip Back */}
              <button className="text-white/80 hover:text-white transition-colors">
                <SkipBack className="w-4 h-4 fill-white" />
              </button>

              {/* Main Play/Pause Button */}
              <button
                onClick={() => setNowPlayingState(!nowPlayingState)}
                className="w-10 h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
              >
                {nowPlayingState ? (
                  <Pause className="w-4 h-4 fill-neutral-950" />
                ) : (
                  <Play className="w-4 h-4 fill-neutral-950 ml-0.5" />
                )}
              </button>

              {/* Skip Forward */}
              <button className="text-white/80 hover:text-white transition-colors">
                <SkipForward className="w-4 h-4 fill-white" />
              </button>

              {/* Audio/Maximize Icon */}
              <button className="text-white/70 hover:text-white transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Audio Scrub Progress Bar */}
            <div className="relative z-10 w-full pt-2">
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="w-[45%] h-full bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;

export interface CategoryItem {
  id: string;
  name: string;
  count: string;
  image: string;
  active?: boolean;
}

interface BrowseProps {
  categories: CategoryItem[];
  onSelectCategory: (id: string) => void;
}

const Browse = ({ categories, onSelectCategory }: BrowseProps) => {
  return (
    <div className="hidden md:block lg:col-span-3 bg-[#121316] rounded-[30px] p-3  flex-col justify-between shadow-md border border-white/80">
      <div>
        <h2 className="text-xl font-bold text-white m-3 tracking-tight">
          Browse
        </h2>

        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center justify-between p-3 rounded-full cursor-pointer transition-all duration-300 ${
                cat.active
                  ? "bg-[#262626] shadow-lg shadow-black/5 scale-[1.02]"
                  : "hover:bg-[#262626]/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full border border-black/5 object-cover shadow-sm"
                />

                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {cat.name}
                  </h3>

                  <span className="text-xs font-medium text-neutral-400">
                    {cat.count}
                  </span>
                </div>
              </div>

              <div
                className={`p-1.5 rounded-full ${
                  cat.active ? "text-neutral-800" : "text-neutral-400"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-2 py-4 rounded-full bg-[#262626] text-white text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-md active:scale-95">
        Explore More
      </button>
    </div>
  );
};

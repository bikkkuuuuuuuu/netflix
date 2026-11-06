import React, { useContext, useEffect, useState } from "react";
import {
  Plus,
  Check,
  Edit3,
  Settings,
  Clock3,
  Film,
  Heart,
  CalendarDays,
  Trophy,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MovieSlider from "@/components/Cards/cards";
import { Movie, WatchHistory } from "@/types/data";
import { AuthContext } from "@/context/auth-context";
import { UserType } from "@/services/auth.service";
import { formatDateString, normalizeMovie } from "@/lib/utils";
import watchSvc from "@/services/watchlist.service";
import watchHistorySvc from "@/services/watchHistory.service";

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => {
  return (
    <div className="rounded-[22px] bg-[#18191c] border border-white/[0.06] p-5">
      <div className="h-9 w-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-neutral-300 mb-4">
        {icon}
      </div>

      <div className="text-xl font-black text-white tracking-tight">
        {value}
      </div>

      <p className="text-[10px] text-neutral-500 font-medium mt-1">{label}</p>
    </div>
  );
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AuthContext) as {
    loggedInUser: UserType | null;
    isLoading: boolean;
  };

  const [activeTab, setActiveTab] = useState<
    "overview" | "watchlist" | "activity"
  >("overview");

  const [recentlyWatched, setRecentlyWatched] = useState<WatchHistory[]>([]);
  const [watchList, setWatchList] = useState<Movie[]>([]);

  const [isFollowing, setIsFollowing] = useState(false);

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
      console.log(watchList);
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    fetchWatchList();
    fetchRecentlyWatched();
  }, []);

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

  return (
    <div className="min-h-full flex flex-col flex-1 text-white p-3">
      <div
        className="max-w-full mx-0 sm:mx-6 space-y-5 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* PROFILE HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#18191c] border border-white/[0.06]">
          {/* Ambient background */}
          <div className="absolute inset-0">
            <div className="absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full bg-white/[0.035] blur-3xl" />

            <div className="absolute -bottom-40 left-1/3 w-[400px] h-[300px] rounded-full bg-white/[0.025] blur-3xl" />
          </div>

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src="https://i.pravatar.cc/300?img=12"
                  alt="Bikash Pandey"
                  className="h-28 w-28 md:h-32 md:w-32 rounded-[30px] object-cover border-2 border-white/10 shadow-2xl"
                />

                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white text-black flex items-center justify-center border-4 border-[#18191c]">
                  <Check className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Profile info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  {loggedInUser?.name}
                </h1>

                <p className="text-sm text-neutral-500 mt-1">
                  {loggedInUser?.username}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-5 text-[14px] text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined{" "}
                    {
                      formatDateString(loggedInUser?.createdAt as string).split(
                        "at",
                      )[0]
                    }
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5" />
                    124 titles watched
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isFollowing
                      ? "bg-white text-black"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Following
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      Follow
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Profile navigation */}
          <div className="relative border-t border-white/[0.06] px-5 md:px-8">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {[
                {
                  id: "overview",
                  label: "Overview",
                },
                {
                  id: "watchlist",
                  label: "Watchlist",
                },
                {
                  id: "activity",
                  label: "Activity",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "overview" | "watchlist" | "activity",
                    )
                  }
                  className={`relative py-4 text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {tab.label}

                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Film className="h-4 w-4" />}
                value="124"
                label="Movies & shows watched"
              />

              <StatCard
                icon={<Clock3 className="h-4 w-4" />}
                value="86h"
                label="Total watch time"
              />

              <StatCard
                icon={<Heart className="h-4 w-4" />}
                value="37"
                label="Titles liked"
              />

              <StatCard
                icon={<Trophy className="h-4 w-4" />}
                value="12"
                label="Watch achievements"
              />
            </div>

            {/* CONTINUE WATCHING */}
            <MovieSlider
              title="Continue Watching"
              mapItems={3}
              MOVIES={recentlyWatchedMovies}
            />

            {/* WATCHLIST PREVIEW */}
            <MovieSlider title="My watchlist" mapItems={3} MOVIES={watchList} />
          </>
        )}

        {/* WATCHLIST */}
        {activeTab === "watchlist" && (
          <MovieSlider title="My watchlist" mapItems={3} MOVIES={watchList} />
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pb-4">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-white transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            Account Settings
          </button>

          <button className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-white transition-colors">
            <Share2 className="h-3.5 w-3.5" />
            Share Profile
          </button>
        </div>
      </div>
    </div>
  );
}

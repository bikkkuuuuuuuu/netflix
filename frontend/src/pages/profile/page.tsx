import React, { useState } from "react";
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
import MovieSlider, { Movie } from "@/components/Cards/cards";

const MOVIES: Movie[] = [
  {
    id: "ladybug",
    title: "Ladybug & Cat Noir: Awakening",
    genre: "Adventure",
    description:
      "Ordinary teenager Marinette's life in Paris goes superhuman when she becomes Ladybug, joining forces with Cat Noir to save the city from a villain.",
    posterUrl:
      "https://m.media-amazon.com/images/I/61Dbbnf52DL._AC_UF894,1000_QL80_.jpg",
    rating: "PG",
    year: "2023",
    duration: "1h 45m",
  },
  {
    id: "mario",
    title: "The Super Mario Bros. Movie",
    genre: "Action",
    description:
      "A plumber named Mario travels through an underground labyrinth with his brother, Luigi, trying to save a captured princess from Bowser.",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BOWFmNmY2YjAtZTgyNy00MjBmLWI1YWMtMjFjZjkxYjYyOTVmXkEyXkFqcGc@._V1_.jpg",
    rating: "PG",
    year: "2023",
    duration: "1h 32m",
  },
  {
    id: "spiderman",
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Adventure",
    description:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    posterUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xoOS6YiMcxPk1wgwnF3WvkAUxsQXVpJ3EaGwlJOe75uNdY1njVgi5t8&s=10",
    rating: "PG-13",
    year: "2023",
    duration: "2h 20m",
  },
  {
    id: "elemental",
    title: "Elemental",
    genre: "Comedy",
    description:
      "Follows Ember and Wade, in a city where fire-, water-, land- and air-residents live together and discover how much they actually have in common.",
    posterUrl:
      "https://artofthemovies.co.uk/cdn/shop/products/IMG_0735_incinemas-219707.jpg?v=1674596999&width=900",
    rating: "PG",
    year: "2023",
    duration: "1h 41m",
  },
];

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

  const [activeTab, setActiveTab] = useState<
    "overview" | "watchlist" | "activity"
  >("overview");

  const [isFollowing, setIsFollowing] = useState(false);

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
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-[9px] uppercase tracking-[0.15em] font-bold text-neutral-400">
                    Movie Enthusiast
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-white text-black text-[9px] uppercase tracking-[0.15em] font-black">
                    Free
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  Bikash Pandey
                </h1>

                <p className="text-sm text-neutral-500 mt-1">@bikashpandey</p>

                <p className="text-xs text-neutral-400 max-w-xl mt-4 leading-relaxed">
                  Exploring stories, strange worlds and everything in between.
                  Mostly watching sci-fi, thrillers and mysteries.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-5 text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined September 2026
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
              MOVIES={MOVIES}
            />

            {/* WATCHLIST PREVIEW */}
            <MovieSlider title="My watchlist" mapItems={3} MOVIES={MOVIES} />
          </>
        )}

        {/* WATCHLIST */}
        {activeTab === "watchlist" && (
          <MovieSlider title="My watchlist" mapItems={3} MOVIES={MOVIES} />
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

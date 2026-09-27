import { ChevronDown, Play } from "lucide-react";

type TrendingAnime = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

type RecentlyWatched = {
  id: number;
  title: string;
  episode?: string;
  image: string;
  progress?: number;
};

const trendingAnime: TrendingAnime[] = [
  {
    id: 1,
    title: "One Piece",
    subtitle: "Attack of the Fanboy",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=85",
  },

  {
    id: 3,
    title: "My Neighbor Totoro",
    subtitle: "Studio Ghibli",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85",
  },
];

const recentlyWatched: RecentlyWatched[] = [
  {
    id: 1,
    title: "My Neighbor Totoro",
    episode: "Episode 01",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
    progress: 72,
  },
  {
    id: 2,
    title: "Hotel Transylvania",
    episode: "Transformation",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80",
    progress: 48,
  },
  {
    id: 3,
    title: "Demon Slayer",
    episode: "Episode 12",
    image:
      "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&w=300&q=80",
    progress: 31,
  },
];

const PlayButton = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const isSmall = size === "sm";

  return (
    <button
      className={`
        absolute right-2.5 bottom-2.5
        flex items-center justify-center
        rounded-full
        bg-white/20
        backdrop-blur-xl
        border border-white/20
        text-white
        shadow-lg
        transition-all duration-300
        hover:bg-white/30
        hover:scale-105
        active:scale-95
        ${isSmall ? "h-7 w-7" : "h-9 w-9"}
      `}
    >
      <Play
        size={isSmall ? 11 : 14}
        fill="currentColor"
        strokeWidth={0}
        className="translate-x-[1px]"
      />
    </button>
  );
};

export default function RightSidebar() {
  return (
    <div
      className="
      mt-3
          rounded-[24px]
          bg-[#121316]
          px-4
          py-6
          h-[95%]
        "
    >
      {/* =========================
            TRENDING
        ========================== */}
      <section>
        {/* Header */}
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[18px] font-medium tracking-tight text-white">
              Trending
            </h2>
          </div>

          <button
            className="
                flex items-center gap-1
                text-[11px]
                font-medium
                text-white/40
                transition-colors
                hover:text-white/70
              "
          >
            Sort By
            <span className="text-white/60">Anime</span>
            <ChevronDown size={9} />
          </button>
        </div>

        {/* Trending Cards */}
        <div className="space-y-3">
          {trendingAnime.map((anime) => (
            <article
              key={anime.id}
              className="
                  group
                  relative
                  aspect-[3/2]
                  overflow-hidden
                  rounded-[15px]
                  bg-black/20
                  cursor-pointer
                "
            >
              {/* Image */}
              <img
                src={anime.image}
                alt={anime.title}
                className="
                    absolute inset-0
                    h-full w-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.04]
                  "
              />

              {/* Dark bottom gradient */}
              <div
                className="
                    absolute inset-x-0 bottom-0
                    h-[55%]
                    bg-gradient-to-t
                    from-black/75
                    via-black/35
                    to-transparent
                  "
              />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 pr-12">
                <h3 className="truncate text-[16px] font-medium text-white">
                  {anime.title} :
                </h3>

                <p className="truncate text-[12px] leading-tight text-white/80">
                  {anime.subtitle}
                </p>
              </div>

              {/* Play */}
              <PlayButton />
            </article>
          ))}
        </div>
      </section>

      <div className="my-4 h-px bg-white/10" />

      {/* =========================
            RECENTLY WATCHED
        ========================== */}
      <section>
        {/* Header */}
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[18px] font-medium tracking-tight text-white">
              Recently Watched
            </h2>
          </div>

          <button
            className="
                flex items-center gap-1
                text-[12px]
                font-medium
                text-white/40
                transition-colors
                hover:text-white/70
              "
          >
            Sort By
            <span className="text-white/60">Today</span>
            <ChevronDown size={9} />
          </button>
        </div>

        {/* Recently Watched */}
        <div className="space-y-2.5">
          {recentlyWatched.map((anime) => (
            <article
              key={anime.id}
              className="
                  group
                  flex
                  items-center
                  gap-2.5
                  rounded-xl
                  p-1.5
                  transition-colors
                  hover:bg-white/[0.06]
                  cursor-pointer
                "
            >
              {/* Thumbnail */}
              <div
                className="
                    relative
                    h-[50px]
                    w-[72px]
                    shrink-0
                    overflow-hidden
                    rounded-[7px]
                    bg-black/20
                  "
              >
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="
                      h-full w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                />

                {/* Progress */}
                {anime.progress !== undefined && (
                  <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-[2px]
                        bg-white/20
                      "
                  >
                    <div
                      className="h-full bg-white"
                      style={{
                        width: `${anime.progress}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[14px] font-medium text-white/90">
                  {anime.title}
                </h3>

                {anime.episode && (
                  <p className="mt-0.5 truncate text-[12px] text-white/40">
                    {anime.episode}
                  </p>
                )}
              </div>

              {/* Play */}
              <div
                className="
                    flex h-7 w-7
                    shrink-0
                    items-center justify-center
                    rounded-full
                    bg-white/10
                    text-white/70
                    transition-all
                    group-hover:bg-white/20
                  "
              >
                <Play
                  size={10}
                  fill="currentColor"
                  strokeWidth={0}
                  className="translate-x-[1px]"
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

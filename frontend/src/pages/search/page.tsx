import MovieSlider from "@/components/Cards/cards";
import RightSidebar from "@/components/RightSideBar/sidebar";
import { MOVIES, SuggestedMovies } from "@/data/movies";
import { Command, Search } from "lucide-react";
import { useState } from "react";

const SearchPage = () => {
  type Filter = {
    id: string;
    label: string;
    icon?: React.ReactNode;
  };

  const filters: Filter[] = [
    {
      id: "all",
      label: "All Results",
    },
    {
      id: "movie",
      label: "Movies",
    },
    {
      id: "tv",
      label: "TV Shows",
    },
    {
      id: "trending",
      label: "Trending",
    },
    {
      id: "top_rated",
      label: "IMDb 8.5+",
    },
    {
      id: "4k",
      label: "UHD",
    },
  ];
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex-1 h-[100vh] flex flex-col xl:flex-row  overflow-hidden relative">
      <main
        className="flex-1 flex flex-col h-full overflow-y-auto pb-6 p-3 space-y-6"
        style={{
          scrollbarWidth: "none",
        }}
      >
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-0  rounded-4xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>

            <div className="relative flex items-center glass-panel rounded-[2rem] p-2.5 sm:p-3 pl-6 pr-4 shadow-2xl border border-white/10 focus-within:border-indigo-500/80 transition-all duration-300">
              <Search className="h-5 w-5 mx-4 text-slate-400 " />
              <input
                type="text"
                id="searchInput"
                placeholder="Search movies, TV shows, actors, directors..."
                className="w-full bg-transparent text-white border border-slate-800/60 placeholder-slate-400 text-base sm:text-lg focus:outline-none font-medium"
                // autocomplete="off"
              />

              <button
                id="clearSearchBtn"
                className="hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-all mr-2"
              >
                <i className="ph-bold ph-x text-lg"></i>
              </button>

              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl   bg-[#121316]
                text-white/50
                border-white/[0.08]
                hover:bg-white/[0.06]
                hover:text-white/90
                hover:border-white/[0.14] text-xs font-mono select-none"
              >
                <Command className="h-4 w-4" />
                <span>K</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            {/* Filter buttons */}
            <div
              className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1"
              id="filterChipsContainer"
            >
              {filters.map((filter) => {
                const isActive = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    type="button"
                    data-filter={filter.id}
                    className={`
          shrink-0
          flex items-center gap-2
          rounded-3xl
          px-6 py-2.5
          text-xs sm:text-sm
          font-medium
          border
          transition-all duration-300
          active:scale-[0.97]

          ${
            isActive
              ? `
                bg-white
                text-[#121316]
                border-white
                shadow-sm
                `
              : `
                bg-[#121316]
                text-white/50
                border-white/[0.08]
                hover:bg-white/[0.06]
                hover:text-white/90
                hover:border-white/[0.14]
                `
          }
        `}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <MovieSlider title="Search Results" MOVIES={MOVIES} />

        <MovieSlider mapItems={3} MOVIES={MOVIES} />
        <MovieSlider
          mapItems={3}
          title="Suggested For You"
          MOVIES={SuggestedMovies}
        />

        <div
          id="emptyState"
          className="hidden flex-col items-center justify-center py-20 text-center space-y-4 glass-panel rounded-4xl p-8 border border-dashed border-slate-700/80"
        >
          <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-2">
            <i className="ph-duotone ph-film-slash text-4xl text-indigo-400"></i>
          </div>
          <h3 className="text-xl font-bold text-white">
            No Matching Titles Found
          </h3>
          <p className="text-slate-400 max-w-md text-sm">
            We couldn't find anything matching your current query or active
            filters. Try adjusting your search term or clearing genres.
          </p>
          <button
            id="clearFiltersAction"
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all mt-2"
          >
            Clear All Filters
          </button>
        </div>
      </main>

      <aside className="w-full  xl:w-80 lg:w-90  flex flex-col gap-6 shrink-0 overflow-y-hidden">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default SearchPage;

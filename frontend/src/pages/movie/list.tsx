import Banner from "@/components/Banner/banner";
import MovieSlider from "@/components/Cards/cards";
import RightSidebar from "@/components/RightSideBar/sidebar";
import { MOVIES, SuggestedMovies } from "@/data/movies";

const MovieListPage = () => {
  return (
    <>
      <div className="flex-1 h-[100vh] flex flex-col xl:flex-row  overflow-hidden relative">
        <main
          className="flex-1 flex flex-col h-full overflow-y-auto pb-6 p-3 space-y-6"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <Banner />
          <MovieSlider mapItems={3} MOVIES={MOVIES} />
          <MovieSlider
            mapItems={3}
            title="Suggested For You"
            MOVIES={SuggestedMovies}
          />
          <MovieSlider mapItems={3} title="Popular" MOVIES={MOVIES} />
        </main>

        <aside className="w-full  xl:w-80 lg:w-90  flex flex-col gap-6 shrink-0 overflow-y-hidden">
          <RightSidebar />
        </aside>
      </div>
    </>
  );
};
export default MovieListPage;

import Banner from "@/components/Banner/banner";
import MovieSlider from "@/components/Cards/cards";
import RightSidebar from "@/components/RightSideBar/sidebar";
import { SuggestedMovies } from "@/data/movies";
import { normalizeMovies } from "@/lib/utils";
import movieSvc from "@/services/movie.service";
// import watchHistorySvc from "@/services/watchHistory.service";
import { Movie } from "@/types/data";
import { useEffect, useState } from "react";

const MovieListPage = () => {
  const [newlyArrived, setNewlyArrived] = useState<Movie[] | []>([]);
  const [movies, setMovies] = useState<Movie[] | []>([]);
  // const [recentlyWatched, setRecentlyWatched] = useState<any[]>([]);

  const fetchforHome = async () => {
    try {
      const response = await movieSvc.home(6, "");
      const moviesWithUrls = normalizeMovies(response.detail);
      setMovies(moviesWithUrls);
      console.log(movies);
    } catch (exception) {
      console.log(exception);
    }
  };
  const fetchNewlyArrived = async (limit = 6) => {
    try {
      const response = await movieSvc.newlyArrived(limit);
      const movies = normalizeMovies(response.detail.slice(2, 6));
      setNewlyArrived(movies);
    } catch (exception) {
      console.log(exception);
    }
  };

  // const fetchSuggested = async () => {
  //   try {
  //     const response = await movieSvc.suggested();
  //     // setRecentlyWatched(response.detail);

  //     console.log(response);
  //   } catch (exception) {
  //     console.log(exception);
  //   }
  // };

  // const fetchRecentlyWatched = async () => {
  //   try {
  //     const response = await watchHistorySvc.fetchRecentWatches();
  //     setRecentlyWatched(response.detail);
  //   } catch (exception) {
  //     console.log(exception);
  //   }
  // };
  useEffect(() => {
    fetchNewlyArrived(6);
    fetchforHome();
  }, []);
  return (
    <>
      <div className="flex-1 h-[100vh] flex flex-col xl:flex-row  overflow-hidden relative">
        <main
          className="flex-1 flex flex-col h-full overflow-y-auto pb-6 p-3 space-y-6"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <Banner
            img={
              "https://cdn.mos.cms.futurecdn.net/MXJNXopRjWPDzCeAdFide6-1920-80.jpg"
            }
          />
          <MovieSlider mapItems={3} MOVIES={newlyArrived} />
          <MovieSlider
            mapItems={3}
            title="Suggested For You"
            MOVIES={SuggestedMovies}
          />
          <MovieSlider mapItems={3} title="Popular" MOVIES={movies} />
        </main>

        <aside className="w-full  xl:w-80 lg:w-90  flex flex-col gap-6 shrink-0 overflow-y-hidden">
          <RightSidebar />
        </aside>
      </div>
    </>
  );
};
export default MovieListPage;

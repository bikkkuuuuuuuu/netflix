import HttpService from "@/services/http.service";

class WatchListService extends HttpService {
  addtoWatchList = async (movieId: string) => {
    try {
      const response = await this.postRequest(
        "/saved",
        { movie: movieId },
        {
          auth: true,
        },
      );
      return response.data;
    } catch (exception) {
      throw exception;
    }
  };
  listMyWatchList = async () => {
    try {
      const response = await this.getRequest("/saved/", { auth: true });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };

  removeFromSaved = async (id: string) => {
    try {
      const response = await this.deleteRequest("/saved/" + id, {
        auth: true,
      });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };
}

const watchSvc = new WatchListService();
export default watchSvc;

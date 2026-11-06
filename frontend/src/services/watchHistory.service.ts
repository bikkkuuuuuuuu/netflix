import HttpService from "@/services/http.service";

class WatchHistoryService extends HttpService {
  updateProgress = async (data: any) => {
    try {
      const response = await this.postRequest("/watch-history", data, {
        auth: true,
      });
      return response.data;
    } catch (exception) {
      throw exception;
    }
  };
  fetchRecentWatches = async () => {
    try {
      const response = await this.getRequest("/watch-history", { auth: true });
      return response.data;
    } catch (exception) {
      throw exception;
    }
  };
}

const watchHistorySvc = new WatchHistoryService();
export default watchHistorySvc;

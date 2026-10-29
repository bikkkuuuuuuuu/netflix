import HttpService from "@/services/http.service";

class WatchHistoryService extends HttpService {
  create = async (data: any) => {
    try {
      const response = await this.postRequest("/watch/create", data, {
        files: true,
      });
      return response.data;
    } catch (exception) {
      throw exception;
    }
  };
  list = async (limit = 20, search: string) => {
    try {
      const response = await this.getRequest("/watch/list", {
        auth: true,
        params: {
          limit: limit,
          search: search,
        },
      });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };

  detail = async (id: string) => {
    try {
      const response = await this.getRequest("/watch/" + id, {
        auth: true,
      });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };
  delete = async (id: string) => {
    try {
      const response = await this.deleteRequest("/watch/" + id, {
        auth: true,
      });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };
  update = async (id: string, data: any) => {
    try {
      const response = await this.patchRequest("/watch/" + id, data, {
        auth: true,
        files: true,
      });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };
}

const watchHistorySvc = new WatchHistoryService();
export default watchHistorySvc;

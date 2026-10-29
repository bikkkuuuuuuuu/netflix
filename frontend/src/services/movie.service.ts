import HttpService from "@/services/http.service";
type MovieUploadOptions = {
  onProgress?: (progress: number) => void;
};
class MovieService extends HttpService {
  create = async (data: any, options?: MovieUploadOptions) => {
    try {
      const response = await this.postRequest("/movies/upload", data, {
        files: true,
        auth: true,
        onUploadProgress: (event: { loaded: number; total?: number }) => {
          console.log("Upload event:", event.loaded, event.total);
          if (!event.total) return;
          const progress = Math.min(
            100,
            Math.round((event.loaded / event.total) * 100),
          );
          options?.onProgress?.(progress);
        },
      });
      return response.data;
    } catch (exception) {
      throw exception;
    }
  };
  list = async (limit = 20, search: string) => {
    try {
      const response = await this.getRequest("/movies/list", {
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
  suggested = async (limit = 20, search: string) => {
    try {
      const response = await this.getRequest("/movies/suggestions", {
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
  newlyArrived = async (limit = 20, search: string) => {
    try {
      const response = await this.getRequest("/movies/new", {
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
      const response = await this.getRequest("/movies/" + id, {
        auth: true,
      });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };
  delete = async (id: string) => {
    try {
      const response = await this.deleteRequest("/movies/" + id, {
        auth: true,
      });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };
  update = async (id: string, data: any) => {
    try {
      const response = await this.patchRequest("/movies/" + id, data, {
        auth: true,
        files: true,
      });
      return response.data;
    } catch (exception) {
      console.log(exception);
    }
  };
}

const movieSvc = new MovieService();
export default movieSvc;

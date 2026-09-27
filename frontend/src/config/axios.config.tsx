import { authEvent } from "@/lib/authEvent";
import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 30000,
  timeoutErrorMessage: "Server timeout, please try again later.",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface AxiosCustomResponse {
  detail?: any;
  data?: any;
  message?: string;
  options?: any;
  status: string;
}
interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AUTH_IGNORE_ROUTES = ["/login", "/register", "refresh"];

const handleAuthError = (status?: string, message?: string) => {
  localStorage.removeItem("token");
  localStorage.removeItem("refToken");

  localStorage.removeItem("user");

  if (status === "TOKEN_EXPIRED") {
    authEvent.emit("auth", {
      type: "TOKEN_EXPIRED",
      message: "Your session expired. Please login again.",
    });
    return;
  }

  authEvent.emit("auth", {
    type: "LOGIN_REQUIRED",
    message: message || "Please login to continue.",
  });
};
const shouldIgnoreAuthRoute = (url = "") => {
  return AUTH_IGNORE_ROUTES.some((route) => url.includes(route));
};
let isRefreshing = false;

let refreshSubscribers: Array<(token: string | null) => void> = [];

const subscribeTokenRefresh = (callback: (token: string | null) => void) => {
  refreshSubscribers.push(callback);
};
const notifyRefreshSubscribers = (token: string | null) => {
  refreshSubscribers.forEach((callback) => callback(token));

  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refToken");

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const response = await axios.get(
    `${import.meta.env.VITE_APP_API_URL}/auth/refresh`,
    {
      headers: {
        refresh: "Bearer " + refreshToken,
      },
    },
  );

  /*
    Adjust this if your backend response differs.

    Expected:
    {
      detail: {
        accessToken: "..."
      }
    }
  */

  const newAccessToken = response.data?.detail?.accessToken;

  if (!newAccessToken) {
    throw new Error("New access token was not returned by refresh API");
  }

  localStorage.setItem("token", newAccessToken);

  return newAccessToken;
};

const retryRequest = (request: RetryAxiosRequestConfig, token: string) => {
  request.headers = request.headers || {};

  request.headers.Authorization = `Bearer ${token}`;

  return axiosInstance(request);
};

async function handleTokenRefresh(originalRequest: RetryAxiosRequestConfig) {
  /*
    Prevent infinite loops.

    Example:

    /auth/me → 401
    refresh → new token
    /auth/me → 401 again

    Second 401 means logout.
  */

  if (originalRequest._retry) {
    handleAuthError(
      "TOKEN_EXPIRED",
      "Your session expired. Please login again.",
    );

    return Promise.reject(
      new Error("Authentication failed after token refresh"),
    );
  }

  originalRequest._retry = true;

  /*
    If another request is already refreshing,
    wait for it instead of calling /auth/refresh again.
  */

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((token) => {
        if (!token) {
          reject(new Error("Unable to refresh access token"));

          return;
        }

        resolve(retryRequest(originalRequest, token));
      });
    });
  }

  isRefreshing = true;

  try {
    const newAccessToken = await refreshAccessToken();

    notifyRefreshSubscribers(newAccessToken);

    return retryRequest(originalRequest, newAccessToken);
  } catch (error) {
    notifyRefreshSubscribers(null);

    handleAuthError(
      "TOKEN_EXPIRED",
      "Your session expired. Please login again.",
    );

    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}
axiosInstance.interceptors.response.use(
  async (response: any) => {
    const apiStatus = response?.data?.status;
    const url = response?.config?.url || "";
    if (apiStatus !== "TOKEN_EXPIRED" || shouldIgnoreAuthRoute(url)) {
      return response;
    }

    const originalRequest = response.config as RetryAxiosRequestConfig;

    return handleTokenRefresh(originalRequest);
  },
  async (error) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;
    const statusCode = error?.response?.status;
    const apiStatus = error?.response?.data?.status;
    const message = error?.response?.data?.message;
    const url = error?.config?.url || "";

    if (shouldIgnoreAuthRoute(url) || !originalRequest) {
      return Promise.reject(error);
    }

    const isTokenError =
      statusCode === 401 ||
      apiStatus === "TOKEN_EXPIRED" ||
      (apiStatus === "INTERNAL_SERVER_ERROR" && message === "jwt malformed");

    if (!isTokenError) {
      return Promise.reject(error);
    }

    try {
      return await handleTokenRefresh(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export const get = async (url: string, config: any = {}) =>
  axiosInstance.get(url, config);
export const post = async (url: string, data: any = {}, config: any = {}) =>
  axiosInstance.post(url, data, config);

export default axiosInstance;

import { FC, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import SignInPage from "@/pages/login/login";
import LoginPage from "@/pages/login/login";
import AuthLayout from "@/pages/auth/authlayout";
import SignInPage from "@/pages/signup/signinpage";
import ForgotPasswordPage from "@/pages/forgot-password/forgot";
import DetailPage from "@/pages/movie/detail";
import HomeLayout from "@/pages/layout/homeLayout";
import HomePage from "@/pages/home/page";
import AdminUpload from "@/pages/admin/upload";
import SearchPage from "@/pages/search/page";
import MovieListPage from "@/pages/movie/list";
import SettingsPage from "@/pages/settings/page";
import ProfilePage from "@/pages/profile/page";
import WrapperLayout from "@/pages/layout/wrapperLayout";
import MOMOGUYS from "@/pages/momoguys/page";
import Player from "@/pages/player/page";
import Library from "@/pages/admin/library";
import AdminMovieDetail from "@/pages/admin/movie";
import AdminActivity from "@/pages/admin/activity";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminWorkers from "@/pages/admin/workers";
import AdminPlayback from "@/pages/admin/playback";
import Admin from "@/pages/admin/admin";
import AdminStorage from "@/pages/admin/storage";
import AdminUsers from "@/pages/admin/users";
import AdminUserDetail from "@/pages/admin/userdetail";
import SeriesUpload from "@/pages/admin/series";
import CastProfilePage from "@/pages/cast/profile";

const Routing: FC = () => {
  const router = createBrowserRouter([
    {
      path: "",
      element: <WrapperLayout />,
      children: [
        {
          path: "/",
          element: <HomeLayout />,
          children: [
            { path: "/", element: <HomePage />, index: true },
            {
              path: "detail/:id",
              element: <DetailPage />,
            },
            {
              path: "upload",
              element: <AdminUpload />,
            },
            {
              path: "/admin",
              element: <Admin />,
            },
            {
              path: "series",
              element: <SeriesUpload />,
            },
            {
              path: "cast",
              element: <CastProfilePage />,
            },

            {
              path: "search",
              element: <SearchPage />,
            },
            {
              path: "movies",
              element: <MovieListPage />,
            },
            {
              path: "tv",
              element: <MovieListPage />,
            },
            {
              path: "settings",
              element: <SettingsPage />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
            {
              path: "watch/:id",
              element: <Player />,
            },
            {
              path: "library",
              element: <Library />,
            },
            {
              path: "library/:id",
              element: <AdminMovieDetail />,
            },
            {
              path: "activity",
              element: <AdminActivity />,
            },
            {
              path: "anal",
              element: <AdminAnalytics />,
            },
            {
              path: "workers",
              element: <AdminWorkers />,
            },
            {
              path: "playback",
              element: <AdminPlayback />,
            },
            {
              path: "storage",
              element: <AdminStorage />,
            },
            {
              path: "users",
              element: <AdminUsers />,
            },
            {
              path: "userdetail",
              element: <AdminUserDetail />,
            },
          ],
        },

        {
          path: "/auth",
          element: <AuthLayout />,
          children: [
            {
              path: "login",
              element: <LoginPage />,
              index: true,
            },
            {
              path: "sign-in",
              element: <SignInPage />,
            },
            {
              path: "forgot-password",
              element: <ForgotPasswordPage />,
            },
          ],
        },
      ],
    },
    {
      path: "/momoguys",
      element: <MOMOGUYS />,
    },
  ]);

  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
};

export default Routing;

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
import AdminList from "@/pages/admin/list";
import AdminUpload from "@/pages/admin/upload";
import SearchPage from "@/pages/search/page";
import MovieListPage from "@/pages/movie/list";
import SettingsPage from "@/pages/settings/page";
import ProfilePage from "@/pages/profile/page";
import WrapperLayout from "@/pages/layout/wrapperLayout";

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
              path: "detail",
              element: <DetailPage />,
            },
            {
              path: "upload",
              element: <AdminUpload />,
            },
            {
              path: "/admin",
              element: <AdminList />,
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

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  // if (isLoggedIn) {
  //     return <Navigate to={"/app"} />;
  // }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;

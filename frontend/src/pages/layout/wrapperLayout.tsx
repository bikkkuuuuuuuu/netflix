import AuthModalProvider from "@/components/modal/modal";
import { AuthProvider } from "@/context/auth-context";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ScrollToTop } from "@/components/scroll/scrollToTop";
import FeatureNotImplementedProvider from "@/components/modal/notdeveloped";
import { DeleteModalProvider } from "@/components/modal/deleteModal";
import { PlayerProvider } from "@/context/player-context";

const WrapperLayout = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <DeleteModalProvider>
          <Outlet />
          <AuthModalProvider />
          <ScrollToTop />
          <FeatureNotImplementedProvider />
          <Toaster />
        </DeleteModalProvider>
      </PlayerProvider>
    </AuthProvider>
  );
};
export default WrapperLayout;

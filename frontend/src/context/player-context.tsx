import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface NowPlayingState {
  movieId: string | null;
  title: string;
  poster?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface PlayerControls {
  togglePlay: () => void;
  seek: (seconds: number) => void;
}

interface PlayerContextType {
  nowPlaying: NowPlayingState;
  setNowPlaying: (state: Partial<NowPlayingState>) => void;
  registerControls: (controls: PlayerControls | null) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
}

const initialState: NowPlayingState = {
  movieId: null,
  title: "",
  poster: undefined,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [nowPlaying, setNowPlayingState] =
    useState<NowPlayingState>(initialState);

  const controlsRef = useRef<PlayerControls | null>(null);

  const setNowPlaying = (state: Partial<NowPlayingState>) => {
    setNowPlayingState((previous) => ({
      ...previous,
      ...state,
    }));
  };

  const registerControls = (controls: PlayerControls | null) => {
    controlsRef.current = controls;
  };

  const togglePlay = () => {
    controlsRef.current?.togglePlay();
  };

  const seek = (seconds: number) => {
    controlsRef.current?.seek(seconds);
  };

  return (
    <PlayerContext.Provider
      value={{
        nowPlaying,
        setNowPlaying,
        registerControls,
        togglePlay,
        seek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const useNowPlaying = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("useNowPlaying must be used within PlayerProvider");
  }

  return context;
};

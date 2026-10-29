import videojs from "video.js";
import "video.js/dist/video-js.css";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings2,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:9005"
).replace(/\/$/, "");

interface SubtitleTrack {
  label: string;

  language: string;

  src: string;

  default?: boolean;
}

interface PlaybackResponse {
  title: string;

  episodeTitle?: string | null;

  hlsUrl: string;

  poster?: string;

  subtitles?: SubtitleTrack[];
}

const SAMPLE_PLAYBACK: PlaybackResponse = {
  title: "Big Buck Bunny",
  episodeTitle: "A Sample Movie",
  // Public HLS test stream. Replace this with your own stream later.
  hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  subtitles: [],
};

type QualityLevel = {
  width?: number;
  height?: number;
  bitrate?: number;
  enabled: boolean;
};

type AudioTrack = {
  id?: string;
  label?: string;
  language?: string;
  enabled: boolean;
};

type VhsRepresentation = {
  width?: number;
  height?: number;
  bandwidth?: number;
  enabled: (enabled?: boolean) => boolean | void;
};

const getVhsRepresentations = (player: any): VhsRepresentation[] => {
  try {
    const tech = player.tech(true) as unknown as {
      vhs?: { representations?: () => VhsRepresentation[] };
    };

    return tech.vhs?.representations?.() ?? [];
  } catch {
    return [];
  }
};

type MenuName = "quality" | "audio" | "subtitles" | "speed" | null;

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getAbsoluteUrl = (url: string) => {
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("blob:")) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;

  return "An unexpected error occurred.";
};

const Player = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<PlayerType | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [playback, setPlayback] = useState<PlaybackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [menu, setMenu] = useState<MenuName>(null);
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [selectedAudio, setSelectedAudio] = useState(0);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>("off");
  const [hasStarted, setHasStarted] = useState(false);
  const subtitleTracks = playback?.subtitles ?? [];

  // Fetch playback information for the route's movie ID.

  // useEffect(() => {

  //   if (!movieId) {

  //     setError("No movie ID was provided.");

  //     setLoading(false);

  //     return;

  //   }

  //   const controller = new AbortController();

  //   const fetchPlayback = async () => {

  //     setLoading(true);

  //     setError("");

  //     setPlayback(null);

  //     try {

  //       const response = await fetch(

  //         `${API_BASE_URL}/api/v1/movies/${encodeURIComponent(

  //           movieId,

  //         )}/playback`,

  //         {

  //           method: "GET",

  //           credentials: "include",

  //           signal: controller.signal,

  //           headers: {

  //             Accept: "application/json",

  //           },

  //         },

  //       );

  //       if (!response.ok) {

  //         const body = await response.json().catch(() => null);

  //         throw new Error(

  //           body?.message ??

  //             body?.error ??

  //             `Unable to load playback information (${response.status}).`,

  //         );

  //       }

  //       const data: PlaybackResponse = await response.json();

  //       if (!data.hlsUrl || !data.title) {

  //         throw new Error(

  //           "The playback response is missing the movie title or HLS URL.",

  //         );

  //       }

  //       setPlayback({

  //         ...data,

  //         hlsUrl: getAbsoluteUrl(data.hlsUrl),

  //         poster: data.poster ? getAbsoluteUrl(data.poster) : undefined,

  //         subtitles: (data.subtitles ?? []).map((track) => ({

  //           ...track,

  //           src: getAbsoluteUrl(track.src),

  //         })),

  //       });

  //     } catch (fetchError) {

  //       if (controller.signal.aborted) return;

  //       setError(getErrorMessage(fetchError));

  //     } finally {

  //       if (!controller.signal.aborted) {

  //         setLoading(false);

  //       }

  //     }

  //   };

  //   void fetchPlayback();

  //   return () => controller.abort();

  // }, [movieId]);

  useEffect(() => {
    setLoading(true);

    setError("");

    const timeout = window.setTimeout(() => {
      setPlayback(SAMPLE_PLAYBACK);

      setLoading(false);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [movieId]);
  const togglePlay = useCallback(() => {
    const player = playerRef.current;

    if (!player || player.isDisposed()) return;

    if (player.paused()) {
      void player.play()?.catch(() => {
        setError(
          "Playback could not start. Check that the video is available and try again.",
        );
      });
    } else {
      player.pause();
    }
  }, []);
  const seekBy = useCallback((seconds: number) => {
    const player = playerRef.current;

    if (!player || player.isDisposed()) return;

    const current = player.currentTime() ?? 0;

    const total = player.duration();

    if (!Number.isFinite(total)) return;

    player.currentTime(Math.max(0, Math.min(total, current + seconds)));
  }, []);

  containerRef?.current?.requestFullscreen();
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;

    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch (fullscreenError) {
      console.error("Fullscreen error:", fullscreenError);
    }
  }, []);

  // Create and dispose Video.js whenever the loaded stream changes.

  useEffect(() => {
    const videoElement = videoElementRef.current;

    if (!videoElement || !playback?.hlsUrl) return;

    setError("");

    setHasStarted(false);

    setCurrentTime(0);

    setDuration(0);

    setIsPlaying(false);

    setIsBuffering(true);

    setQualityLevels([]);

    setSelectedQuality("auto");

    setAudioTracks([]);

    setSelectedAudio(0);

    setSelectedSubtitle("off");

    const player = videojs(videoElement, {
      controls: false,

      autoplay: false,

      preload: "auto",

      fluid: false,

      responsive: true,

      playsinline: true,

      poster: playback.poster,

      liveui: false,

      html5: {
        vhs: {
          overrideNative: true,

          enableLowInitialPlaylist: true,
        },

        nativeAudioTracks: false,

        nativeVideoTracks: false,
      },

      sources: [
        {
          src: playback.hlsUrl,

          type: "application/x-mpegURL",
        },
      ],
    });

    playerRef.current = player;

    const syncTime = () => {
      const time = player.currentTime();

      const total = player.duration();

      if (typeof time === "number" && Number.isFinite(time)) {
        setCurrentTime(time);
      }

      if (typeof total === "number" && Number.isFinite(total)) {
        setDuration(total);
      }
    };

    const syncVolume = () => {
      setVolume(player.volume());
      setIsMuted(player.muted() || player.volume() === 0);
    };

    const syncTracks = () => {
      const representations = getVhsRepresentations(player);
      setQualityLevels(
        representations.map((representation) => ({
          width: representation.width,
          height: representation.height,
          bitrate: representation.bandwidth,
          enabled: Boolean(representation.enabled()),
        })),
      );
      const tracks = player.audioTracks?.();
      if (tracks) {
        const nextTracks: AudioTrack[] = [];
        for (let index = 0; index < tracks.length; index += 1) {
          const track = tracks[index];
          nextTracks.push({
            id: track.id,
            label: track.label || track.language || `Audio ${index + 1}`,
            language: track.language,
            enabled: track.enabled,
          });

          if (track.enabled) {
            setSelectedAudio(index);
          }
        }

        setAudioTracks(nextTracks);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setHasStarted(true);

      setIsBuffering(false);

      setError("");
    };

    const handlePause = () => setIsPlaying(false);

    const handleWaiting = () => setIsBuffering(true);

    const handleCanPlay = () => {
      setIsBuffering(false);

      syncTracks();
    };

    const handlePlaying = () => {
      setIsBuffering(false);

      setHasStarted(true);
    };

    const handleError = () => {
      const mediaError = player.error();

      setIsBuffering(false);

      setError(
        mediaError?.message ||
          "The video could not be played. Check the stream URL, network access, and HLS configuration.",
      );
    };

    const handleLoadedMetadata = () => {
      syncTime();

      syncTracks();
    };

    player.on("timeupdate", syncTime);

    player.on("durationchange", syncTime);

    player.on("volumechange", syncVolume);

    player.on("play", handlePlay);

    player.on("pause", handlePause);

    player.on("waiting", handleWaiting);

    player.on("stalled", handleWaiting);

    player.on("canplay", handleCanPlay);

    player.on("playing", handlePlaying);

    player.on("loadedmetadata", handleLoadedMetadata);

    player.on("loadeddata", syncTracks);

    player.on("error", handleError);

    // Subtitle tracks are added as WebVTT remote text tracks.

    // Keep them in the player rather than rendering custom captions.

    for (const track of playback.subtitles ?? []) {
      player.addRemoteTextTrack(
        {
          kind: "subtitles",

          src: track.src,

          srclang: track.language,

          label: track.label,

          default: Boolean(track.default),
        },

        false,
      );
    }

    // Do not autoplay here. Browser autoplay policies may block

    // playback without a user gesture.

    player.ready(() => {
      player.volume(0.8);

      syncTracks();
    });

    return () => {
      player.off("timeupdate", syncTime);

      player.off("durationchange", syncTime);

      player.off("volumechange", syncVolume);

      player.off("play", handlePlay);

      player.off("pause", handlePause);

      player.off("waiting", handleWaiting);

      player.off("stalled", handleWaiting);

      player.off("canplay", handleCanPlay);

      player.off("playing", handlePlaying);

      player.off("loadedmetadata", handleLoadedMetadata);

      player.off("loadeddata", syncTracks);

      player.off("error", handleError);

      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }

      if (!player.isDisposed()) {
        player.dispose();
      }

      playerRef.current = null;
    };
  }, [playback]);
  const changeQuality = (quality: string) => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;

    const representations = getVhsRepresentations(player);
    if (representations.length === 0) {
      setMenu(null);
      return;
    }

    if (quality === "auto") {
      representations.forEach((representation) => representation.enabled(true));
      setSelectedQuality("auto");
      setMenu(null);
      return;
    }

    const targetHeight = Number(quality);
    const matchingRepresentations = representations.filter(
      (representation) => representation.height === targetHeight,
    );

    if (matchingRepresentations.length === 0) {
      setMenu(null);
      return;
    }

    representations.forEach((representation) => {
      representation.enabled(representation.height === targetHeight);
    });

    setSelectedQuality(quality);
    setMenu(null);
  };
  const changeAudio = (selectedIndex: number) => {
    const player = playerRef.current;

    const tracks = player?.audioTracks?.();

    if (!tracks) return;

    for (let index = 0; index < tracks.length; index += 1) {
      tracks[index].enabled = index === selectedIndex;
    }

    setSelectedAudio(selectedIndex);

    setMenu(null);
  };
  const changeSubtitle = (language: string) => {
    const player = playerRef.current;

    if (!player || player.isDisposed()) return;

    const tracks = player.textTracks();

    for (let index = 0; index < tracks.length; index += 1) {
      const track = tracks[index];

      if (track.kind !== "subtitles" && track.kind !== "captions") {
        continue;
      }

      track.mode =
        language !== "off" && track.language === language
          ? "showing"
          : "disabled";
    }

    setSelectedSubtitle(language);

    setMenu(null);
  };
  const changePlaybackRate = (rate: number) => {
    playerRef.current?.playbackRate(rate);

    setPlaybackRate(rate);

    setMenu(null);
  };
  const changeVolume = (nextVolume: number) => {
    const player = playerRef.current;

    if (!player || player.isDisposed()) return;

    player.volume(nextVolume);

    player.muted(nextVolume === 0);

    setVolume(nextVolume);

    setIsMuted(nextVolume === 0);
  };
  const toggleMute = () => {
    const player = playerRef.current;

    if (!player || player.isDisposed()) return;

    const nextMuted = !player.muted();

    player.muted(nextMuted);

    setIsMuted(nextMuted);
  };
  const showControlsTemporarily = () => {
    setShowControls(true);

    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }

    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);

        setMenu(null);
      }, 3500);
    }
  };

  // Keyboard shortcuts for common playback actions.

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ":

        case "k":
          event.preventDefault();

          togglePlay();

          break;

        case "arrowleft":
          event.preventDefault();

          seekBy(-10);

          break;

        case "arrowright":
          event.preventDefault();

          seekBy(10);

          break;

        case "arrowup":
          event.preventDefault();

          changeVolume(Math.min(1, volume + 0.05));

          break;

        case "arrowdown":
          event.preventDefault();

          changeVolume(Math.max(0, volume - 0.05));

          break;

        case "m":
          toggleMute();

          break;

        case "f":
          void toggleFullscreen();

          break;

        case "escape":
          setMenu(null);

          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay, seekBy, toggleFullscreen, volume]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  const availableQualities = Array.from(
    new Set(
      qualityLevels

        .map((level) => level.height)

        .filter((height): height is number => Boolean(height)),
    ),
  ).sort((a, b) => b - a);
  const selectedSubtitleLabel =
    selectedSubtitle === "off"
      ? "Off"
      : (subtitleTracks.find((track) => track.language === selectedSubtitle)
          ?.label ?? "Off");
  const activeAudioLabel = audioTracks[selectedAudio]?.label ?? "Default";
  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);

    if (Number.isFinite(nextTime)) {
      playerRef.current?.currentTime(nextTime);

      setCurrentTime(nextTime);
    }
  };

  return (
    <main
      ref={containerRef}
      className="fixed inset-0 z-[100] flex h-[100dvh] w-full select-none flex-col overflow-hidden bg-black text-white"
      onMouseMove={showControlsTemporarily}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Video surface */}

      <div className="absolute inset-0 bg-black">
        <video
          ref={videoElementRef}
          className="video-js vjs-big-play-centered !absolute !inset-0 !h-full !w-full"
          playsInline
          crossOrigin="anonymous"
        />

        <style>{`

          .video-js,

          .video-js .vjs-tech {

            width: 100% !important;

            height: 100% !important;

            object-fit: contain;

            background: #000;

          }

          .video-js .vjs-control-bar,

          .video-js .vjs-big-play-button,

          .video-js .vjs-loading-spinner,

          .video-js .vjs-modal-dialog {

            display: none !important;

          }

          .video-js .vjs-text-track-display {

            bottom: 8% !important;

          }

          .video-js .vjs-text-track-cue > div {

            background: rgba(0, 0, 0, 0.72) !important;

            color: #fff !important;

            font-size: clamp(16px, 2.5vw, 28px) !important;

            line-height: 1.4 !important;

          }

          .video-js .vjs-poster {

            background-size: contain;

          }

          input[type="range"].player-range {

            appearance: none;

            -webkit-appearance: none;

            height: 4px;

            border-radius: 9999px;

            cursor: pointer;

          }

          input[type="range"].player-range::-webkit-slider-thumb {

            appearance: none;

            -webkit-appearance: none;

            width: 12px;

            height: 12px;

            border-radius: 50%;

            background: #e50914;

          }

          input[type="range"].player-range::-moz-range-thumb {

            width: 12px;

            height: 12px;

            border: none;

            border-radius: 50%;

            background: #e50914;

          }

        `}</style>
      </div>

      {/* Loading state */}

      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-red-600" />

          <p className="text-sm text-white/60">Loading your movie...</p>
        </div>
      )}

      {/* Error state */}

      {!loading && error && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/95 px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <X className="h-6 w-6 text-red-500" />
            </div>

            <h1 className="text-xl font-semibold">Unable to play this title</h1>

            <p className="mt-3 text-sm leading-6 text-white/60">{error}</p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                Go back
              </button>

              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && playback && !error && (
        <>
          {/* Top navigation overlay */}

          <header
            className={`absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/85 to-transparent px-4 pb-14 pt-5 transition-opacity duration-300 sm:px-8 sm:pt-7 ${
              showControls ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/35 transition hover:bg-white/15"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="mx-4 min-w-0 flex-1 text-center">
              <h1 className="truncate text-sm font-semibold sm:text-base">
                {playback.title}
              </h1>

              {playback.episodeTitle && (
                <p className="mt-1 truncate text-xs text-white/60 sm:text-sm">
                  {playback.episodeTitle}
                </p>
              )}
            </div>

            <button
              onClick={() => navigate(-1)}
              aria-label="Close player"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/35 transition hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Center controls and buffering */}

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            {isBuffering && hasStarted && (
              <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-white/20 border-t-white" />
            )}

            {!hasStarted && !isBuffering && (
              <button
                onClick={togglePlay}
                aria-label="Play video"
                className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/15 pl-1 shadow-2xl backdrop-blur-md transition hover:scale-105 hover:bg-white/25 sm:h-20 sm:w-20"
              >
                <Play className="h-8 w-8 fill-white sm:h-9 sm:w-9" />
              </button>
            )}
          </div>

          {/* Bottom playback controls */}

          <section
            className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-5 pt-20 transition-opacity duration-300 sm:px-8 sm:pb-8 ${
              showControls || !isPlaying
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* Timeline */}

            <div className="mb-4 flex items-center gap-3">
              <span className="w-11 shrink-0 text-right text-xs tabular-nums text-white/75">
                {formatTime(currentTime)}
              </span>

              <input
                aria-label="Seek video"
                className="player-range min-w-0 flex-1 accent-red-600"
                type="range"
                min={0}
                max={Math.max(duration, 0)}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={handleProgressChange}
                style={{
                  background: `linear-gradient(to right, #e50914 ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, rgba(255,255,255,.3) ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%)`,
                }}
              />

              <span className="w-11 shrink-0 text-xs tabular-nums text-white/75">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 px-10">
              {/* Left controls */}

              <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 hover:bg-white/85"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-black" />
                  ) : (
                    <Play className="ml-0.5 h-5 w-5 fill-black" />
                  )}
                </button>

                <button
                  onClick={() => seekBy(-10)}
                  aria-label="Go back 10 seconds"
                  className="hidden text-white/85 transition hover:text-white sm:block"
                >
                  <SkipBack className="h-5 w-5" />
                </button>

                <button
                  onClick={() => seekBy(10)}
                  aria-label="Skip forward 10 seconds"
                  className="hidden text-white/85 transition hover:text-white sm:block"
                >
                  <SkipForward className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="text-white/85 transition hover:text-white"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>

                  <input
                    aria-label="Volume"
                    className="player-range hidden w-20 sm:block"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={(event) =>
                      changeVolume(Number(event.target.value))
                    }
                    style={{
                      background: `linear-gradient(to right, #E80811 ${
                        (isMuted ? 0 : volume) * 100
                      }%, rgba(255,255,255,.3) ${
                        (isMuted ? 0 : volume) * 100
                      }%)`,
                    }}
                  />
                </div>
              </div>

              {/* Right controls */}

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                {/* Subtitle menu */}

                <div className="relative">
                  <button
                    onClick={() =>
                      setMenu(menu === "subtitles" ? null : "subtitles")
                    }
                    aria-label="Subtitles"
                    title={`Subtitles: ${selectedSubtitleLabel}`}
                    className={`rounded-md px-2 py-2 text-xs font-semibold transition hover:bg-white/10 sm:px-3 ${
                      selectedSubtitle !== "off"
                        ? "text-red-400"
                        : "text-white/85"
                    }`}
                  >
                    CC
                  </button>

                  {/* {menu === "subtitles" && (
                    <div className="absolute bottom-12 right-0 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#171717] p-2 shadow-2xl">
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/45">
                        Subtitles
                      </p>

                      <button
                        onClick={() => changeSubtitle("off")}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/10"
                      >
                        Off
                        {selectedSubtitle === "off" && (
                          <Check className="h-4 w-4 text-red-500" />
                        )}
                      </button>

                      {subtitleTracks.map((track) => (
                        <button
                          key={`${track.language}-${track.src}`}
                          onClick={() => changeSubtitle(track.language)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/10"
                        >
                          <span>{track.label}</span>

                          {selectedSubtitle === track.language && (
                            <Check className="h-4 w-4 text-red-500" />
                          )}
                        </button>
                      ))}

                      {subtitleTracks.length === 0 && (
                        <p className="px-3 py-2 text-xs leading-5 text-white/45">
                          No external subtitles are available.
                        </p>
                      )}
                    </div>
                  )} */}
                </div>

                {/* Settings menu */}

                <div className="relative">
                  <button
                    onClick={() =>
                      setMenu(menu === "quality" ? null : "quality")
                    }
                    aria-label="Playback settings"
                    className="flex items-center gap-1 rounded-md px-2 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10 sm:px-3"
                  >
                    <Settings2 className="h-4 w-4" />

                    <span className="hidden sm:inline">Settings</span>

                    <ChevronDown className="hidden h-3 w-3 sm:block" />
                  </button>

                  {menu && (
                    <div className="absolute bottom-12 right-0 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#171717] p-2 shadow-2xl">
                      {menu === "quality" && (
                        <>
                          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/45">
                            Playback settings
                          </p>

                          <button
                            onClick={() => setMenu("quality")}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm hover:bg-white/10"
                          >
                            <span>Quality</span>

                            <span className="flex items-center gap-2 text-white/55">
                              {selectedQuality === "auto"
                                ? "Auto"
                                : `${selectedQuality}p`}

                              <ChevronDown className="h-3.5 w-3.5" />
                            </span>
                          </button>

                          <button
                            onClick={() => setMenu("audio")}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm hover:bg-white/10"
                          >
                            <span>Audio</span>

                            <span className="flex max-w-28 items-center gap-1 truncate text-white/55">
                              {activeAudioLabel}

                              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                            </span>
                          </button>

                          <button
                            onClick={() => setMenu("subtitles")}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm hover:bg-white/10"
                          >
                            <span>Subtitles</span>

                            <span className="flex items-center gap-1 text-white/55">
                              {selectedSubtitleLabel}

                              <ChevronDown className="h-3.5 w-3.5" />
                            </span>
                          </button>

                          <button
                            onClick={() => setMenu("speed")}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm hover:bg-white/10"
                          >
                            <span>Playback speed</span>

                            <span className="flex items-center gap-1 text-white/55">
                              {playbackRate}x
                              <ChevronDown className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        </>
                      )}

                      {menu === "quality" && (
                        <div className="mt-1 border-t border-white/10 pt-2">
                          <button
                            onClick={() => changeQuality("auto")}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-white/10"
                          >
                            Auto
                            {selectedQuality === "auto" && (
                              <Check className="h-4 w-4 text-red-500" />
                            )}
                          </button>

                          {availableQualities.map((height) => (
                            <button
                              key={height}
                              onClick={() => changeQuality(String(height))}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-white/10"
                            >
                              {height}p
                              {selectedQuality === String(height) && (
                                <Check className="h-4 w-4 text-red-500" />
                              )}
                            </button>
                          ))}

                          {availableQualities.length === 0 && (
                            <p className="px-3 py-2 text-xs leading-5 text-white/45">
                              Quality options will appear when the HLS stream
                              exposes its available renditions.
                            </p>
                          )}
                        </div>
                      )}

                      {menu === "audio" && (
                        <>
                          <button
                            onClick={() => setMenu("quality")}
                            className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/10"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Audio tracks
                          </button>

                          {audioTracks.map((track, index) => (
                            <button
                              key={track.id ?? `${track.label}-${index}`}
                              onClick={() => changeAudio(index)}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/10"
                            >
                              <span className="truncate">{track.label}</span>

                              {selectedAudio === index && (
                                <Check className="h-4 w-4 shrink-0 text-red-500" />
                              )}
                            </button>
                          ))}

                          {audioTracks.length === 0 && (
                            <p className="px-3 py-2 text-xs leading-5 text-white/45">
                              No alternate audio tracks were found. Audio
                              options depend on your HLS manifest.
                            </p>
                          )}
                        </>
                      )}

                      {menu === "subtitles" && (
                        <>
                          <button
                            onClick={() => setMenu("quality")}
                            className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/10"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Subtitles
                          </button>

                          <button
                            onClick={() => changeSubtitle("off")}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-white/10"
                          >
                            Off
                            {selectedSubtitle === "off" && (
                              <Check className="h-4 w-4 text-red-500" />
                            )}
                          </button>

                          {subtitleTracks.map((track) => (
                            <button
                              key={`${track.language}-${track.src}`}
                              onClick={() => changeSubtitle(track.language)}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/10"
                            >
                              <span>{track.label}</span>

                              {selectedSubtitle === track.language && (
                                <Check className="h-4 w-4 text-red-500" />
                              )}
                            </button>
                          ))}
                          {subtitleTracks.length === 0 && (
                            <p className="px-3 py-2 text-xs leading-5 text-white/45">
                              No external subtitles are available.
                            </p>
                          )}
                        </>
                      )}

                      {menu === "speed" && (
                        <>
                          <button
                            onClick={() => setMenu("quality")}
                            className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/10"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Playback speed
                          </button>

                          {PLAYBACK_RATES.map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-white/10"
                            >
                              {rate}x
                              {playbackRate === rate && (
                                <Check className="h-4 w-4 text-red-500" />
                              )}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => void toggleFullscreen()}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-white/85 transition hover:bg-white/10 hover:text-white"
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Player;

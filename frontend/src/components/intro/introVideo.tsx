import { useRef } from "react";

interface IntroVideoProps {
  onComplete: () => void;
  src?: string;
}

export default function IntroVideo({
  onComplete,
  src = "/videos/cinematic-intro.mp4",
}: IntroVideoProps) {
  const completedRef = useRef(false);

  const complete = () => {
    if (completedRef.current) return;

    completedRef.current = true;
    onComplete();
  };

  return (
    <div className="absolute inset-0 z-[50] flex items-center justify-center overflow-hidden bg-black">
      <video
        src={src}
        autoPlay
        playsInline
        preload="auto"
        onEnded={complete}
        onError={complete}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

import { useState } from "react";
import { Play, Flame } from "lucide-react";

export default function Banner() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="lg:col-span-9 relative rounded-[30px] overflow-hidden bg-black min-h-[380px] md:min-h-[420px] flex flex-col justify-between p-5 md:p-7 shadow-xl group select-none">
      <div className="absolute inset-0  w-full h-full">
        <div className="relative h-full overflow-hidden -ml-12 border-r border-red-500/20">
          <div className="absolute inset-0  transition-transform duration-700 ">
            <img
              src="/images/stranger.png"
              alt="Steve Harrington"
              className="w-full h-full object-cover filter contrast-125 saturate-150 brightness-75"
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>Now Streaming</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90">
            <span className=" font-bold mr-1">IMDb</span>
            9.2
          </div>
          <div className="px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90">
            Match: <span className=" font-semibold">86%</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90">
            2h 15m
          </div>
          <div className="px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>Top 10 Today</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isPlaying ? "Pause" : "Watch now"}</span>
        </button>

        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-6 h-1 bg-white rounded-full shadow-[0_0_6px_#ffffff]" />
          <div className="w-1.5 h-1 bg-white/30 rounded-full" />
          <div className="w-1.5 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}

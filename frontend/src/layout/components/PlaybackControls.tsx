import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  return (
    <footer className="h-20 border-t border-zinc-800 bg-zinc-900 px-4 sm:h-24">
      <div className="mx-auto flex h-full max-w-[1800px] items-center justify-between">
        {/* currently playing song */}
        <div className="hidden w-[30%] min-w-[180px] items-center gap-4 sm:flex">
          {currentSong && (
            <>
              <img src={currentSong.imageUrl} alt={currentSong.title} className="h-14 w-14 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <div className="cursor-pointer truncate font-medium hover:underline">{currentSong.title}</div>
                <div className="cursor-pointer truncate text-sm text-zinc-400 hover:underline">
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls*/}
        <div className="flex max-w-full flex-1 flex-col items-center gap-2 sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button size="icon" variant="ghost" className="hidden text-zinc-400 hover:text-white sm:inline-flex">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/80"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="hidden text-zinc-400 hover:text-white sm:inline-flex">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          <div className="hidden w-full items-center gap-2 sm:flex">
            <div className="text-xs text-zinc-400">{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="active:cursor-pointing w-full hover:cursor-pointer hover:[&>span:nth-child(1)>span]:bg-green-500 [&>span:nth-child(2)]:opacity-0 hover:[&>span:nth-child(2)]:opacity-100 [&>span:nth-child(2)>span]:bg-white"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>
        {/* volume controls */}
        <div className="hidden w-[30%] min-w-[180px] items-center justify-end gap-4 sm:flex">
          <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
            <Mic2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
            <Laptop2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
              <Volume1 className="h-4 w-4" />
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="active:cursor-pointing w-24 hover:cursor-pointer hover:[&>span:nth-child(1)>span]:bg-green-500 [&>span:nth-child(2)]:opacity-0 hover:[&>span:nth-child(2)]:opacity-100 [&>span:nth-child(2)>span]:bg-white"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

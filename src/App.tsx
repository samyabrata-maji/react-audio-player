import react, {
  AudioHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState,
} from "react";
import { Slider } from "@mantine/core";

import TrackOne from "./assets/track-01.mp3";
import TrackTwo from "./assets/track-02.mp3";
import TrackThree from "./assets/track-03.mp3";

const secToTimeStamp = (timeImSec: number | null | undefined): string => {
  if (!timeImSec) return "0:00";

  const totalSeconds = Math.floor(timeImSec);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (!hours) return `${formattedMinutes || "-"}:${formattedSeconds || "-"}`;
  return `${formattedHours || "-"}:${formattedMinutes || "-"}:${
    formattedSeconds || "-"
  }`;
};

function getTrack(trackNo: number): string {
  switch (trackNo) {
    case 1:
      return TrackOne;
    case 2:
      return TrackTwo;
    case 3:
      return TrackThree;
    default:
      return TrackOne;
  }
}

function App() {
  const audioRef = useRef<HTMLAudioElement>(null!);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSec, setCurrentSec] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [trackNumber, setTrackNumber] = useState<number>(1);

  const handleUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const progressPercent = (currentTime / duration) * 100;
    setCurrentSec(currentTime);
    setProgress(progressPercent);
  };

  useEffect(() => {
    audioRef.current.addEventListener("timeupdate", handleUpdate);

    return () => {
      audioRef.current.removeEventListener("timeupdate", handleUpdate);
    };
  }, []);

  async function handlePlay() {
    await audioRef.current.play();
  }

  function handlePause() {
    setIsPlaying(prev => !prev)
    audioRef.current.pause();
  }

  function handleRestart() {
    audioRef.current.currentTime = 0;
  }

  return (
    <>
      <div>
        <h2>{`${secToTimeStamp(currentSec)} / ${secToTimeStamp(
          audioRef?.current?.duration,
        )}`}</h2>
        <Slider
          value={Math.round(progress * 100) / 100 || 0}
          onChange={(event) => {
            const duration = audioRef.current.duration;
            const currentSecFromProgress = (event * duration) / 100;

            if (Number.isNaN(audioRef.current.currentTime)) {
              audioRef.current.currentTime = 0
            }
            audioRef.current.currentTime = currentSecFromProgress;
          }}
        />
        <h2>{`Playing Track: ${getTrack(trackNumber)}`}</h2>
        <audio src={getTrack(trackNumber)} ref={audioRef} />
        {!isPlaying && <button
          onClick={() => {
            setIsPlaying(prev => !prev)
            handlePlay()
              .then(() => console.log("play"))
              .catch(() => console.log("error"));
          }}
        >
          Start
        </button>}
        {isPlaying && <button onClick={handlePause}>Pause</button>}
        <button onClick={handleRestart}>Restart</button>
        <button
          onClick={() => {
            setTrackNumber((prev) => {
              
              // @here
              // setIsPlaying(false)
              
              prev = prev - 1;
              if (prev > 3) return 1;
              if (prev < 1) return 3;
              return prev;
            });
          }}
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            setTrackNumber((prev) => {
              // @here
              // setIsPlaying(false)
              prev = prev + 1;
              if (prev > 3) return 1;
              if (prev < 1) return 3;
              return prev;
            });
          }}
        >
          {">"}
        </button>
        <Slider
          value={(typeof audioRef?.current?.volume === "undefined" || Number.isNaN(audioRef?.current?.volume))? 100 : audioRef.current.volume * 100}
          onChange={(event) => {
            audioRef.current.volume = event/100
          }}
        />
      </div>
    </>
  );
}

export default App;

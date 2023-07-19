import {
  AudioHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState,
} from "react";
import { Slider, RangeSlider } from "@mantine/core";
import AudioExample from "./assets/rick.mp3";

type AudioElement = DetailedHTMLProps<
  AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
>;

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

function App() {
  const audioRef = useRef<HTMLAudioElement>(null!);

  const [currentSec, setCurrentSec] = useState<number>(0);
  const [progress, setProgress] = useState(0);

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
          value={Math.round(progress * 100) / 100}
          onChange={(event) => {
            const duration = audioRef.current.duration
            const currentSecFromProgress = (event * duration) / 100
            audioRef.current.currentTime = currentSecFromProgress
          }}
        />
        <audio src={AudioExample} ref={audioRef} />
        <button
          onClick={() => {
            handlePlay()
              .then(() => console.log("play"))
              .catch(() => console.log("error"));
          }}
        >
          Start
        </button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </>
  );
}

export default App;

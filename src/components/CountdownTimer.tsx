
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
}

const CountdownTimer = ({ seconds: initialSeconds, onComplete }: CountdownTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds: secs } = formatTime(seconds);

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
      <div className="flex justify-center items-center space-x-2">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-cafe-blue">{hours}</span>
          <span className="text-xs text-gray-500">hours</span>
        </div>
        <span className="text-2xl font-bold text-gray-800">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-cafe-blue">{minutes}</span>
          <span className="text-xs text-gray-500">minutes</span>
        </div>
        <span className="text-2xl font-bold text-gray-800">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-cafe-blue">{secs}</span>
          <span className="text-xs text-gray-500">seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

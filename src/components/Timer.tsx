import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// SVG Imports
import startSVG from "../assets/start-icon.svg";
import pauseSVG from "../assets/pause-icon.svg";
import resetSVG from "../assets/reset-icon.svg";

// Timer Durations
const TIMER_DURATIONS = {
  focus: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
} as const;

// Timer Mode
type TimerMode = keyof typeof TIMER_DURATIONS;

interface TaskProps {
  infoToast: (info: string) => void;
}

const Timer: React.FC<TaskProps> = ({ infoToast }) => {
  // Ref for setInterval
  const pomodoroRef = useRef<number | null>(null);

  // Timer State
  const [timer, setTimer] = useState(TIMER_DURATIONS.focus);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [resetAnimate, setResetAnimate] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("focus");

  // Derived Values
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const clearTimerInterval = () => {
    if (pomodoroRef.current) {
      clearInterval(pomodoroRef.current);
      pomodoroRef.current = null;
    }
  };

  const startTimer = () => {
    setIsTimerStarted(true);
    pomodoroRef.current = setInterval(() => {
      setTimer((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    if (timer === 0) {
      clearTimerInterval();
    }
  };

  const pauseTimer = () => {
    setIsTimerStarted(false);
    clearTimerInterval();
  };

  const resetTimer = () => {
    setIsTimerStarted(false);
    setTimer(TIMER_DURATIONS[timerMode]);
    clearTimerInterval();
    infoToast("Timer reset!");
    setResetAnimate(true);
    setTimeout(() => setResetAnimate(false), 300);
  };

  const changeMode = (newMode: TimerMode) => {
    // Reset timer if mode is changed
    setIsTimerStarted(false);
    clearTimerInterval();
    setTimerMode(newMode);
    setTimer(TIMER_DURATIONS[newMode]);
  };

  // Side Effects
  useEffect(() => {
    // Calculate time values directly from timer
    const currentMinutes = Math.floor(timer / 60);
    const currentSeconds = timer % 60;

    // Formatting helper
    const formatTime = (time: number) => time.toString().padStart(2, "0");

    // Handle timer completion
    if (timer === 0) infoToast("Time's up!");

    // Update document title
    document.title = `${currentMinutes}:${formatTime(currentSeconds)} - ${
      timerMode === "focus" ? "Focus" : "Break"
    }`;
  }, [timer, timerMode, infoToast]);

  return (
    <section className="timer-container">
      <div className="timer">
        {Object.keys(TIMER_DURATIONS).map((mode) => (
          <button
            key={mode}
            type="button"
            className="squared-btn"
            onClick={() => changeMode(mode as TimerMode)}
          >
            {mode.charAt(0).toUpperCase() +
              mode.slice(1).replace(/([A-Z])/g, " $1")}
          </button>
        ))}
      </div>
      <h1 className="timer-title">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </h1>
      <div className="timer-commands-container">
        {timer !== 0 && (
          <button
            type="button"
            className="btn btn-large"
            title={isTimerStarted ? "pause" : "start"}
            onClick={isTimerStarted ? pauseTimer : startTimer}
          >
            <motion.img
              // adding key attribute forces image re-render allowing for animation
              key={isTimerStarted ? "pause-icon" : "start-icon"}
              src={isTimerStarted ? pauseSVG : startSVG}
              alt={isTimerStarted ? "Pause Timer Icon" : "Start Timer Icon"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </button>
        )}

        <button
          className="btn btn-large"
          title="reset"
          type="button"
          onClick={resetTimer}
          disabled={timer === TIMER_DURATIONS[timerMode]}
        >
          <motion.img
            src={resetSVG}
            alt="Reset Timer Icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: resetAnimate ? [0, -360] : -360,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </button>
      </div>
    </section>
  );
};

export default Timer;

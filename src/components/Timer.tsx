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

  const startTimer = () => {
    setIsTimerStarted(true);
    pomodoroRef.current = setInterval(() => {
      setTimer((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    if (timer === 0) {
      clearInterval(pomodoroRef.current);
      pomodoroRef.current = null;
      setIsTimerStarted(false);
    }
  };

  const pauseTimer = () => {
    setIsTimerStarted(false);
    if (pomodoroRef.current) {
      clearInterval(pomodoroRef.current);
      pomodoroRef.current = null;
    }
  };

  const resetTimer = () => {
    setIsTimerStarted(false);
    setTimer(TIMER_DURATIONS[timerMode]);
    if (pomodoroRef.current) {
      clearInterval(pomodoroRef.current);
      pomodoroRef.current = null;
    }

    infoToast("Timer reset!");
    setResetAnimate(true);
    setTimeout(() => setResetAnimate(false), 300);
  };

  const handlePomodoroMode = (mode: TimerMode) => {
    setTimerMode(mode);
    setTimer(TIMER_DURATIONS[mode]);
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  useEffect(() => {
    if (timer === 0) {
      infoToast("Time's up!");
    }

    if (minutes === TIMER_DURATIONS.focus / 60) {
      document.title =
        minutes + ":" + seconds.toString().padStart(2, "0") + " - Focus";
    } else {
      document.title =
        minutes + ":" + seconds.toString().padStart(2, "0") + " - Break";
    }
  }, [minutes, seconds, timer, infoToast]);

  return (
    <section className="timer-container">
      <div className="timer">
        <button
          type="button"
          className="squared-btn"
          onClick={() => handlePomodoroMode("focus")}
        >
          Focus
        </button>
        <button
          type="button"
          className="squared-btn"
          onClick={() => handlePomodoroMode("shortBreak")}
        >
          Short Break
        </button>
        <button
          type="button"
          className="squared-btn"
          onClick={() => handlePomodoroMode("longBreak")}
        >
          Long Break
        </button>
      </div>
      <h1 className="timer-title">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </h1>
      <div className="timer-commands-container">
        {timer !== 0 ? (
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
        ) : null}

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

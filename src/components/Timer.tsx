import { useRef, useState } from "react";

// SVG Imports
import startSVG from "../assets/start-icon.svg";
import pauseSVG from "../assets/pause-icon.svg";
import resetSVG from "../assets/reset-icon.svg";

import { motion } from "framer-motion";

interface TaskProps {
  infoToast: (info: string) => void;
}

const Timer: React.FC<TaskProps> = ({ infoToast }) => {
  const POMODORO_SECONDS = 25 * 60; // 25 minutes in seconds

  const pomodoroRef = useRef<number | null>(null);

  const [timer, setTimer] = useState(POMODORO_SECONDS);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [resetAnimate, setResetAnimate] = useState(false);

  const handlePomodoroStart = () => {
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

  const handlePomodoroPause = () => {
    setIsTimerStarted(false);
    if (pomodoroRef.current) {
      clearInterval(pomodoroRef.current);
      pomodoroRef.current = null;
    }
  };

  const handlePomodoroReset = () => {
    setIsTimerStarted(false);
    setTimer(POMODORO_SECONDS);
    if (pomodoroRef.current) {
      clearInterval(pomodoroRef.current);
      pomodoroRef.current = null;
    }

    infoToast("Timer reset!");

    // Animate reset button
    setResetAnimate(true);
    setTimeout(() => {
      setResetAnimate(false);
    }, 300);
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <section className="timer-container">
      <h1 className="timer">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </h1>
      <div className="timer-commands-container">
        <button
          type="button"
          className="btn btn-large"
          title={isTimerStarted ? "pause" : "start"}
          onClick={isTimerStarted ? handlePomodoroPause : handlePomodoroStart}
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

        <button
          className="btn btn-large"
          title="reset"
          type="button"
          onClick={handlePomodoroReset}
          disabled={timer === POMODORO_SECONDS}
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

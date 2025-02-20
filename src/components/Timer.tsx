import { motion } from "framer-motion";
import { useTimer } from "../hooks/useTimer";

// SVG Icons
import startSVG from "../assets/start-icon.svg";
import pauseSVG from "../assets/pause-icon.svg";
import resetSVG from "../assets/reset-icon.svg";

interface TimerProps {
  infoToast: (info: string) => void;
}

const Timer: React.FC<TimerProps> = ({ infoToast }) => {
  const {
    timer,
    isTimerStarted,
    resetAnimate,
    timerMode,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
  } = useTimer(infoToast);

  const minutes = Math.floor(timer / 60);
  const seconds = (timer % 60).toString().padStart(2, "0");

  return (
    <section className="timer-container">
      <h1 className="timer-title">
        {minutes}:{seconds}
      </h1>

      <div className="timer-commands-container">
        {timer !== 0 && (
          <button
            type="button"
            className="btn btn-large"
            title={isTimerStarted ? "Pause" : "Start"}
            onClick={isTimerStarted ? pauseTimer : startTimer}
          >
            <motion.img
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
          title="Reset"
          type="button"
          onClick={resetTimer}
          disabled={timer === (timerMode === "focus" ? 25 * 60 : 5 * 60)}
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

      <div className="timer">
        {["focus", "shortBreak", "longBreak"].map((mode) => (
          <button
            key={mode}
            type="button"
            className={
              timerMode === mode ? "squared-btn active" : "squared-btn"
            }
            onClick={() =>
              changeMode(mode as "focus" | "shortBreak" | "longBreak")
            }
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Timer;

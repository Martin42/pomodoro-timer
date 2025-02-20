import { useEffect, useRef, useState } from "react";

const TIMER_DURATIONS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
} as const;

type TimerMode = keyof typeof TIMER_DURATIONS;

export const useTimer = (infoToast: (info: string) => void) => {
  const [timer, setTimer] = useState(TIMER_DURATIONS.focus);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [resetAnimate, setResetAnimate] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("focus");

  const pomodoroRef = useRef<number | null>(null);

  const clearTimerInterval = () => {
    if (pomodoroRef.current) {
      clearInterval(pomodoroRef.current);
      pomodoroRef.current = null;
    }
  };

  const startTimer = () => {
    setIsTimerStarted(true);
    pomodoroRef.current = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);
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
    setIsTimerStarted(false);
    clearTimerInterval();
    setTimerMode(newMode);
    setTimer(TIMER_DURATIONS[newMode]);
  };

  useEffect(() => {
    if (timer === 0) {
      clearTimerInterval();
      setIsTimerStarted(false);
      infoToast("Time's up!");

      const blinkInterval = setInterval(() => {
        document.title =
          document.title === "Timer is over" ? " " : "Timer is over";
      }, 1000);

      return () => clearInterval(blinkInterval);
    }

    document.title = `${Math.floor(timer / 60)}:${(timer % 60)
      .toString()
      .padStart(2, "0")} - ${timerMode === "focus" ? "Focus" : "Break"}`;
  }, [timer, timerMode, infoToast]);

  return {
    timer,
    isTimerStarted,
    resetAnimate,
    timerMode,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
  };
};

import { useState, useEffect } from "react";
import { useSiteSettings } from "./use-site-settings";

export function useDrops() {
  const { settings } = useSiteSettings();
  const targetDate = new Date(settings.drop_target_date);

  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, targetDate.getTime() - Date.now())
  );

  useEffect(() => {
    const target = new Date(settings.drop_target_date);
    setTimeLeft(Math.max(0, target.getTime() - Date.now()));
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, target.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [settings.drop_target_date]);

  const unlocked = timeLeft === 0;
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { timeLeft, unlocked, days, hours, minutes, seconds };
}

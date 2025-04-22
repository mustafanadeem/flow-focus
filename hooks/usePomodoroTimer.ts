import { useState, useEffect, useCallback } from 'react';
import { insertPomodoroSession } from '@/lib/supabase';

interface PomodoroTimerProps {
  userId: string;
  initialMinutes?: number;
  onComplete?: () => void;
}

export const usePomodoroTimer = ({ 
  userId, 
  initialMinutes = 25,
  onComplete 
}: PomodoroTimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(initialMinutes * 60);
  const [startTime, setStartTime] = useState<string | null>(null);

  const reset = useCallback(() => {
    setTime(initialMinutes * 60);
    setIsActive(false);
    setStartTime(null);
  }, [initialMinutes]);

  const start = useCallback(() => {
    setIsActive(true);
    setStartTime(new Date().toISOString());
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const complete = useCallback(async () => {
    if (!startTime) return;

    try {
      await insertPomodoroSession({
        user_id: userId,
        start_time: startTime,
        end_time: new Date().toISOString(),
        duration: initialMinutes,
        completed: true,
      });

      onComplete?.();
      reset();
    } catch (error) {
      console.error('Error saving pomodoro session:', error);
    }
  }, [userId, startTime, initialMinutes, onComplete, reset]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((currentTime) => {
          if (currentTime <= 1) {
            complete();
            return 0;
          }
          return currentTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time, complete]);

  return {
    isActive,
    time,
    start,
    pause,
    reset,
    complete,
    minutes: Math.floor(time / 60),
    seconds: time % 60,
  };
}; 
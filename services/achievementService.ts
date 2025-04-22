import { supabase } from '@/lib/supabase';
import { Achievement, AchievementType } from '@/types/achievement';
import { Session } from '@/types/session';
import { format, isToday, isBefore, isAfter, startOfDay, endOfDay, differenceInDays } from 'date-fns';

const ACHIEVEMENTS = [
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete 5 focus sessions before 10 AM',
    type: 'early_bird' as AchievementType,
    requirement: 5,
    imageUrl: 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete 5 focus sessions after 8 PM',
    type: 'night_owl' as AchievementType,
    requirement: 5,
    imageUrl: 'https://images.pexels.com/photos/4048182/pexels-photo-4048182.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'focus_master',
    title: 'Focus Master',
    description: 'Complete 25 focus sessions',
    type: 'session_count' as AchievementType,
    requirement: 25,
    imageUrl: 'https://images.pexels.com/photos/954559/pexels-photo-954559.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'deep_worker',
    title: 'Deep Worker',
    description: 'Accumulate 3 hours of focused work in a single day',
    type: 'total_focus_time' as AchievementType,
    requirement: 10800, // 3 hours in seconds
    imageUrl: 'https://images.pexels.com/photos/7256596/pexels-photo-7256596.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'consistency',
    title: 'Consistency Champion',
    description: 'Complete at least one focus session for 7 consecutive days',
    type: 'streak_days' as AchievementType,
    requirement: 7,
    imageUrl: 'https://images.pexels.com/photos/4065624/pexels-photo-4065624.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const achievementService = {
  async getAchievements(): Promise<Achievement[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get all user's sessions
    const { data: sessions } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'focus');

    if (!sessions) return ACHIEVEMENTS.map(a => ({ ...a, progress: 0, completed: false }));

    // Calculate progress for each achievement
    return ACHIEVEMENTS.map(achievement => {
      let progress = 0;

      switch (achievement.type) {
        case 'early_bird': {
          progress = sessions.filter(session => {
            const sessionTime = new Date(session.completed_at);
            return isBefore(sessionTime, new Date(sessionTime.setHours(10, 0, 0)));
          }).length;
          break;
        }
        case 'night_owl': {
          progress = sessions.filter(session => {
            const sessionTime = new Date(session.completed_at);
            return isAfter(sessionTime, new Date(sessionTime.setHours(20, 0, 0)));
          }).length;
          break;
        }
        case 'session_count': {
          progress = sessions.length;
          break;
        }
        case 'total_focus_time': {
          // Check total focus time for today
          const todaySessions = sessions.filter(session => isToday(new Date(session.completed_at)));
          progress = todaySessions.reduce((acc, session) => acc + session.duration, 0);
          break;
        }
        case 'streak_days': {
          // Sort sessions by date
          const sessionDates = [...new Set(
            sessions.map(session => format(new Date(session.completed_at), 'yyyy-MM-dd'))
          )].sort();

          let currentStreak = 1;
          let maxStreak = 1;

          for (let i = 1; i < sessionDates.length; i++) {
            const diff = differenceInDays(
              new Date(sessionDates[i]),
              new Date(sessionDates[i - 1])
            );

            if (diff === 1) {
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else {
              currentStreak = 1;
            }
          }
          progress = maxStreak;
          break;
        }
      }

      return {
        ...achievement,
        progress,
        completed: progress >= achievement.requirement
      };
    });
  }
}; 
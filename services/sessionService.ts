import { supabase } from '@/lib/supabase';
import { Session, CreateSessionDTO } from '@/types/session';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval } from 'date-fns';

export const sessionService = {
  async createSession(data: CreateSessionDTO): Promise<Session> {
    const { data: session, error } = await supabase
      .from('sessions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return session;
  },

  async getRecentSessions(limit: number = 10): Promise<Session[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return sessions;
  },

  async getWeeklyFocusTime(): Promise<{ date: string; total_duration: number }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get the start and end of the current week
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Start week on Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Get all focus sessions for the current week
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'focus')
      .gte('completed_at', weekStart.toISOString())
      .lte('completed_at', weekEnd.toISOString());

    if (error) throw error;

    // Create an array of all days in the week
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Calculate total duration for each day
    const weeklyData = daysInWeek.map(day => {
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));

      const dayDuration = sessions
        ? sessions
            .filter(session => {
              const sessionDate = new Date(session.completed_at);
              return isWithinInterval(sessionDate, { start: dayStart, end: dayEnd });
            })
            .reduce((acc, session) => acc + session.duration, 0)
        : 0;

      return {
        date: format(day, 'yyyy-MM-dd'),
        total_duration: dayDuration
      };
    });

    return weeklyData;
  }
}; 
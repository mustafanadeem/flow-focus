import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export interface PomodoroSession {
  id?: string;
  user_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  completed: boolean;
  task_name?: string;
  created_at?: string;
}

export const insertPomodoroSession = async (session: Omit<PomodoroSession, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPomodoroSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getPomodoroStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('pomodoro_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true);

  if (error) throw error;

  return {
    totalSessions: data.length,
    totalMinutes: data.reduce((acc, session) => acc + session.duration, 0),
    completedSessions: data.length,
    averageSessionLength: data.length > 0 
      ? data.reduce((acc, session) => acc + session.duration, 0) / data.length 
      : 0
  };
}; 
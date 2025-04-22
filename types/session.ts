export type SessionType = 'focus' | 'break' | 'long_break';

export interface Session {
  id: string;
  user_id: string;
  type: SessionType;
  duration: number; // in seconds
  started_at: string;
  completed_at: string;
  created_at: string;
}

export interface CreateSessionDTO {
  type: SessionType;
  duration: number; // in seconds
  started_at: string;
  completed_at: string;
  user_id: string;
} 
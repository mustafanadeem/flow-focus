export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  requirement: number;
  progress: number;
  completed: boolean;
  imageUrl: string;
}

export type AchievementType = 
  | 'total_focus_time'      // Total seconds spent focusing
  | 'daily_sessions'        // Number of sessions in a day
  | 'streak_days'           // Consecutive days with focus sessions
  | 'early_bird'           // Sessions completed before 10 AM
  | 'night_owl'           // Sessions completed after 8 PM
  | 'perfect_session'     // Completed full session without pausing
  | 'weekly_goal'        // Weekly focus time goal achieved
  | 'session_count';     // Total number of sessions completed 
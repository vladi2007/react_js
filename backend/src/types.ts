export interface DailyProgress {
  date: Date;
  completed: boolean;
}

export interface Habit {
  id: number;
  title: string;
  description: string;
  category: string;
  goalType: string;
  targetValue: number;
  unit: string;
  preferredTime: string;
  motivation: string;
  reward: string;
  priority: string;
  status: string;
  difficulty: string;
  createdAt: Date;
  startDate: Date;
  targetDate: Date;
  endDate?: Date;
  dailyProgress?: DailyProgress[];
}
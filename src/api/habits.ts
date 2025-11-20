import axios from "axios";
import { type Habit } from "../types/types";
const API_URL = "http://localhost:5000";


const transformHabitData = (data: any): Habit => {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    startDate: new Date(data.startDate),
    targetDate: new Date(data.targetDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    dailyProgress: data.dailyProgress?.map((progress: any) => ({
      date: new Date(progress.date),
      completed: Boolean(progress.completed)
    }))
  };
};

export const getHabits = async (): Promise<Habit[]> => {
  const res = await axios.get(`${API_URL}/habits`);
  return res.data.map(transformHabitData);
};

export const createHabit = async (habitData: Partial<Habit>) => {
  const dataToSend = {
    ...habitData,
    createdAt: habitData.createdAt?.toISOString(),
    startDate: habitData.startDate?.toISOString(),
    targetDate: habitData.targetDate?.toISOString(),
    endDate: habitData.endDate?.toISOString(),
  };
  
  const res = await axios.post(`${API_URL}/habits`, dataToSend);
  return res.data;
};
export const updateHabit = async (id: number, habitData: Partial<Habit>) => {
  const res = await axios.put(`${API_URL}/habits/${id}`, habitData);
  return res.data;
};

export const toggleHabitToday = async (habitId: number, completed: boolean): Promise<Habit[]> => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 
  
   await axios.patch(`${API_URL}/habits/${habitId}/progress`, {
    date: today,
    completed
  });
  
  const habits = await getHabits();
  return habits;
};
// api/habits.ts
import api from './api';

const getHabits = async () => {
  const response = await api.get('habits');
  return response.data;
};

const createHabit = async (habitData: any) => {
  const response = await api.post('habits', habitData);
  return response.data;
};

const updateHabit = async (id: string, habitData: any) => {
  const response = await api.patch(`habits/${id}`, habitData);
  return response.data;
};

const deleteHabit = async (id: string) => {
  const response = await api.delete(`habits/${id}`);
  return response.data;
};

// Новая функция для обновления прогресса на сегодня
const toggleHabitToday = async (habit: any) => {
  const todayISO = new Date().toISOString().slice(0, 10);
  const updatedProgress = habit.dailyProgress ? [...habit.dailyProgress] : [];
  const index = updatedProgress.findIndex((p) => p.date === todayISO);

  if (index === -1) {
    updatedProgress.push({ date: todayISO, completed: true });
  } else {
    updatedProgress[index].completed = !updatedProgress[index].completed;
  }

  const response = await api.patch(`habits/${habit.id}`, { dailyProgress: updatedProgress });
  return response.data;
};

export { getHabits, createHabit, updateHabit, deleteHabit, toggleHabitToday };

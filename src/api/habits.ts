import api from './api';

// Получить все привычки
const getHabits = async () => {
  try {
    const response = await api.get('habits');
    return response.data;
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

// Создать новую привычку
const createHabit = async (habitData) => {
  try {
    const response = await api.post('habits', habitData);
    return response.data;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

// Обновить привычку
const updateHabit = async (id, habitData) => {
  try {
    const response = await api.put('habits', id, habitData);
    return response.data;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

// Удалить привычку
const deleteHabit = async (id) => {
  try {
    const response = await api.delete('habits', id);
    return response.data;
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};

export { getHabits, createHabit, updateHabit, deleteHabit };
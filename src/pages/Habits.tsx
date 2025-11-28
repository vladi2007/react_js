// pages/CreateHabitPage.tsx
import React, { useState } from "react";
import axios from "axios";
import '../styles/CreateHabitPage.scss';
import { useHabits } from "../hooks/useHabits";
interface HabitFormData {
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
  difficulty: string;
  startDate: string;
  targetDate: string;
}

const CreateHabitPage: React.FC = () => {
    const { createHabitAsync } = useHabits();
  const [formData, setFormData] = useState<HabitFormData>({
    title: "",
    description: "",
    category: "Здоровье",
    goalType: "daily",
    targetValue: 1,
    unit: "раз",
    preferredTime: "утро",
    motivation: "",
    reward: "",
    priority: "medium",
    difficulty: "medium",
    startDate: new Date().toISOString().split('T')[0],
    targetDate: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "targetValue" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);
  setIsSubmitting(true);

  // Валидация
  if (!formData.title.trim()) {
    setError("Пожалуйста, введите название привычки");
    setIsSubmitting(false);
    return;
  }

  if (!formData.startDate || !formData.targetDate) {
    setError("Пожалуйста, укажите дату начала и окончания");
    setIsSubmitting(false);
    return;
  }

  if (new Date(formData.targetDate) <= new Date(formData.startDate)) {
    setError("Дата окончания должна быть позже даты начала");
    setIsSubmitting(false);
    return;
  }

  try {
    const habitData = {
      ...formData,
      status: "active",
      // Форматируем дату для MySQL
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // Отправляем на ваш локальный бэкенд
    const response = await createHabitAsync(habitData);
    setSuccess(`Привычка "${formData.title}" успешно создана!`);
    
    // Сброс формы
    setFormData({
      title: "",
      description: "",
      category: "Здоровье",
      goalType: "daily",
      targetValue: 1,
      unit: "раз",
      preferredTime: "утро",
      motivation: "",
      reward: "",
      priority: "medium",
      difficulty: "medium",
      startDate: new Date().toISOString().split('T')[0],
      targetDate: "",
    });
  } catch (err: any) {
    console.error("Error creating habit:", err);
    setError(err.response?.data?.error || "Ошибка при создании привычки. Проверьте подключение к серверу.");
  } finally {
    setIsSubmitting(false);
  }
};

  const isRequired = (fieldName: string) => {
    const requiredFields = ['title', 'startDate', 'targetDate'];
    return requiredFields.includes(fieldName);
  };

  return (
    <div className="create-habit-page">
      <h1>Создать новую привычку</h1>
      
      <form onSubmit={handleSubmit} className="habit-form">
        {/* Основная информация */}
        <div className="form-section">
          <div className="section-title">Основная информация</div>
          
          <div className="form-group">
            <label className={isRequired('title') ? 'required' : ''}>Название привычки</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                placeholder="Например: Утренняя зарядка"
                required
              />
            </div>
            <div className="input-hint">Краткое и понятное название</div>
          </div>

          <div className="form-group">
            <label>Описание</label>
            <div className="input-wrapper">
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Опишите вашу привычку подробнее..."
              />
            </div>
          </div>
        </div>

        {/* Настройки цели */}
        <div className="form-section">
          <div className="section-title">Настройки цели</div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Категория</label>
              <div className="input-wrapper">
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Здоровье">Здоровье</option>
                  <option value="Спорт">Спорт</option>
                  <option value="Образование">Образование</option>
                  <option value="Работа">Работа</option>
                  <option value="Личное">Личное</option>
                  <option value="Финансы">Финансы</option>
                  <option value="Творчество">Творчество</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Тип цели</label>
              <div className="input-wrapper">
                <select name="goalType" value={formData.goalType} onChange={handleChange}>
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                  <option value="monthly">Ежемесячно</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Цель (значение)</label>
              <div className="input-wrapper">
                <input 
                  type="number" 
                  name="targetValue" 
                  value={formData.targetValue} 
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Единицы измерения</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="unit" 
                  value={formData.unit} 
                  onChange={handleChange}
                  placeholder="раз, минут, страниц..."
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Предпочтительное время</label>
            <div className="input-wrapper">
              <select name="preferredTime" value={formData.preferredTime} onChange={handleChange}>
                <option value="утро">Утро</option>
                <option value="день">День</option>
                <option value="вечер">Вечер</option>
                <option value="весь день">Весь день</option>
              </select>
            </div>
          </div>
        </div>

        {/* Дополнительные настройки */}
        <div className="form-section">
          <div className="section-title">Дополнительные настройки</div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Приоритет</label>
              <div className="input-wrapper">
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Сложность</label>
              <div className="input-wrapper">
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option value="easy">Легкая</option>
                  <option value="medium">Средняя</option>
                  <option value="hard">Сложная</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Мотивация</label>
            <div className="input-wrapper">
              <textarea 
                name="motivation" 
                value={formData.motivation} 
                onChange={handleChange}
                placeholder="Что вас мотивирует выполнять эту привычку?"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Награда</label>
            <div className="input-wrapper">
              <textarea 
                name="reward" 
                value={formData.reward} 
                onChange={handleChange}
                placeholder="Какую награду вы себе пообещаете?"
              />
            </div>
          </div>
        </div>

        {/* Даты */}
        <div className="form-section">
          <div className="section-title">Период выполнения</div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="required">Дата начала</label>
              <div className="input-wrapper">
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="required">Дата окончания</label>
              <div className="input-wrapper">
                <input 
                  type="date" 
                  name="targetDate" 
                  value={formData.targetDate} 
                  onChange={handleChange}
                  min={formData.startDate}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="button-loading">
              <div className="spinner"></div>
              Создание...
            </span>
          ) : (
            'Создать привычку'
          )}
        </button>
      </form>

      <div className="form-messages">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
};

export default CreateHabitPage;
// pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHabits,
  toggleHabitToday as toggleHabitTodayAPI,
} from "../api/habits";
import "../styles/Dashboard.scss";

interface Habit {
  id: string;
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
  createdAt: string;
  startDate: string;
  targetDate: string;
  endDate?: string;
  dailyProgress?: { date: string; completed: boolean }[];
}

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const goto = (url: string) => () => navigate(url);

  const todayISO = new Date().toISOString().slice(0, 10);

  const isHabitDoneToday = (habit: Habit) =>
    habit.dailyProgress?.some((p) => p.date === todayISO && p.completed);

  const toggleHabitToday = async (habit: Habit) => {
    try {
      await toggleHabitTodayAPI(habit);
      loadHabits();
    } catch (error) {
      console.error("Ошибка обновления привычки за сегодня:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#10b981",
    };
    return colors[priority] || "#6b7280";
  };

  // Проверка, что привычка завершена полностью
  const isHabitFullyCompleted = (habit: Habit) => {
    const today = new Date();
    const target = new Date(habit.targetDate);

    if (target > today) return false;

    const start = new Date(habit.startDate);
    const dayCount = Math.ceil(
      (target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1
    );

    const completedDays =
      habit.dailyProgress?.filter((p) => p.completed).length || 0;

    return completedDays >= dayCount;
  };

  const todayCompletedHabits = habits.filter((h) => isHabitDoneToday(h));
  const completedHabits = habits.filter((h) => isHabitFullyCompleted(h));

  const stats = {
    totalHabits: habits.length,
    completedToday: todayCompletedHabits.length,
    completedTotal: completedHabits.length,
    activeHabits: habits.filter(
      (h) => h.status === "active" && !isHabitFullyCompleted(h)
    ).length,
    highPriority: habits.filter((h) => h.priority === "high").length,
  };

  const motivationMessages = [
    "Отличный старт! Продолжайте в том же духе! ",
    "Вы на правильном пути! Каждый день - это новый шанс! ",
    "Последовательность - ключ к успеху! ",
    "Маленькие шаги приводят к большим результатам! ",
    "Сегодня - прекрасный день для новых достижений! ",
  ];

  const randomMessage =
    motivationMessages[Math.floor(Math.random() * motivationMessages.length)];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Загружаем ваши привычки...</div>
      </div>
    );
  }

  const recentHabits = habits.filter((habit) => {
    const today = new Date();
    const targetDate = new Date(habit.targetDate);
    return !habit.endDate && targetDate >= today;
  });

  const highPriorityHabits = habits
    .filter((h) => h.priority === "high")
    .slice(0, 43);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Добро пожаловать! </h1>
        <p>Обзор вашего прогресса привычек</p>
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalHabits}</div>
              <div className="stat-label">Всего привычек</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completedToday}</div>
              <div className="stat-label">Выполнено сегодня</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.activeHabits}</div>
              <div className="stat-label">Активных</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completedTotal}</div>
              <div className="stat-label">Всего завершено</div>
            </div>
          </div>

          <section className="today-section">
            <h2>Привычки на сегодня</h2>
            {recentHabits.length === 0 ? (
              <div className="empty-state">
                <p>У вас пока нет привычек. Создайте первую!</p>
                <button className="btn btn-primary" onClick={goto("/habits")}>
                  Создать привычку
                </button>
              </div>
            ) : (
              <div className="habits-list">
                {recentHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className={`habit-item ${
                      isHabitFullyCompleted(habit) ? "completed" : ""
                    }`}
                  >
                    <div className="habit-info">
                      <span className="habit-name">{habit.title}</span>
                      <span className="habit-category">{habit.category}</span>
                    </div>
                    <span
                      className="habit-priority"
                      style={{
                        backgroundColor: getPriorityColor(habit.priority),
                      }}
                    >
                      {habit.priority === "high"
                        ? "высокий"
                        : habit.priority === "medium"
                        ? "средний"
                        : "низкий"}
                    </span>
                    <button
                      onClick={() => toggleHabitToday(habit)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: isHabitDoneToday(habit)
                          ? "#10b981"
                          : "#6b7280",
                      }}
                    >
                      {isHabitDoneToday(habit)
                        ? "Сегодня сделано"
                        : "Сделать сегодня"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {todayCompletedHabits.length > 0 && (
            <section className="completed-section">
              <h2> Завершено сегодня</h2>
              <div className="completed-list">
                {todayCompletedHabits.map((habit) => {
                  const todayProgress = habit.dailyProgress?.find(
                    (p) => p.date === todayISO
                  );
                  const completedTime = todayProgress?.completed
                    ? new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  return (
                    <div key={habit.id} className="completed-item">
                      <span className="completed-name">{habit.title}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="progress-section">
            <h2>Важные привычки</h2>
            <div className="progress-chart">
              {highPriorityHabits.map((habit) => (
                <div key={habit.id} className="progress-item">
                  <span className="habit-name">{habit.title}</span>
                  <div className="progress-info">
                    <span className="habit-target">
                      {habit.targetValue} {habit.unit}
                    </span>
                    <span
                      className={`habit-status ${
                        isHabitFullyCompleted(habit) ? "completed" : ""
                      }`}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Правая колонка */}
        <div className="right-column">
          <section className="quick-actions">
            <h2>Быстрые действия</h2>
            <div className="actions-grid">
              <button className="action-card" onClick={goto("/habits")}>
                <div className="action-text">Новая привычка</div>
              </button>
              <button className="action-card" onClick={goto("/analytics")}>
                <div className="action-text">Смотреть аналитику</div>
              </button>
              <button className="action-card" onClick={goto("/habits")}>
                <div className="action-text">Мои привычки</div>
              </button>
              <button className="action-card" onClick={goto("/profile")}>
                <div className="action-text">Настройки</div>
              </button>
            </div>
          </section>

          <section className="motivation-section">
            <h2>Мотивация</h2>
            <div className="motivation-text">{randomMessage}</div>
            <div className="motivation-stats">
              <div className="motivation-stat">
                <span className="stat-value">{stats.totalHabits}</span>
                <span className="stat-label">Всего привычек</span>
              </div>
              <div className="motivation-stat">
                <span className="stat-value">{stats.completedTotal}</span>
                <span className="stat-label">Завершено</span>
              </div>
            </div>
          </section>

          <section className="categories-section">
            <h2>По категориям</h2>
            <div className="categories-list">
              {Array.from(new Set(habits.map((h) => h.category))).map(
                (category) => {
                  const count = habits.filter(
                    (h) => h.category === category
                  ).length;
                  const completed = habits.filter(
                    (h) => h.category === category && isHabitFullyCompleted(h)
                  ).length;
                  return (
                    <div key={category} className="category-item">
                      <span className="category-name">{category}</span>
                      <span className="category-count">
                        {completed}/{count}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

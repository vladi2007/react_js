// Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { type Habit } from "../types/types";
import "../styles/Dashboard.scss";
import { useHabits } from "../hooks/useHabits";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { habitsQuery, toggleHabitAsync } = useHabits();
  const habits: Habit[] = habitsQuery.data ?? [];
  const loading = habitsQuery.isLoading;

  const normalizeDate = (date: Date | string): Date => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const isSameDay = (d1: Date | string, d2: Date | string): boolean => {
    return normalizeDate(d1).getTime() === normalizeDate(d2).getTime();
  };

  const isHabitDoneToday = (habit: Habit): boolean => {
    const today = new Date();
    return (
      habit.dailyProgress?.some(
        (progress) =>
          isSameDay(progress.date, today) && Boolean(progress.completed)
      ) || false
    );
  };

  const handleToggleHabitToday = async (habit: Habit) => {
    const currentlyCompleted = isHabitDoneToday(habit);
    try {
      await toggleHabitAsync({
        id: habit.id,
        completed: !currentlyCompleted,
      });
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const today = normalizeDate(new Date());

  const stats = {
    totalHabits: habits.length,
    completedToday: habits.filter(isHabitDoneToday).length,
    activeHabits: habits.filter((h) => h.status === "active").length,
    completedTotal: habits.filter((h) => h.status === "completed").length,
  };

  const todayCompletedHabits = habits.filter(isHabitDoneToday);

  const goto = (url: string) => () => navigate(url);

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#10b981",
    };
    return colors[priority];
  };

  const motivationMessages = [
    "Отличный старт! Продолжайте в том же духе!",
    "Вы на правильном пути! Каждый день — это новый шанс!",
    "Последовательность — ключ к успеху!",
    "Маленькие шаги приводят к большим результатам!",
    "Сегодня — прекрасный день для новых достижений!",
  ];

  const randomMessage =
    motivationMessages[Math.floor(Math.random() * motivationMessages.length)];

  const recentHabits = habits.filter(
    (habit) =>
      !habit.endDate &&
      normalizeDate(habit.targetDate) >= today &&
      habit.status === "active"
  );

  const highPriorityHabits = habits
    .filter(
      (h) =>
        h.priority === "high" &&
        h.status === "active" &&
        normalizeDate(h.targetDate) >= today
    )
    .slice(0, 3);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Загружаем ваши привычки...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Добро пожаловать!</h1>
        <p>Обзор вашего прогресса привычек</p>
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          {/* STAT CARDS */}
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

          {/* HABITS FOR TODAY */}
          <section className="today-section">
            <h2>Привычки на сегодня</h2>

            {recentHabits.length === 0 ? (
              <div className="empty-state">
                <p>Вы выполнили все привычки</p>
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
                      isHabitDoneToday(habit) ? "completed" : ""
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
                      onClick={() => handleToggleHabitToday(habit)}
                      className={`toggle-btn ${
                        isHabitDoneToday(habit) ? "completed" : ""
                      }`}
                    >
                      {isHabitDoneToday(habit)
                        ? "Выполнено"
                        : "Отметить выполнение"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* TODAY COMPLETED */}
          {todayCompletedHabits.length > 0 && (
            <section className="completed-section">
              <h2>Завершено сегодня</h2>
              <div className="completed-list">
                {todayCompletedHabits.map((habit) => (
                  <div key={habit.id} className="completed-item">
                    <span className="completed-name">{habit.title}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* HIGH PRIORITY */}
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
                        isHabitDoneToday(habit) ? "completed" : ""
                      }`}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
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
                    (h) => h.category === category && h.status === "active"
                  ).length;
                  const completed = habits.filter(
                    (h) => h.category === category && isHabitDoneToday(h)
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

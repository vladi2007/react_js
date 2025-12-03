import React, { useMemo, useCallback } from "react";
import "../styles/CreateHabitPage.scss";
import { useHabits } from "../hooks/useHabits";

import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormValidation } from "../hooks/useForm";
import ErrorMessage from "../components/ErrorMessage";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HabitFormData>({
    resolver: yupResolver(useFormValidation),
    defaultValues: {
      category: "Здоровье",
      goalType: "daily",
      targetValue: 1,
      unit: "раз",
      preferredTime: "утро",
      priority: "medium",
      difficulty: "medium",
    },
  });

  const addHours = useCallback((dateStr: string | Date, hours: number) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() + hours);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }, []);

  const onSubmit: SubmitHandler<HabitFormData> = useCallback(
    async (data: HabitFormData) => {
      try {
        console.log("Форма отправлена, data =", data);

        const habitData = {
          ...data,
          status: "active",
          startDate: addHours(data.startDate, 5),
          targetDate: addHours(data.targetDate, 5),
          createdAt: addHours(new Date(), 5),
        };

        await createHabitAsync(habitData);
        reset();
      } catch (err) {
        console.error("Ошибка при создании привычки:", err);
      }
    },
    [ addHours,createHabitAsync, reset]
  );

  return (
    <div className="create-habit-page">
      <h1>Создать новую привычку</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="habit-form">
        <div className="form-group">
          <label>Название привычки</label>
          <input
            type="text"
            className={errors.title ? "error" : ""}
            {...register("title")}
          />
          <ErrorMessage message={errors.title?.message} />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            className={errors.description ? "error" : ""}
            {...register("description")}
          />
          <ErrorMessage message={errors.description?.message} />
        </div>

        <div className="form-group">
          <label>Категория</label>
          <select
            className={errors.category ? "error" : ""}
            {...register("category")}
          >
            <option value="Здоровье">Здоровье</option>
            <option value="Спорт">Спорт</option>
            <option value="Образование">Образование</option>
            <option value="Работа">Работа</option>
            <option value="Личное">Личное</option>
            <option value="Финансы">Финансы</option>
            <option value="Творчество">Творчество</option>
          </select>
          <ErrorMessage message={errors.category?.message} />
        </div>

        <div className="form-group">
          <label>Тип цели</label>
          <select
            className={errors.goalType ? "error" : ""}
            {...register("goalType")}
          >
            <option value="daily">Ежедневно</option>
            <option value="weekly">Еженедельно</option>
            <option value="monthly">Ежемесячно</option>
          </select>
          <ErrorMessage message={errors.goalType?.message} />
        </div>

        <div className="form-group">
          <label>Цель</label>
          <input
            type="number"
            className={errors.targetValue ? "error" : ""}
            {...register("targetValue")}
          />
          <ErrorMessage message={errors.targetValue?.message} />
        </div>

        <div className="form-group">
          <label>Единицы</label>
          <input
            type="text"
            className={errors.unit ? "error" : ""}
            {...register("unit")}
          />
          <ErrorMessage message={errors.unit?.message} />
        </div>

        <div className="form-group">
          <label>Предпочтительное время</label>
          <select
            className={errors.preferredTime ? "error" : ""}
            {...register("preferredTime")}
          >
            <option value="утро">Утро</option>
            <option value="день">День</option>
            <option value="вечер">Вечер</option>
            <option value="весь день">Весь день</option>
          </select>
          <ErrorMessage message={errors.preferredTime?.message} />
        </div>

        <div className="form-group">
          <label>Дата начала</label>
          <input
            type="date"
            className={errors.startDate ? "error" : ""}
            {...register("startDate")}
          />
          <ErrorMessage message={errors.startDate?.message} />
        </div>

        <div className="form-group">
          <label>Дата окончания</label>
          <input
            type="date"
            className={errors.targetDate ? "error" : ""}
            {...register("targetDate")}
          />
          <ErrorMessage message={errors.targetDate?.message} />
        </div>

        <div className="form-group">
          <label>Приоритет</label>
          <select
            className={errors.priority ? "error" : ""}
            {...register("priority")}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
          <ErrorMessage message={errors.priority?.message} />
        </div>

        <div className="form-group">
          <label>Сложность</label>
          <select
            className={errors.difficulty ? "error" : ""}
            {...register("difficulty")}
          >
            <option value="easy">Легкая</option>
            <option value="medium">Средняя</option>
            <option value="hard">Сложная</option>
          </select>
          <ErrorMessage message={errors.difficulty?.message} />
        </div>

        <div className="form-group">
          <label>Мотивация</label>
          <textarea
            className={errors.motivation ? "error" : ""}
            {...register("motivation")}
          />
        </div>

        <div className="form-group">
          <label>Награда</label>
          <textarea
            className={errors.reward ? "error" : ""}
            {...register("reward")}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Создание..." : "Создать привычку"}
        </button>
      </form>
    </div>
  );
};

export default CreateHabitPage;

import * as yup from "yup";

export const useFormValidation = yup.object().shape({
  title: yup
    .string()
    .required("Название обязательно")
    .min(2, "Название слишком короткое"),

  description: yup.string().required("Название обязательно"),

  category: yup.string().required("Выберите категорию"),

  goalType: yup.string().oneOf(["daily", "weekly", "monthly"]).required(),

  targetValue: yup
    .number()
    .typeError("Введите число") 
    .required("Введите значение цели")
    .min(1, "Минимум 1"),

  unit: yup.string().required("Введите единицу измерения"),

  preferredTime: yup.string().required(),

  motivation: yup.string().optional(),

  reward: yup.string().optional(),

  priority: yup.string().oneOf(["low", "medium", "high"]).required(),

  difficulty: yup.string().oneOf(["easy", "medium", "hard"]).required(),

  startDate: yup
    .date()
    .required("Дата начала обязательна")
    .typeError("Укажите корректную дату"),

  targetDate: yup
    .date()
    .required("Дата окончания обязательна")
    .typeError("Укажите корректную дату")
    .min(yup.ref("startDate"), "Дата окончания должна быть позже даты начала"),
});

import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";
import {type Habit} from '../src/types'
const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: "172.29.66.191",
  user: "habit_user",
  password: "1234",
  database: "habits_app",
  port:3306
 
});
// server.ts - добавить эти эндпоинты


// Обновить прогресс привычки
// server.ts - обновим эндпоинт PATCH
app.patch("/habits/:id/progress", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, completed } = req.body;
    const normalizedDate = new Date(date).toISOString().split('T')[0];

    // Получаем привычку
    const [habitRows] = await db.query("SELECT * FROM habits WHERE id = ?", [id]);
    const habit = (habitRows as any[])[0];
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    // Получаем прогресс
    const [progressRows] = await db.query(
      "SELECT * FROM daily_progress WHERE habit_id = ? ORDER BY date ASC",
      [id]
    );
    const progress = progressRows as any[];

    // Проверяем, достигнут ли targetValue
    if (progress.length >= habit.targetValue) {
      // Обновляем статус на completed
      if (habit.status !== "completed") {
        await db.query("UPDATE habits SET status = ? WHERE id = ?", ["completed", id]);
      }
      return res.json({ success: false, message: "Target already reached" });
    }

    // Проверяем существующую запись за эту дату
    const existing = progress.find(p => new Date(p.date).toISOString().split('T')[0] === normalizedDate);

    if (existing) {
      // Обновляем существующую запись
      await db.query(
        "UPDATE daily_progress SET completed = ? WHERE id = ?",
        [completed, existing.id]
      );
    } else {
      // Создаем новую запись
      await db.query(
        "INSERT INTO daily_progress (habit_id, date, completed) VALUES (?, ?, ?)",
        [id, normalizedDate, completed]
      );
    }

    // Проверяем, нужно ли обновить статус после добавления
    const [updatedProgressRows] = await db.query(
      "SELECT * FROM daily_progress WHERE habit_id = ?",
      [id]
    );
    const updatedProgress = updatedProgressRows as any[];
    if (updatedProgress.length >= habit.targetValue || new Date(habit.targetDate) <= new Date()) {
      await db.query("UPDATE habits SET status = ? WHERE id = ?", ["completed", id]);
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error updating progress:", err);
    res.status(500).json({ error: err.message });
  }
});


// Получить все привычки

app.get("/habits", async (req: Request, res: Response) => {
  try {
    const [habitsRows] = await db.query("SELECT * FROM habits");
    const habits = habitsRows as any[];

    const today = new Date().toISOString().split("T")[0];

    for (let habit of habits) {
      // 1️⃣ Получаем прогресс привычки
      const [progressRows] = await db.query(
        "SELECT date, completed FROM daily_progress WHERE habit_id = ?",
        [habit.id]
      );

      habit.dailyProgress = (progressRows as any[]).map(p => ({
        date: p.date,
        completed: Boolean(p.completed)
      }));

      // 2️⃣ Автоматически обновляем статус
      const targetDate = habit.targetDate ? new Date(habit.targetDate).toISOString().split("T")[0] : null;
      if (targetDate && targetDate <= today && habit.status !== "completed") {
        habit.status = "completed";

        // Обновляем в базе
        await db.query(
          "UPDATE habits SET status = ? WHERE id = ?",
          [habit.status, habit.id]
        );
      }
    }

    res.json(habits);
  } catch (err: any) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ error: err.message });
  }
});


// Создать привычку
app.post("/habits", async (req: Request, res: Response) => {
  try {
    const {
      title, description, category, goalType, targetValue,
      unit, preferredTime, motivation, reward, priority,
      status, difficulty, createdAt, startDate, targetDate, endDate
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO habits
      (title, description, category, goalType, targetValue, unit, preferredTime,
       motivation, reward, priority, status, difficulty, createdAt, startDate, targetDate, endDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category, goalType, targetValue, unit, preferredTime,
       motivation, reward, priority, status, difficulty, createdAt, startDate, targetDate, endDate || null]
    );

    res.json({ id: (result as any).insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(5000, () => console.log("Server running on port 5000"));

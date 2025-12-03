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
  port:3306,
  dateStrings: true
 
});

app.patch("/habits/:id/progress", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, completed } = req.body;

    console.log(`Updating progress for habit ${id}, date: ${date}, completed: ${completed}`);

    const normalizedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ')

    const [existing] = await db.query(
      "SELECT * FROM daily_progress WHERE habit_id = ? AND DATE(date) = ?",
      [id, normalizedDate]
    );

    if ((existing as any).length > 0) {
      // Обновляем существующую запись
      await db.query(
        "UPDATE daily_progress SET completed = ? WHERE habit_id = ? AND DATE(date) = ?",
        [completed, id, normalizedDate]
      );
    } else {
      await db.query(
        "INSERT INTO daily_progress (habit_id, date, completed) VALUES (?, ?, ?)",
        [id, normalizedDate, completed]
      );
      console.log(`Created new progress record`);
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
    const [habits] = await db.query("SELECT * FROM habits");
    const habitArray = habits as any[];

    for (let habit of habitArray) {
      const [progress] = await db.query(
        "SELECT date, completed FROM daily_progress WHERE habit_id = ?",
        [habit.id]
      );
      
      habit.dailyProgress = (progress as any[]).map(p => ({
        date: p.date, 
        completed: Boolean(p.completed)
      }));
    }

    res.json(habitArray);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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

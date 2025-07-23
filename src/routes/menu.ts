import { Router, Request, Response } from "express";
import Menu, { IDayMenu, IMenu } from "../models/Menu";

const router = Router();

// Get the current week's menu
router.get("/", async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(today.getDate() - today.getDay());
    const menu = await Menu.findOne({ weekStart: { $lte: weekStart } }).sort({
      weekStart: -1,
    });
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Create a new weekly menu
router.post("/", async (req: Request, res: Response) => {
  try {
    const { weekStart, days } = req.body;
    if (!weekStart || !days || days.length !== 7) {
      return res.status(400).json({ message: "Invalid menu data" });
    }
    const menu = new Menu({ weekStart, days });
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get today's menu
router.get("/today", async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(today.getDate() - today.getDay());
    const menu = await Menu.findOne({ weekStart: { $lte: weekStart } }).sort({
      weekStart: -1,
    });
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    const dayIndex = today.getDay();
    res.json(menu.days[dayIndex]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get tomorrow's menu
router.get("/tomorrow", async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(today.getDate() - today.getDay());
    const menu = await Menu.findOne({ weekStart: { $lte: weekStart } }).sort({
      weekStart: -1,
    });
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    let dayIndex = today.getDay() + 1;
    if (dayIndex > 6) dayIndex = 0; // wrap to Sunday
    res.json(menu.days[dayIndex]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
// Get menu for a specific week (by weekStart date)
router.get("/:date", async (req: Request, res: Response) => {
  try {
    const weekStart = new Date(req.params.date);
    if (isNaN(weekStart.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    const menu = await Menu.findOne({ weekStart });
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;

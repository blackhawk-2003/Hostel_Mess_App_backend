import { Router, Request, Response } from "express";
import Menu, { IMenu } from "../models/Menu";

const router = Router();

// Get today's menu
router.get("/today", async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const menu = await Menu.findOne({ date: todayDate });
    if (!menu)
      return res.status(404).json({ message: "Menu not found for today" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get tomorrow's menu
router.get("/tomorrow", async (_req: Request, res: Response) => {
  try {
    const tomorrow = new Date(Date.now() + 86400000);
    const tomorrowDate = tomorrow.toISOString().slice(0, 10);
    const menu = await Menu.findOne({ date: tomorrowDate });
    if (!menu)
      return res.status(404).json({ message: "Menu not found for tomorrow" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Create or update menu(s) for specific day(s) (bulk or single)
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // If data is an array, handle bulk insert/update
    if (Array.isArray(data)) {
      const results = [];
      for (const item of data) {
        const { date, day, breakfast, lunch, snacks, dinner } = item;
        if (!date || !day || !breakfast || !lunch || !snacks || !dinner) {
          return res
            .status(400)
            .json({ message: "Missing required fields in one or more items" });
        }
        const menu = await Menu.findOneAndUpdate(
          { date },
          { day, breakfast, lunch, snacks, dinner },
          { new: true, upsert: true }
        );
        results.push(menu);
      }
      return res.status(201).json(results);
    }

    // Otherwise, handle single object as before
    const { date, day, breakfast, lunch, snacks, dinner } = data;
    if (!date || !day || !breakfast || !lunch || !snacks || !dinner) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const menu = await Menu.findOneAndUpdate(
      { date },
      { day, breakfast, lunch, snacks, dinner },
      { new: true, upsert: true }
    );
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get menu for a specific date
router.get("/:date", async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const menu = await Menu.findOne({ date });
    if (!menu)
      return res.status(404).json({ message: "Menu not found for this date" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;

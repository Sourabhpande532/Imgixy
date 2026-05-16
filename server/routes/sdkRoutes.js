import express from "express";
const router = express.Router();
import generateTravelPlan from "../services/aiService.js";
import tryParseModelJSON from "../utils/parseJSON.js";
import { error } from "console";

router.get("/sdk/plan", async (req, res) => {
  const city = req.query.city || "Tokyo";
  const country = req.query.country || "Japan";
  const days = Number(req.query.days) || 3;
  try {
    const content = await generateTravelPlan(city, country, days);
    const parsed = tryParseModelJSON(content);
    if (parsed.ok) return res.json(parsed.value);
    return res.status(502).json({
      error: "Invalid JSON From AI",
      raw: content,
    });
  } catch (error) {
    return res.status(500).json({
      error: "AI failed",
      detail: e.message,
    });
  }
});

router.post("/sdk/plan/generate", async (req, res) => {
  const { city, country, days } = req.body;
  try {
    const content = await generateTravelPlan(city, country, days);
    const parsed = tryParseModelJSON(content);
    if (parsed.ok) return res.json(parsed.value);
    return res.status(502).json({
      error: "Invalid JSON from AI",
      raw: content,
    });
  } catch (error) {
    return res.status(500).json({
      error: "AI failed",
      detail: e.message,
    });
  }
});

export default router;

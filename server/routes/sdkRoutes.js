import express from "express";
import OpenAI from "openai";
import tryParseModelJSON from "../utils/parseJSON.js";

const router = express.Router();

// Initialize OpenAI client pointing to OpenRouter
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "fallback-key",
});

const MODEL = "openai/gpt-4o-mini";

const SYSTEM_PROMPT = `
You are the Imgixy AI Photo & Aesthetic Planner, a professional creative director and photo curation assistant.
Your task is to generate a comprehensive, highly creative Photo Curation & Aesthetic Plan based on three inputs:
1. Photo Style (e.g. Cinematic, Portrait, Cyberpunk, Retro/Vintage, Minimalist)
2. Album Theme (e.g. Travel, Wedding, Nature, Neon Cityscape, Street Vibe, Monochromatic, Fantasy)
3. Showcase Slots / Photo Count (e.g. 3, which dictates the number of shots/steps in the curation plan)

You MUST respond strictly in the following JSON format:
{
  "destination": "A stunning, creative title/concept for the photoshoot or album",
  "best_time": "The absolute optimal lighting, camera settings, or setup environment (e.g., 'Golden Hour with a 50mm f/1.8 prime lens')",
  "duration_days": number (representing the target photo count or curation days),
  "top_attractions": ["Composition technique 1", "Composition technique 2", "Composition technique 3", etc. (minimum 3 specific techniques)],
  "sample_itinerary": [
    {"day": 1, "plan": "Detailed instruction for Shot #1: setup, camera angle, subject placement, and step-by-step editing/color-grading advice in Imgixy"},
    {"day": 2, "plan": "Detailed instruction for Shot #2: setup, camera angle, subject placement, and step-by-step editing/color-grading advice in Imgixy"}
  ],
  "estimated_budget_eur": {"low": number, "mid": number, "high": number} (representing estimated production costs for gear/props/filters),
  "local_tips": ["Pro photography tip 1", "Creative editing tip 2", "Composition tip 3"]
}

Make sure the suggestions are actionable, professional, and match the specified theme, style, and mood. Respond ONLY in valid JSON. No other text, no markdown wrappers, just raw JSON.
`;

function buildFallbackPlan(photoStyle, albumTheme, count) {
  const slots = Math.max(1, Math.min(Number(count) || 3, 12));
  const shotTemplates = [
    `Wide establishing frame capturing the ${albumTheme} atmosphere in a ${photoStyle} aesthetic. Shoot at eye level with leading lines drawing attention to the primary focal point, then apply warm highlight recovery and subtle shadow contrast in Imgixy.`,
    `Medium portrait or subject study isolating textures and mood. Use a shallow depth of field (f/1.8–f/2.8) to separate the foreground from ambient light sources, and tag key visual motifs for instant filtering.`,
    `Close-up detail composition emphasizing color harmony, reflections, and tactile surfaces. Frame off-center using the rule of thirds and balance color temperature for cohesive album curation.`,
    `Dynamic low-angle perspective highlighting architectural or natural geometry within ${albumTheme}. Preserve crisp midtone clarity and star your strongest take as a featured album favorite.`,
    `Candid motion or silhouette frame shot against directional backlight. Underexpose by 0.7 EV to protect highlights and enrich shadow tones across the sequence.`,
    `Overhead or symmetrical flat-lay arrangement tying together the visual narrative of your ${photoStyle} series.`,
    `Atmospheric twilight or ambient-light closing shot that anchors the final sequence of the collection.`,
  ];

  const itinerary = Array.from({ length: slots }, (_, idx) => ({
    day: idx + 1,
    plan: shotTemplates[idx % shotTemplates.length],
  }));

  return {
    destination: `${photoStyle} ${albumTheme} — Curated Visual Series`,
    best_time: "Golden Hour / Blue Hour with 35mm or 50mm prime lens (f/1.8, ISO 200)",
    duration_days: slots,
    top_attractions: [
      "Leading Lines & Depth Layering",
      "Rule of Thirds with Negative Space",
      "Directional Backlighting & Rim Highlights",
      "Color Contrast & Tonal Separation",
    ],
    sample_itinerary: itinerary,
    estimated_budget_eur: {
      low: slots * 25,
      mid: slots * 60,
      high: slots * 140,
    },
    local_tips: [
      `Group your ${albumTheme} uploads with consistent lowercase tags (e.g., #${String(photoStyle).toLowerCase().replace(/[^a-z0-9]/g, "")}, #${String(albumTheme).toLowerCase().split(" ")[0]}) for one-click album filtering.`,
      "Use the Favorites star badge to shortlist hero shots before sharing the album with collaborators.",
      "Maintain consistent white balance across all slots so the gallery grid feels cohesive at a glance.",
    ],
  };
}

async function generateAestheticPlan(photoStyle, albumTheme, count) {
  const userPrompt = `Create a ${count}-slot/day photo curation plan with the style '${photoStyle}' and theme '${albumTheme}'.`;
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 1500,
  });
  return response.choices?.[0]?.message?.content || "";
}

// SSE helper
const sendSSE = (res, event, data) => {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

const setupSSEHeaders = (req, res) => {
  const allowedOrigin = process.env.FRONTEND_URL || req.headers.origin;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.flushHeaders();
};

const handlePlanStream = async (req, res, city, country, days) => {
  setupSSEHeaders(req, res);

  const style = city || "Cinematic";
  const theme = country || "Neon Cityscape";
  const slots = Number(days) || 3;

  sendSSE(res, "status", {
    text: "Analyzing your aesthetic request...",
    type: "thinking",
  });

  try {
    sendSSE(res, "status", {
      text: "AI is generating creative plan...",
      type: "thinking",
    });
    const content = await generateAestheticPlan(style, theme, slots);
    const parsed = tryParseModelJSON(content);

    if (parsed.ok && parsed.value) {
      sendSSE(res, "done", { data: parsed.value });
    } else {
      sendSSE(res, "done", { data: buildFallbackPlan(style, theme, slots) });
    }
  } catch {
    sendSSE(res, "done", { data: buildFallbackPlan(style, theme, slots) });
  } finally {
    res.end();
  }
};

router.get("/sdk/plan", async (req, res) => {
  await handlePlanStream(
    req,
    res,
    req.query.city,
    req.query.country,
    req.query.days,
  );
});

router.post("/sdk/plan/generate", async (req, res) => {
  const { city, country, days } = req.body || {};
  await handlePlanStream(req, res, city, country, days);
});

export default router;

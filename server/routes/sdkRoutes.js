import express from "express";
import OpenAI from "openai";
import tryParseModelJSON from "../utils/parseJSON.js";

const router = express.Router();

// Initialize OpenAI client pointing to OpenRouter
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
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

router.get("/sdk/plan", async (req, res) => {
  // Setup SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.flushHeaders();

  const city = req.query.city || "Cinematic";
  const country = req.query.country || "Neon Cityscape";
  const days = Number(req.query.days) || 3;
  
  sendSSE(res, 'status', { text: '🔍 Analyzing your aesthetic request...', type: 'thinking' });

  try {
    sendSSE(res, 'status', { text: '🧠 AI is generating creative plan...', type: 'thinking' });
    const content = await generateAestheticPlan(city, country, days);
    const parsed = tryParseModelJSON(content);
    
    if (parsed.ok) {
      sendSSE(res, 'done', { data: parsed.value });
    } else {
      sendSSE(res, 'error', { 
        error: "Unable to generate response right now. Please try again after some time.", 
        raw: content 
      });
    }
  } catch (error) {
    sendSSE(res, 'error', { 
      error: "Unable to generate response right now. Please try again after some time.", 
      detail: error.message 
    });
  } finally {
    res.end();
  }
});

router.post("/sdk/plan/generate", async (req, res) => {
  // Setup SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.flushHeaders();

  const { city, country, days } = req.body;
  
  sendSSE(res, 'status', { text: '🔍', type: 'thinking' });

  try {
    sendSSE(res, 'status', { text: '...', type: 'thinking' });
    const content = await generateAestheticPlan(city, country, days);
    const parsed = tryParseModelJSON(content);
    
    if (parsed.ok) {
      sendSSE(res, 'done', { data: parsed.value });
    } else {
      sendSSE(res, 'error', { 
        error: "Unable to generate response right now. Please try again after some time.", 
        raw: content 
      });
    }
  } catch (error) {
    sendSSE(res, 'error', { 
      error: "Unable to generate response right now. Please try again after some time.", 
      detail: error.message 
    });
  } finally {
    res.end();
  }
});

export default router;


import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

if (!process.env.OPENROUTER_API_KEY) {
  console.error(
    "Please set OPENROUTER_API_KEY in your .env befour running lesson 05",
  );
  process.exit(1);
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = "nvidia/nemotron-3-nano-30b-a3b:free";

const SYSTEM_PROMPT = `
You are an AI travel agent. Respond ONLY in JSON.

{
 "destination": "string",
 "best_time": "string",
 "duration_days": number,
 "top_attractions": ["string"],
 "sample_itinerary": [
  {"day":1,"plan":"string"}
 ],
 "estimated_budget_eur": {"low":number,"mid":number,"high":number},
 "local_tips": ["string"]
}
`;

async function generateTravelPlan(city, country, days) {
  const userPrompt = `Create a ${days}-day travel plan for ${city}, ${country}`;
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
export default generateTravelPlan;

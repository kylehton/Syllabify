import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an assistant that extracts important dates from a syllabus. 
Output your response **only** as valid JSON in the following format:

{
  "dates": [
    {
      "name": "Name of the event",
      "date": "YYYY-MM-DDTHH:MM:SS-08:00",
      "type": "exam | homework | project"
    }
  ]
}

Rules:
1. Only output JSON, no extra text.
2. "date" must be in **RFC3339 format** with PST/PDT offset (e.g., -08:00 for standard time, -07:00 for daylight time).
3. "type" must be one of: "exam", "homework", or "project".
4. Include all relevant assignments, projects, and exams.
5. Do not include trailing commas or extra braces.
`;


export const POST = async (request: NextRequest) => {
  const text = await request.text();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {role: "system", content: systemPrompt },
        {role: "user", content: text }],
  });
  return NextResponse.json({ response: response.choices[0].message.content });
};
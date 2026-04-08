import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { name, summary, careerIntent } = await req.json();

    if (!careerIntent) {
      return NextResponse.json({ error: "Career intent is required" }, { status: 400 });
    }

    const prompt = `
      You are an ATS (Applicant Tracking System) expert.
      The user is building a resume for the role: "${careerIntent}".
      
      Current Summary:
      "${summary || "N/A"}"
      
      Identify 10-15 high-impact ATS keywords (skills, technologies, certifications, and industry terms) that would help this resume rank higher for this specific role.
      
      Return ONLY a JSON object with a "keywords" array of strings.
      Example: { "keywords": ["React", "TypeScript", "CI/CD", "Cloud Architecture"] }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return NextResponse.json(JSON.parse(completion.choices[0].message.content || '{"keywords": []}'));
    } catch (aiError) {
      console.error("AI Keyword Suggestion Error:", aiError);
      // Fallback: Generic keywords for common roles if AI fails
      return NextResponse.json({ 
        keywords: ["Communication", "Problem Solving", "Teamwork", "Adaptability", "Time Management"],
        isFallback: true
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

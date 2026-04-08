import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFallbackRoadmap } from "@/lib/roadmap-fallbacks";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { skill } = await req.json();

    if (!skill) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    const prompt = `You are a world-class technical educator and senior engineer with 15+ years of industry experience.

Create a HIGHLY SPECIFIC and ACCURATE learning roadmap for: "${skill}"

CRITICAL RULES:
1. The roadmap MUST be specifically about "${skill}" — NOT a generic programming roadmap.
2. Every milestone title, topic, and project MUST directly relate to "${skill}".
3. Topics must be REAL, SPECIFIC concepts from the "${skill}" ecosystem — not generic software topics.
4. Projects must be PRACTICAL, BUILDABLE applications that use "${skill}" specifically.
5. Duration estimates must be realistic for a dedicated learner (2-4 hours/day).
6. Beginner = foundations & core concepts of "${skill}"
   Intermediate = real-world patterns, best practices, integrations
   Advanced = production-grade architecture, optimization, expert techniques
7. Each level should have 2-3 milestones.
8. Each milestone must have exactly 4-6 topics that are concrete and searchable.

EXAMPLES OF GOOD vs BAD:
- If skill is "React": topics should be "JSX & Virtual DOM", "useState & useEffect", "Custom Hooks", NOT "Variables & Types" or "Functions"
- If skill is "Docker": topics should be "Dockerfile syntax", "Multi-stage builds", "Docker Compose", NOT "HTML & CSS"
- If skill is "Machine Learning": topics should be "Linear Regression", "Decision Trees", "Gradient Descent", NOT "HTML" or "JavaScript"

Return ONLY this JSON (no markdown, no explanation):
{
  "skill": "${skill}",
  "totalDuration": "<realistic total, e.g. '12 weeks' or '6 months'>",
  "beginner": [
    {
      "title": "<specific milestone name for ${skill}>",
      "duration": "<e.g. '2 weeks'>",
      "topics": ["<specific ${skill} topic 1>", "<specific ${skill} topic 2>", "<topic 3>", "<topic 4>"],
      "project": "<hands-on project using ${skill}>"
    }
  ],
  "intermediate": [ ... ],
  "advanced": [ ... ]
}`;

    // 1. Try OpenAI (Primary)
    try {
      if (process.env.OPENAI_API_KEY) {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a technical education expert. You create precise, actionable learning roadmaps. You NEVER give generic advice — every piece of content must be specifically about the requested skill. You always return valid JSON only.`
            },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.4,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");
        if (data.skill && data.beginner && data.intermediate && data.advanced) {
          return NextResponse.json(data);
        }
      }
    } catch (oaError: any) {
      console.warn("OpenAI Failed, trying Gemini...", oaError.message);
    }

    // 2. Try Gemini (Secondary)
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt + "\n\nReturn ONLY the raw JSON object. No markdown code blocks, no backticks, no explanation text.");
        const text = result.response.text();
        
        // Clean JSON
        const cleanedJson = text.replace(/```json\s*|```\s*/g, "").trim();
        const data = JSON.parse(cleanedJson);
        if (data.skill && data.beginner) {
          return NextResponse.json(data);
        }
      }
    } catch (gError: any) {
      console.warn("Gemini Failed, using Local Fallback...", gError.message);
    }

    // 3. Smart Local Fallback (Tertiary)
    const fallbackData = getFallbackRoadmap(skill);
    return NextResponse.json(fallbackData);

  } catch (error: any) {
    console.error("Roadmap Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}

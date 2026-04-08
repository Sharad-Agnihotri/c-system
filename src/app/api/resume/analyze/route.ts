import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Save file to temporary directory
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `resume_${Date.now()}.pdf`);
    fs.writeFileSync(tempFilePath, buffer);

    // 2. Run Python analysis
    let pythonOutput;
    try {
      const scriptPath = path.join(process.cwd(), "src/lib/python/analyze_resume.py");
      const command = `python "${scriptPath}" "${tempFilePath}"`;
      pythonOutput = JSON.parse(execSync(command, { encoding: "utf8" }));
      
      if (!pythonOutput.success) {
         throw new Error(pythonOutput.error || "Python analysis failed");
      }
    } catch (pyError: any) {
      console.error("Python Error:", pyError);
      return NextResponse.json({ error: "Failed to parse PDF: " + pyError.message }, { status: 500 });
    } finally {
      // Cleanup temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }

    // 3. Use OpenAI to structure and enhance the data (with fallback)
    const prompt = `
You are an expert career consultant and ATS (Applicant Tracking System) specialist.
Analyze the following resume data extracted by a Python NLP tool and generate a comprehensive ResumeAnalysis JSON object.

IMPORTANT RULES:
1. The "skills" array must contain ONLY the candidate's STRONG skills — technologies they clearly know well based on the resume. These represent their ADVANTAGES.
2. The "skillGaps" array must contain DIFFERENT skills that the candidate is WEAK in or MISSING entirely. These should NOT overlap with the "skills" array.
3. For each skill, set realistic "currentLevel" (0-100) based on how prominently it appears in the resume, and "requiredLevel" (0-100) based on industry standards.
4. Skills in "skills" array should have currentLevel >= 65. Skills in "skillGaps" should have currentLevel < 50 or be 0 if not mentioned at all.
5. Strengths should highlight what the candidate does WELL. Weaknesses should highlight what they NEED TO IMPROVE — these must be DIFFERENT points.

RAW RESUME TEXT:
${pythonOutput.raw_text}

PYTHON NLP ANALYSIS (use as a starting reference):
${JSON.stringify(pythonOutput.analysis)}

Return ONLY this exact JSON structure:
{
  "score": <number 0-100>,
  "atsScore": <number 0-100>,
  "careerIntent": "<detected career goal>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "skills": [
    {"name": "<skill>", "currentLevel": <65-95>, "requiredLevel": <70-95>, "category": "<category>"}
  ],
  "skillGaps": [
    {"name": "<missing/weak skill>", "currentLevel": <0-45>, "requiredLevel": <60-90>, "category": "<category>"}
  ],
  "suggestions": ["<suggestion 1>", ...],
  "experience": [],
  "education": [],
  "keywords": ["<keyword1>", "<keyword2>", ...]
}

CRITICAL: The "skills" and "skillGaps" arrays must have ZERO overlap. No skill should appear in both arrays.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }, {
        timeout: 15000,
      });

      const finalAnalysis = JSON.parse(completion.choices[0].message.content || "{}");
      
      // Safety check: ensure skills and skillGaps don't overlap
      if (finalAnalysis.skills && finalAnalysis.skillGaps) {
        const skillNames = new Set(finalAnalysis.skills.map((s: any) => s.name.toLowerCase()));
        finalAnalysis.skillGaps = finalAnalysis.skillGaps.filter(
          (g: any) => !skillNames.has(g.name.toLowerCase())
        );
      }

      return NextResponse.json(finalAnalysis);
    } catch (aiError) {
      console.warn("AI Analysis failed or timed out, falling back to Python-only analysis:", aiError);
      
      // FALLBACK: Use Python analysis directly
      return NextResponse.json(pythonOutput.analysis);
    }
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function buildPrompt(round: string): string {
  switch (round) {
    case "aptitude":
      return `Generate 10 unique aptitude test questions for a software engineering placement interview.
      
RULES:
- Mix of: Quantitative (4), Logical Reasoning (3), Pattern Recognition (3)
- Each question must have EXACTLY 4 options
- The "correct" field is the 0-based INDEX of the correct option
- Questions should be challenging but solvable in 2-3 minutes each
- Vary difficulty: 3 easy, 4 medium, 3 hard
- Topics: ratios, time-distance-speed, probability, number series, coding-decoding, syllogisms, blood relations, percentages, profit-loss, permutations

Return ONLY this JSON:
{
  "questions": [
    {
      "id": 1,
      "topic": "Quantitative | Logical Reasoning | Pattern Recognition",
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correct": <0-3>
    }
  ]
}`;

    case "technical":
      return `Generate 8 unique technical interview questions for a software engineering interview.

RULES:
- Mix of categories: Data Structures (2), Algorithms (1), System Design (2), Operating Systems (1), DBMS (1), Networking (1)
- Questions should require detailed answers (not Yes/No)
- Include a helpful hint and a concise sample answer for each
- Make questions that a real interviewer would ask at top tech companies

Return ONLY this JSON:
{
  "questions": [
    {
      "id": 1,
      "category": "Data Structures | Algorithms | System Design | Operating Systems | DBMS | Networking",
      "question": "<question>",
      "hint": "<one line hint>",
      "sampleAnswer": "<2-3 sentence ideal answer>"
    }
  ]
}`;

    case "hr":
      return `Generate 8 unique HR interview questions for a software engineering candidate.

RULES:
- Mix of categories: Behavioral (3), Situational (3), Culture Fit (2)
- Questions should be open-ended, requiring thoughtful answers
- Include a practical tip for answering each question
- Make them realistic — questions that recruiters at FAANG/startups actually ask

Return ONLY this JSON:
{
  "questions": [
    {
      "id": 1,
      "category": "Behavioral | Situational | Culture Fit",
      "question": "<question>",
      "tip": "<STAR method tip or approach guidance>"
    }
  ]
}`;

    case "coding":
      return `Generate 3 unique coding/DSA problems for a software engineering interview.

RULES:
- Difficulty spread: 1 Easy, 1 Medium, 1 Hard
- One array/string problem, one stack/queue/tree problem, one DP/greedy problem
- Include clear description, 2 examples with input/output, constraints, JavaScript starter code
- CRITICAL: Include a "functionName" field with the exact function name used in starterCode
- CRITICAL: Include a "testCases" array with 4-5 test cases per problem
- Each testCase must have "input" (array of arguments) and "expected" (the correct return value)
- The "input" array items map to function parameters in order
- Make the problems original — NOT exact copies of LeetCode problems
- All test case values must be valid JSON (numbers, strings, arrays, booleans)

Return ONLY this JSON:
{
  "questions": [
    {
      "id": 1,
      "title": "<problem title>",
      "difficulty": "Easy | Medium | Hard",
      "description": "<clear problem statement>",
      "functionName": "<exact function name from starterCode>",
      "examples": [
        { "input": "<readable input>", "output": "<readable output>", "explanation": "<optional>" }
      ],
      "constraints": ["<constraint 1>", "<constraint 2>"],
      "starterCode": "function funcName(param1, param2) {\\n  // Your solution here\\n  \\n}",
      "testCases": [
        { "input": ["<arg1>", "<arg2>"], "expected": "<expected_return_value>" }
      ]
    }
  ]
}`;

    default:
      return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { round } = await req.json();
    
    if (!round || !["aptitude", "technical", "hr", "coding"].includes(round)) {
      return NextResponse.json({ error: "Invalid round type" }, { status: 400 });
    }

    const prompt = buildPrompt(round);

    // 1. Try OpenAI
    try {
      if (process.env.OPENAI_API_KEY) {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an expert interview question generator. Generate unique, high-quality questions every time. Never repeat questions. Return valid JSON only." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.9,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");
        if (data.questions?.length > 0) {
          return NextResponse.json(data);
        }
      }
    } catch (err: any) {
      console.warn("OpenAI failed for questions, trying Gemini...", err.message);
    }

    // 2. Try Gemini
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(
          prompt + "\n\nReturn ONLY raw JSON. No markdown, no backticks, no explanation."
        );
        const text = result.response.text().replace(/```json\s*|```\s*/g, "").trim();
        const data = JSON.parse(text);
        if (data.questions?.length > 0) {
          return NextResponse.json(data);
        }
      }
    } catch (err: any) {
      console.warn("Gemini failed for questions, using fallback...", err.message);
    }

    // 3. Fallback — return signal to use local questions
    return NextResponse.json({ questions: [], fallback: true });

  } catch (error: any) {
    console.error("Question Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
    });

    const prompt = `
You are an AI Study Assistant for a college student.

Help the student with:
- Creating study plans
- Explaining difficult topics
- Exam preparation
- Time management
- Revision strategies
- Subject-wise planning
- Daily and weekly schedules

Give practical, simple and structured answers.

Student's request:
${message}
`;

    let lastError: any = null;

    // Try Gemini up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Gemini attempt ${attempt}/3`);

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ reply: text });
      } catch (error: any) {
        lastError = error;

        console.error(`Gemini attempt ${attempt} failed:`, error?.message);

        // Retry only for temporary server/rate-limit errors
        const errorMessage = error?.message || "";

        const shouldRetry =
          error?.status === 503 ||
          error?.status === 429 ||
          errorMessage.includes("503") ||
          errorMessage.includes("429") ||
          errorMessage.includes("high demand");

        if (!shouldRetry || attempt === 3) {
          break;
        }

        // Wait before retrying
        await sleep(attempt * 2000);
      }
    }

    console.error("Gemini final error:", lastError);

    return NextResponse.json(
      {
        error:
          "Gemini is temporarily busy. Please wait a few seconds and try again.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("AI API Error:", error);

    return NextResponse.json(
      {
        error: "Unable to process your AI request.",
      },
      { status: 500 }
    );
  }
}
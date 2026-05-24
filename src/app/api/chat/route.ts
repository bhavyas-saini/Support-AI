import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();

    if (!message || !ownerId) {
      return setCorsHeaders(
        NextResponse.json(
          { message: "message and owner id is required" },
          { status: 400 }
        )
      );
    }

    await connectDb();
    const setting = await Settings.findOne({ ownerId });

    if (!setting) {
      return setCorsHeaders(
        NextResponse.json(
          { message: "chat bot is not configured yet." },
          { status: 400 }
        )
      );
    }

    const KNOWLEDGE = `
        business name- ${setting.businessName || "not provided"}
        supportEmail- ${setting.supportEmail || "not provided"}
        knowledge- ${setting.knowledge || "not provided"}
        `;

    const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.
Do NOT invent new policies, prices, or promises.

--------------------
BUSINESS INFORMATION
--------------------
${KNOWLEDGE}

--------------------
CUSTOMER QUESTION
--------------------
${message}

--------------------
ANSWER
--------------------
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Keep existing behavior, but ensure we don't crash if res.text is missing.
    const text = (res as any)?.text ?? (res as any)?.response?.text ?? "";
    const response = NextResponse.json(text);
    return setCorsHeaders(response);
  } catch (error) {
    return setCorsHeaders(
      NextResponse.json(
        { message: `chat error ${error}` },
        { status: 500 }
      )
    );
  }
}

export const OPTIONS = async () => {
  return setCorsHeaders(new NextResponse(null, { status: 204 }));
};

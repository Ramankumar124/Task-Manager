import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env?.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function enhanceTaskByAi(
  userPrompt: string,
  systemPrompt: string
) {
  try {
    const result = await model.generateContent([systemPrompt, userPrompt]);
    return result.response.text();
  } catch (error) {
    throw error;
  }
}

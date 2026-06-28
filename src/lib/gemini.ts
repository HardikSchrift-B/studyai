import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateStudyContent(topic: string) {
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `You are an expert study assistant. Given the following topic or text, generate study material in JSON format.

Topic/Text: ${topic}

Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
{
  "title": "Short title for this study session (max 6 words)",
  "notes": "Comprehensive structured notes with clear headings and bullet points. Use ## for headings and - for bullets. At least 300 words.",
  "flashcards": [
    { "front": "Question or concept", "back": "Answer or explanation" }
  ],
  "questions": [
    {
      "question": "Multiple choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    }
  ]
}

Generate exactly 6 flashcards and 5 multiple choice questions. Make them educational and accurate.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip markdown if present
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

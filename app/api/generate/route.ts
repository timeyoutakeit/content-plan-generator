import { GoogleGenAI } from "@google/genai";

// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const prompt = `
    You are a documentation strategist.
    Given the following raw content (PRs, messages, notes):
    
    ${content}
    
    Analyze the following and generate a content plan:
    1. Description of the changes/ideas.
    2. Goals of documentation.
    3. Intended audience(s).
    4. A proposed content of all the topics and parts of the documentation that need to be created
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return Response.json({ plan: response.text });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

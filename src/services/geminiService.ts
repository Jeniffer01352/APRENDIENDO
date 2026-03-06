import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function explainApiResponse(request: any, response: any) {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      As an API expert, explain this API interaction to a student.
      
      REQUEST:
      Method: ${request.method}
      URL: ${request.url}
      Body: ${request.body}
      
      RESPONSE:
      Status: ${response.status} ${response.statusText}
      Data: ${JSON.stringify(response.data).substring(0, 1000)}
      
      Explain:
      1. What happened in this request?
      2. What does the status code mean?
      3. Briefly explain the response data structure.
      4. Suggest a possible next step or improvement.
    `;

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate explanation at this time.";
  }
}

export async function generateCodeSnippet(request: any, language: string) {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Generate a clean, professional code snippet in ${language} to perform the following API request:
      Method: ${request.method}
      URL: ${request.url}
      Headers: ${JSON.stringify(request.headers)}
      Body: ${request.body}
      
      Return ONLY the code block.
    `;

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "// Error generating code snippet";
  }
}

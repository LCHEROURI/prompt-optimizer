
import { GoogleGenAI, Part } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

// The API key is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const optimizePrompt = async (
  userInput: string,
  imageFile: File | null,
  docFile: File | null,
  audioFile: File | null
): Promise<string> => {
  const model = 'gemini-2.5-pro';

  const systemInstruction = `You are Lyra, a master-level AI prompt optimization specialist.
Use the 4-D methodology (Deconstruct, Diagnose, Develop, Deliver) to analyze the provided inputs.
If the input includes images, audio, or documents, first interpret their content before crafting the optimized prompt.
The final output must be in the following format and nothing else:
**Optimized Prompt:** [The optimized prompt]

**Implementation Notes:** [The implementation notes]`;
  
  const textPrompts: string[] = [`User Input:\n${userInput || 'No text input provided.'}`];
  const fileParts: Part[] = [];

  try {
    if (imageFile) {
      textPrompts.push('\n\nImage Input (if provided):');
      const data = await fileToBase64(imageFile);
      fileParts.push({ inlineData: { mimeType: imageFile.type, data } });
    }

    if (docFile) {
      textPrompts.push('\n\nDocument Input (if provided):');
      const data = await fileToBase64(docFile);
      fileParts.push({ inlineData: { mimeType: docFile.type, data } });
    }
    
    if (audioFile) {
      textPrompts.push('\n\nAudio Input (if provided):');
      const data = await fileToBase64(audioFile);
      fileParts.push({ inlineData: { mimeType: audioFile.type, data } });
    }

    const allParts: Part[] = [{ text: textPrompts.join('') }, ...fileParts];
    
    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: allParts },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.35,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error: Failed to optimize prompt. ${error.message}`;
    }
    return "Error: An unknown error occurred while optimizing the prompt.";
  }
};

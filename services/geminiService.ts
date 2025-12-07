import { GoogleGenAI, Type } from "@google/genai";
import { Challenge, Lesson, ImageSize, DifficultyLevel } from "../types";

// Helper to check for API key presence
export const hasApiKey = (): boolean => {
  return !!process.env.API_KEY;
};

// Generate the lesson plan (text content) using Gemini Flash Lite for speed
export const generateLessonContent = async (
  language: string, 
  difficulty: DifficultyLevel,
  topic: string = "general"
): Promise<Lesson> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let difficultyContext = "";
  switch (difficulty) {
    case 'Beginner':
      difficultyContext = "Focus on very basic vocabulary, greetings, and simple nouns. Keep sentences extremely short.";
      topic = "basics";
      break;
    case 'Intermediate':
      difficultyContext = "Focus on simple conversational phrases, common verbs, and sentence structure.";
      break;
    case 'Advanced':
      difficultyContext = "Focus on complex grammar, idioms, and fluent expression. Use more obscure vocabulary.";
      break;
  }

  const prompt = `Create a ${difficulty} level language lesson for ${language}. 
  ${difficultyContext}
  Generate 4 distinct multiple-choice challenges.
  
  For each challenge:
  1. 'question': The question asking the user to translate a word or phrase, or identify an object.
  2. 'correctAnswer': The correct option.
  3. 'options': An array of 4 possible answers (including the correct one).
  4. 'imagePrompt': A simple, colorful, flat-vector style description of an image that represents the question context.
  5. 'explanation': A brief explanation of why the answer is correct.
  6. 'englishTranslation': The English meaning of the target phrase/word.
  
  Ensure the content is accurate for ${language} as spoken in Nigeria.`;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the lesson" },
          challenges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                type: { type: Type.STRING, enum: ["vocabulary", "translation"] },
                question: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                englishTranslation: { type: Type.STRING },
              },
              required: ["id", "type", "question", "imagePrompt", "options", "correctAnswer", "explanation", "englishTranslation"]
            }
          }
        },
        required: ["title", "challenges"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate lesson content");
  }

  return JSON.parse(response.text) as Lesson;
};

// Generate an image for a specific challenge using Nano Banana Pro
export const generateChallengeImage = async (
  prompt: string, 
  size: ImageSize = '1K'
): Promise<string | null> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  // Re-instantiate to ensure fresh key if needed (though usually handled by env)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Enhance prompt for style
  const enhancedPrompt = `${prompt}. Vibrant, cute, flat vector art style, simple background, Duolingo style illustration.`;

  try {
    // Attempt with the Pro model (Nano Banana Pro)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.warn("Nano Banana Pro failed (likely permission), falling back to Flash Image:", error);

    // Fallback to Flash Image (Nano Banana)
    // Note: Flash Image does not support imageSize config, so we remove it
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (fallbackError) {
      console.error("Fallback image generation failed:", fallbackError);
      return null;
    }
  }
};
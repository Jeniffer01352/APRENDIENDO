
import { GoogleGenAI, Type } from "@google/genai";
import type { Activity, UserProfile, SessionActivityRecord } from '../types';
import { SyllabicLevel } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const activitySchema = {
  type: Type.OBJECT,
  properties: {
    instruction: {
      type: Type.STRING,
      description: "Una instrucción muy simple, alentadora y amigable para el niño, usando su apodo. Debe estar en minúsculas, con mayúscula solo al inicio. Incluye emojis relevantes (como 🎉, 👍, 🤔) para hacerlo más visual.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Un array de 3 o 4 opciones para que el niño elija. Pueden ser sílabas, palabras o números como strings. Todas en minúsculas si son texto.",
    },
    correctAnswer: {
      type: Type.STRING,
      description: "La opción correcta del array 'options'. En minúsculas si es texto.",
    },
  },
  required: ["instruction", "options", "correctAnswer"],
};

const getPromptForLevel = (level: SyllabicLevel): string => {
    let baseInstruction = '';
    if (level === SyllabicLevel.PRESILABICO) {
        baseInstruction = "Crea una actividad centrada en el reconocimiento de vocales, sonidos iniciales de letras (fonemas), o contar las letras en una palabra muy corta. Ejemplo: '¿Qué palabra empieza con el sonido /a/?' (Opciones: 'árbol', 'sol', 'luna'). También puedes usar sonidos onomatopéyicos o identificar letras por su sonido.";
    } else if (level === SyllabicLevel.SILABICO) {
        baseInstruction = "Crea una actividad centrada en sílabas. Puede ser identificar la sílaba inicial, final o media; contar sílabas en una palabra; o completar una palabra con la sílaba que falta. Ejemplo: '¿Cuántos aplausos (sílabas) tiene la palabra 'pelota'?' (Opciones: '2', '3', '4'). También puedes pedir que identifiquen un objeto (emoji) que empiece con una sílaba específica.";
    } else {
        baseInstruction = "Crea una actividad más compleja que involucre la manipulación de sílabas para formar palabras, encontrar rimas, u ordenar sílabas para construir una palabra. Ejemplo: 'Si ordenamos 'ta', 'pe', 'lo', ¿qué palabra formamos?' (Opciones: 'pelota', 'tapelo', 'lopeta').";
    }
    return `**TAREA PRINCIPAL:** ${baseInstruction} Asegúrate de que la dificultad sea apropiada para el nivel '${level}'.`;
}

export const generateActivity = async (profile: UserProfile, sessionHistory?: SessionActivityRecord[]): Promise<Activity> => {
    try {
        const { level, nickname, age, favoriteTopics, learningStyle, specialNeedType, focusAreas, name, preferredDifficulty } = profile;
        const promptInstruction = getPromptForLevel(level);
        const displayName = nickname || name;
        const difficultyInstruction = preferredDifficulty ? `Ajusta la complejidad de la actividad para que coincida con un nivel de dificultad '${preferredDifficulty}'.` : "Mantén la dificultad en un nivel normal.";

        const historyString = sessionHistory && sessionHistory.length > 0
            ? `Para asegurar la variedad, evita crear actividades con una instrucción similar a estas, que ya se han jugado en esta sesión:\n${sessionHistory.map((h: any) => `- "${h.instruction}"`).join('\n')}`
            : "Esta es la primera actividad de la sesión.";

        const prompt = `
            Eres un experto en educación infantil temprana especializado en métodos silábicos para niños con necesidades educativas especiales.
            Tu tarea es crear una actividad de aprendizaje personalizada, divertida y muy simple. Usa un lenguaje natural y amigable.

            Aquí está el perfil del niño:
            - Apodo a usar en el juego: ${displayName}
            - Edad: ${age} años
            - Nivel silábico: '${level}'
            - Temas favoritos: ${favoriteTopics.join(', ')}
            - Estilo de aprendizaje principal: ${learningStyle}
            - Necesidad educativa: ${specialNeedType}
            - Áreas de enfoque actuales: ${focusAreas.join(', ')}

            Instrucciones para la actividad:
            1. **CREA UNA ACTIVIDAD VARIADA.** No te limites a un solo formato. Considera los siguientes tipos de juegos:
               - **Completar palabras:** "¿Qué sílaba falta para formar la palabra 'ga__ '?" (Opciones: 'to', 'ma', 'so').
               - **Contar sílabas:** "¿Cuántas sílabas tiene la palabra 'mariposa'?" (Opciones: '2', '3', '4').
               - **Encontrar al intruso:** "Una de estas palabras no empieza como las demás. ¿Cuál es?" (Opciones: 'mesa', 'mano', 'sol').
               - **Rimas:** "¿Qué palabra rima con 'ratón'?" (Opciones: 'queso', 'botón', 'casa').
               - **Relacionar sílaba con imagen:** "¿Cuál de estos dibujos empieza con la sílaba 'ma'?" (Opciones: '🍎', '🖐️', '☀️'). Usa emojis para representar objetos.
               - **Orden de sílabas:** "Si ordenamos 'ta', 'pe', 'lo', ¿qué palabra formamos?" (Opciones: 'pelota', 'tapelo', 'lopeta').
               - **Identificación fonética:** "¿Qué letra suena como una serpiente 'sssss'?" (Opciones: 's', 'm', 'p').
               - **Sonido inicial:** "¿Cuál de estos empieza con el sonido /p/?" (Opciones: 'perro', 'gato', 'loro').
            2. ${promptInstruction} ${difficultyInstruction}
            3. INCORPORA sutilmente uno de sus temas favoritos (${favoriteTopics.join(', ')}) en el contenido si es posible.
            4. Adapta la instrucción a su estilo de aprendizaje principal ('${learningStyle}').
            5. La actividad debe ser única, atractiva y utilizar palabras en español muy comunes.
            6. ${historyString}
            7. IMPORTANTE: Si las opciones son números, deben ser strings en el JSON.
            8. **REGLA CRÍTICA:** No uses guiones (-) ni otros caracteres especiales en la instrucción.

            Genera únicamente un objeto JSON que se ajuste estrictamente al esquema proporcionado.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: activitySchema,
            },
        });

        const activityData = JSON.parse(response.text);
        activityData.options = activityData.options.map(String);
        activityData.correctAnswer = String(activityData.correctAnswer);
        return activityData;
    } catch (error) {
        console.error("Error generating activity:", error);
        throw new Error("No se pudo generar la actividad. Revisa tu conexión.");
    }
};

export const generateFeedback = async (isCorrect: boolean, displayName: string, activity: Activity, userAnswer: string): Promise<string> => {
    try {
        const { instruction, correctAnswer } = activity;
        const prompt = isCorrect
            ? `Genera un mensaje muy corto, positivo y de celebración para ${displayName}. Una sola oración simple.`
            : `Genera un feedback gentil y educativo para ${displayName}. La instrucción fue "${instruction}", respondió "${userAnswer}" y era "${correctAnswer}". Explica la regla sin usar palabras negativas.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating feedback:", error);
        return isCorrect ? `¡Muy bien, ${displayName}!` : `¡Buen intento, ${displayName}!`;
    }
};

export const generateSupportStrategies = async (profileData: Omit<UserProfile, 'id' | 'supportStrategies' | 'score' | 'correctAnswersStreak' | 'history' | 'badges'>): Promise<string[]> => {
    try {
        const { age, learningStyle, specialNeedType, focusAreas } = profileData;
        const prompt = `Genera 2 o 3 estrategias de apoyo para un niño de ${age} años, estilo ${learningStyle}, necesidad ${specialNeedType}, áreas ${focusAreas.join(', ')}. Responde solo un array JSON de strings.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating support strategies:", error);
        return ["Recordar tomar descansos cortos.", "Usar muchos colores para aprender."];
    }
};

export const generateSessionSummary = async (displayName: string, sessionHistory: any[]): Promise<string> => {
    try {
        const activitiesCompleted = sessionHistory.length;
        const correctAnswers = sessionHistory.filter((a: any) => a.isCorrect).length;
        const prompt = `Genera un mensaje de felicitación entusiasta para ${displayName} por completar ${activitiesCompleted} actividades con ${correctAnswers} aciertos. Enfócate en el esfuerzo.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating session summary:", error);
        return `¡Felicidades, ${displayName}! Completaste tu sesión.`;
    }
};

export const checkConnection = async (): Promise<boolean> => {
    return true; // Direct call from frontend
};

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { getEnglishTutor, type TutorType } from "./english-tutors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

// =============================================================================
// CONFIGURATION TUTEUR D'ANGLAIS - NOUVELLE VERSION SPÉCIALISÉE
// =============================================================================
export const configureEnglishTutor = (
  tutorType: TutorType,
  voice: string,
  style: string,
  topic: string
) => {
  const tutorConfig = getEnglishTutor(tutorType);

  const voiceId = voice || "nova";

  const vapiAssistant: CreateAssistantDTO = {
    name: tutorConfig.name,
    firstMessage: tutorConfig.firstMessage.replace("{{topic}}", topic),
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "openai",
      voiceId: voiceId,
      speed:
        tutorConfig.voiceStyle === "energetic"
          ? 1.1
          : tutorConfig.voiceStyle === "patient"
          ? 0.9
          : 1,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: tutorConfig.systemPrompt.replace(/\{\{topic\}\}/g, topic),
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  };

  return vapiAssistant;
};

// =============================================================================
// CONFIGURATION ASSISTANT - VERSION ORIGINALE (GARDÉE POUR COMPATIBILITÉ)
// =============================================================================
export const configureAssistant = (voice: string) => {
  const voiceId = voice || "nova";

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage:
      "Hello, let's start the session. Today we'll be talking about {{topic}}.",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "openai",
      voiceId: voiceId,
      speed: 1,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

                    Tutor Guidelines:
                    Stick to the given topic - {{ topic }} and subject - {{ subject }} and teach the student about it.
                    Keep the conversation flowing smoothly while maintaining control.
                    From time to time make sure that the student is following you and understands you.
                    Break down the topic into smaller parts and teach the student one part at a time.
                    Keep your style of conversation {{ style }}.
                    Keep your responses short, like in a real voice conversation.
                    Do not include any special characters in your responses - this is a voice conversation.
              `,
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  };
  return vapiAssistant;
};

// =============================================================================
// CONFIGURATION SELON LE TYPE DE TUTEUR - FONCTION INTELLIGENTE
// =============================================================================
export const configureTutor = (
  tutorType: TutorType | "legacy",
  voice: string,
  style: string,
  topic: string
) => {
  if (tutorType === "legacy") {
    return configureAssistant(voice);
  }

  return configureEnglishTutor(tutorType, voice, style, topic);
};

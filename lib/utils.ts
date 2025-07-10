import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
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

  const voiceId =
    voices[voice as keyof typeof voices][
      style as keyof (typeof voices)[keyof typeof voices]
    ] || "sarah";

  const vapiAssistant: CreateAssistantDTO = {
    name: tutorConfig.name,
    firstMessage: tutorConfig.firstMessage.replace("{{topic}}", topic),
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed:
        tutorConfig.voiceStyle === "energetic"
          ? 1.1
          : tutorConfig.voiceStyle === "patient"
          ? 0.9
          : 1,
      style: 0.5,
      useSpeakerBoost: true,
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
export const configureAssistant = (voice: string, style: string) => {
  const voiceId =
    voices[voice as keyof typeof voices][
      style as keyof (typeof voices)[keyof typeof voices]
    ] || "sarah";

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
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
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
    return configureAssistant(voice, style);
  }

  return configureEnglishTutor(tutorType, voice, style, topic);
};

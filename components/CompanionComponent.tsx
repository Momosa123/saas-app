"use client";

import { useEffect, useRef, useState } from "react";
import { cn, configureTutor, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { saveSessionReport } from "@/lib/actions/session-reports.actions";
import { addToSessionHistory } from "@/lib/actions/companion.actions";
import { type TutorType } from "@/lib/english-tutors";
import type { SavedMessage } from "@/types";

interface Message {
  type: string;
  transcriptType: string;
  role: string;
  transcript: string;
}
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from "@/constants/soundwaves.json";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface CompanionComponentProps {
  companionId: string;
  subject: string;
  topic: string;
  name: string;
  userName: string;
  userImage: string;
  style: string;
  voice: string;
  tutorType?: TutorType; // Nouveau : type de tuteur d'anglais
  assignmentId?: string; // Nouveau : pour les devoirs
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
  tutorType = "conversation", // Par défaut : tuteur de conversation
  assignmentId,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [fullTranscript, setFullTranscript] = useState<string>("");

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setSessionStartTime(Date.now());
      setFullTranscript("");
      setMessages([]);
    };

    const onCallEnd = async () => {
      setCallStatus(CallStatus.FINISHED);

      // Calculer la durée de la session
      const sessionDuration = sessionStartTime
        ? Math.floor((Date.now() - sessionStartTime) / 1000)
        : 0;

      // Sauvegarder le rapport de session automatiquement
      try {
        await saveSessionReport({
          companionId,
          transcript: fullTranscript,
          assignmentId,
          sessionDuration,
          tutorType,
          topic,
        });

        console.log("✅ Rapport de session sauvegardé automatiquement");
      } catch (error) {
        console.error("❌ Erreur sauvegarde rapport:", error);
      }

      // Garder l'ancienne logique pour l'historique
      await addToSessionHistory(companionId);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = {
          role: message.role as "user" | "system" | "assistant",
          content: message.transcript,
        };
        setMessages((prev) => [newMessage, ...prev]);

        // Construire la transcription complète
        const speaker = message.role === "assistant" ? name : userName;
        const transcriptLine = `${speaker}: ${message.transcript}`;
        setFullTranscript((prev) => prev + transcriptLine + "\n");
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, [
    companionId,
    fullTranscript,
    sessionStartTime,
    name,
    userName,
    assignmentId,
    tutorType,
    topic,
  ]);

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      const assistantOverrides = {
        variableValues: { subject, topic, style },
        clientMessages: ["transcript"],
        serverMessages: [],
      };

      // Utiliser le nouveau système de tuteurs d'anglais
      const assistant = configureTutor(tutorType, voice, style, topic);

      console.log(
        `🚀 Démarrage session avec ${tutorType} tutor pour le sujet: ${topic}`
      );

      // @ts-expect-error Vapi types don't match exactly but the parameters are valid
      vapi.start(assistant, assistantOverrides);
    } catch (error) {
      console.error("Erreur démarrage session:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  // Obtenir le nom du tuteur selon le type
  const getTutorDisplayName = () => {
    const tutorNames = {
      conversation: "Alex - Conversation Tutor",
      grammar: "Professor Morgan - Grammar Expert",
      pronunciation: "Sarah - Pronunciation Coach",
      business: "Mr. Johnson - Business English",
      beginner: "Emma - Beginner's Friend",
    };
    return tutorNames[tutorType] || name;
  };

  return (
    <section className="flex flex-col h-[70vh]">
      {/* En-tête avec type de tuteur */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {getTutorDisplayName()}
            </h2>
            <p className="text-sm text-gray-600">
              Sujet: {topic} {assignmentId && "(Devoir assigné)"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
              {tutorType}
            </span>
            {assignmentId && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                📚 Devoir
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="flex gap-8 max-sm:flex-col">
        <div className="companion-section">
          <div
            className="companion-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.FINISHED ||
                  callStatus === CallStatus.INACTIVE
                  ? "opacity-100"
                  : "opacity-0",
                callStatus === CallStatus.CONNECTING &&
                  "opacity-100 animate-pulse"
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>

            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0"
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl">{getTutorDisplayName()}</p>
        </div>

        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="font-bold text-2xl">{userName}</p>
          </div>
          <button
            className="btn-mic"
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>
          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
              callStatus === CallStatus.ACTIVE ? "bg-red-700" : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Session"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting..."
              : "Start Session"}
          </button>
        </div>
      </section>

      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <p key={index} className="max-sm:text-sm">
                  {getTutorDisplayName().split(" ")[0]}: {message.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm">
                  {userName}: {message.content}
                </p>
              );
            }
          })}
        </div>

        <div className="transcript-fade" />
      </section>

      {/* Indicateur de session en cours */}
      {callStatus === CallStatus.ACTIVE && sessionStartTime && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              Session en cours -{" "}
              {Math.floor((Date.now() - sessionStartTime) / 1000)}s
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default CompanionComponent;

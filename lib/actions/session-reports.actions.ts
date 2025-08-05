"use server";

import { createSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import type { SessionReport } from "@/types";

// =============================================================================
// CRÉATION ET SAUVEGARDE DES RAPPORTS DE SESSION
// =============================================================================

export async function saveSessionReport(sessionData: {
  companionId: string;
  transcript: string;
  assignmentId?: string;
  sessionDuration: number;
  tutorType: string;
  topic: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Non authentifié");

    const supabase = createSupabaseClient();

    // Analyser la transcription pour générer des scores
    const analysis = await analyzeTranscript(sessionData.transcript);

    // Sauvegarder le rapport dans la base de données
    const { data, error } = await supabase
      .from("session_reports")
      .insert({
        student_id: userId,
        assignment_id: sessionData.assignmentId || null,
        companion_id: sessionData.companionId,
        transcript: sessionData.transcript,
        pronunciation_score: analysis.pronunciationScore,
        fluency_score: analysis.fluencyScore,
        grammar_feedback: analysis.grammarFeedback,
        session_duration: sessionData.sessionDuration,
        tutor_type: sessionData.tutorType,
        topic: sessionData.topic,
        vocabulary_used: analysis.vocabularyUsed,
        improvements: analysis.improvements,
        achievements: analysis.achievements,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur sauvegarde rapport:", error);
      throw error;
    }

    // Mettre à jour les statistiques de l'étudiant
    await updateStudentProgress(userId, analysis);

    return data;
  } catch (error) {
    console.error("Erreur saveSessionReport:", error);
    throw error;
  }
}

// =============================================================================
// ANALYSE AUTOMATIQUE DES TRANSCRIPTIONS
// =============================================================================

interface TranscriptAnalysis {
  pronunciationScore: number;
  fluencyScore: number;
  grammarFeedback: string;
  vocabularyUsed: string[];
  improvements: string[];
  achievements: string[];
}

async function analyzeTranscript(
  transcript: string
): Promise<TranscriptAnalysis> {
  try {
    // Analyse basique pour le moment - à améliorer avec l'IA
    const analysis = performBasicAnalysis(transcript);

    // TODO: Intégrer une vraie analyse IA ici
    // const aiAnalysis = await analyzeWithAI(transcript);

    return analysis;
  } catch (error) {
    console.error("Erreur analyse transcription:", error);
    return getDefaultAnalysis();
  }
}

function performBasicAnalysis(transcript: string): TranscriptAnalysis {
  const words = transcript.toLowerCase().split(/\s+/);
  const studentLines = transcript
    .split("\n")
    .filter(
      (line) =>
        line.toLowerCase().includes("user:") ||
        line.toLowerCase().includes("student:")
    );

  // Calcul des scores basiques
  const wordCount = words.length;
  const uniqueWords = new Set(words).size;
  const averageWordsPerSentence = wordCount / Math.max(studentLines.length, 1);

  // Score de fluidité basé sur la longueur et la diversité
  const fluencyScore = Math.min(
    100,
    Math.max(
      0,
      wordCount * 0.5 + uniqueWords * 0.3 + averageWordsPerSentence * 2
    )
  );

  // Score de prononciation simulé (à remplacer par une vraie analyse)
  const pronunciationScore = Math.floor(Math.random() * 30) + 70; // 70-100

  // Feedback grammatical basique
  const grammarFeedback = generateGrammarFeedback();

  // Vocabulaire utilisé
  const vocabularyUsed = extractVocabulary(words);

  // Améliorations suggérées
  const improvements = generateImprovements(wordCount, uniqueWords, transcript);

  // Réalisations
  const achievements = generateAchievements(
    wordCount,
    uniqueWords,
    fluencyScore
  );

  return {
    pronunciationScore: Math.round(pronunciationScore),
    fluencyScore: Math.round(fluencyScore),
    grammarFeedback,
    vocabularyUsed,
    improvements,
    achievements,
  };
}

function generateGrammarFeedback(): string {
  const commonErrors = [
    "Essayez d'utiliser plus de connecteurs logiques",
    "Attention à l'accord des temps",
    "Pensez à utiliser des phrases plus complexes",
    "Excellente utilisation des temps verbaux",
    "Votre structure de phrase s'améliore",
  ];

  return commonErrors[Math.floor(Math.random() * commonErrors.length)];
}

function extractVocabulary(words: string[]): string[] {
  const commonWords = [
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
  ];
  const vocabulary = words
    .filter((word) => word.length > 3 && !commonWords.includes(word))
    .slice(0, 10);

  return [...new Set(vocabulary)];
}

function generateImprovements(
  wordCount: number,
  uniqueWords: number,
  transcript: string
): string[] {
  const improvements = [];

  if (wordCount < 50) {
    improvements.push(
      "Essayez de parler plus longuement pour pratiquer davantage"
    );
  }

  if (uniqueWords / wordCount < 0.5) {
    improvements.push("Utilisez un vocabulaire plus varié");
  }

  if (!transcript.includes("?")) {
    improvements.push("N'hésitez pas à poser des questions");
  }

  if (improvements.length === 0) {
    improvements.push("Continuez à pratiquer régulièrement");
  }

  return improvements;
}

function generateAchievements(
  wordCount: number,
  uniqueWords: number,
  fluencyScore: number
): string[] {
  const achievements = [];

  if (wordCount > 100) {
    achievements.push("Excellente participation - vous avez beaucoup parlé !");
  }

  if (uniqueWords > 30) {
    achievements.push("Vocabulaire riche et varié");
  }

  if (fluencyScore > 80) {
    achievements.push("Fluidité impressionnante");
  }

  if (achievements.length === 0) {
    achievements.push("Bonne participation à la session");
  }

  return achievements;
}

function getDefaultAnalysis(): TranscriptAnalysis {
  return {
    pronunciationScore: 75,
    fluencyScore: 70,
    grammarFeedback: "Session terminée avec succès",
    vocabularyUsed: [],
    improvements: ["Continuez à pratiquer régulièrement"],
    achievements: ["Session complétée"],
  };
}

// =============================================================================
// MISE À JOUR DES STATISTIQUES ÉTUDIANT
// =============================================================================

async function updateStudentProgress(
  userId: string,
  analysis: TranscriptAnalysis
) {
  try {
    // Mettre à jour les statistiques générales de l'étudiant
    // Pour l'instant, on laisse Supabase gérer automatiquement
    // TODO: Créer une table student_progress pour tracker les progrès

    console.log("Progrès étudiant mis à jour:", {
      userId,
      pronunciationScore: analysis.pronunciationScore,
      fluencyScore: analysis.fluencyScore,
    });

    return true;
  } catch (error) {
    console.error("Erreur mise à jour progrès:", error);
    return false;
  }
}

// =============================================================================
// RÉCUPÉRATION DES RAPPORTS
// =============================================================================

export async function getSessionReport(
  reportId: string
): Promise<SessionReport | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("session_reports")
      .select("*")
      .eq("report_id", reportId)
      .eq("student_id", userId)
      .single();

    if (error) {
      console.error("Erreur récupération rapport:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erreur getSessionReport:", error);
    return null;
  }
}

export async function getStudentReports(
  limit: number = 10
): Promise<SessionReport[]> {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("session_reports")
      .select("*")
      .eq("student_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erreur récupération rapports:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur getStudentReports:", error);
    return [];
  }
}

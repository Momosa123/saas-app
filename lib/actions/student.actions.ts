"use server";

import { createSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import type { Assignment, SessionReport, Class } from "@/types";

// =============================================================================
// DONNÉES ÉTUDIANTS - DASHBOARD
// =============================================================================

export async function getStudentStats() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = createSupabaseClient();

    // Récupérer les rapports de session de l'étudiant
    const { data: sessions, error: sessionsError } = await supabase
      .from("session_reports")
      .select("*")
      .eq("student_id", userId);

    if (sessionsError) {
      console.error("Erreur récupération sessions:", sessionsError);
      return null;
    }

    // Calculer les statistiques
    const totalSessions = sessions?.length || 0;
    const thisWeekSessions =
      sessions?.filter((session) => {
        const sessionDate = new Date(session.created_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate > weekAgo;
      }).length || 0;

    const averageScore =
      sessions?.length > 0
        ? sessions.reduce((acc, session) => {
            const pronunciationScore = session.pronunciation_score || 0;
            const fluencyScore = session.fluency_score || 0;
            return acc + (pronunciationScore + fluencyScore) / 2;
          }, 0) / sessions.length
        : 0;

    return {
      totalSessions,
      thisWeekSessions,
      averageScore: Math.round(averageScore),
      lastSessionDate: sessions?.[0]?.created_at || null,
    };
  } catch (error) {
    console.error("Erreur getStudentStats:", error);
    return null;
  }
}

export async function getStudentAssignments(): Promise<Assignment[]> {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseClient();

    // Récupérer les classes de l'étudiant
    const { data: classMemberships, error: memberError } = await supabase
      .from("class_members")
      .select("class_id")
      .eq("student_id", userId);

    if (memberError || !classMemberships?.length) {
      return [];
    }

    const classIds = classMemberships.map((m) => m.class_id);

    // Récupérer les devoirs de ces classes
    const { data: assignments, error: assignmentsError } = await supabase
      .from("assignments")
      .select(
        `
        *,
        classes!inner (
          class_name,
          profiles!classes_teacher_id_fkey (
            first_name,
            last_name
          )
        )
      `
      )
      .in("class_id", classIds)
      .order("created_at", { ascending: false });

    if (assignmentsError) {
      console.error("Erreur récupération devoirs:", assignmentsError);
      return [];
    }

    return assignments || [];
  } catch (error) {
    console.error("Erreur getStudentAssignments:", error);
    return [];
  }
}

export async function getStudentClasses(): Promise<Class[]> {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseClient();

    // Récupérer les classes de l'étudiant avec les infos du professeur
    const { data: classMemberships, error: memberError } = await supabase
      .from("class_members")
      .select(
        `
        classes!inner (
          *,
          profiles!classes_teacher_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        )
      `
      )
      .eq("student_id", userId);

    if (memberError) {
      console.error("Erreur récupération classes:", memberError);
      return [];
    }

    // Transformer les données pour retourner les classes
    return classMemberships?.map((membership) => membership.classes) || [];
  } catch (error) {
    console.error("Erreur getStudentClasses:", error);
    return [];
  }
}

export async function getRecentSessions(
  limit: number = 5
): Promise<SessionReport[]> {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseClient();

    const { data: sessions, error } = await supabase
      .from("session_reports")
      .select("*")
      .eq("student_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erreur récupération sessions récentes:", error);
      return [];
    }

    return sessions || [];
  } catch (error) {
    console.error("Erreur getRecentSessions:", error);
    return [];
  }
}

export async function hasActiveAssignments(): Promise<boolean> {
  try {
    const assignments = await getStudentAssignments();

    // Vérifier s'il y a des devoirs avec une date d'échéance dans le futur
    const now = new Date();
    const activeAssignments = assignments.filter((assignment) => {
      if (!assignment.due_date) return true; // Pas de date limite = toujours actif
      return new Date(assignment.due_date) > now;
    });

    return activeAssignments.length > 0;
  } catch (error) {
    console.error("Erreur hasActiveAssignments:", error);
    return false;
  }
}

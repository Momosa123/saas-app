"use server";

import { createSupabaseClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { Class, CreateClass, UpdateClass, Profile } from "@/types";

// =============================================================================
// GESTION DES CLASSES
// =============================================================================

export async function createClass(
  classData: CreateClass
): Promise<{ success: boolean; classId?: string; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("classes")
      .insert({
        teacher_id: userId,
        class_name: classData.class_name,
        description: classData.description,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur création classe:", error);
      return {
        success: false,
        error: "Erreur lors de la création de la classe",
      };
    }

    revalidatePath("/dashboard");
    return { success: true, classId: data.class_id };
  } catch (error) {
    console.error("Erreur createClass:", error);
    return { success: false, error: "Erreur inattendue" };
  }
}

export async function getTeacherClasses(): Promise<Class[]> {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération classes:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur getTeacherClasses:", error);
    return [];
  }
}

export async function updateClass(
  classId: string,
  updates: UpdateClass
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    const supabase = createSupabaseClient();

    const { error } = await supabase
      .from("classes")
      .update(updates)
      .eq("class_id", classId)
      .eq("teacher_id", userId); // S'assurer que c'est bien la classe du professeur

    if (error) {
      console.error("Erreur mise à jour classe:", error);
      return { success: false, error: "Erreur lors de la mise à jour" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur updateClass:", error);
    return { success: false, error: "Erreur inattendue" };
  }
}

export async function deleteClass(
  classId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    const supabase = createSupabaseClient();

    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("class_id", classId)
      .eq("teacher_id", userId); // S'assurer que c'est bien la classe du professeur

    if (error) {
      console.error("Erreur suppression classe:", error);
      return { success: false, error: "Erreur lors de la suppression" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur deleteClass:", error);
    return { success: false, error: "Erreur inattendue" };
  }
}

// =============================================================================
// GESTION DES MEMBRES DE CLASSE
// =============================================================================

export async function addStudentToClass(
  classId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    const supabase = createSupabaseClient();

    // Vérifier que la classe appartient au professeur connecté
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("class_id")
      .eq("class_id", classId)
      .eq("teacher_id", userId)
      .single();

    if (classError || !classData) {
      return { success: false, error: "Classe non trouvée ou non autorisée" };
    }

    // Ajouter l'étudiant à la classe
    const { error } = await supabase.from("class_members").insert({
      class_id: classId,
      student_id: studentId,
    });

    if (error) {
      console.error("Erreur ajout étudiant:", error);
      return { success: false, error: "Erreur lors de l'ajout de l'étudiant" };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/class/${classId}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur addStudentToClass:", error);
    return { success: false, error: "Erreur inattendue" };
  }
}

export async function removeStudentFromClass(
  classId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    const supabase = createSupabaseClient();

    // Vérifier que la classe appartient au professeur connecté
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("class_id")
      .eq("class_id", classId)
      .eq("teacher_id", userId)
      .single();

    if (classError || !classData) {
      return { success: false, error: "Classe non trouvée ou non autorisée" };
    }

    // Retirer l'étudiant de la classe
    const { error } = await supabase
      .from("class_members")
      .delete()
      .eq("class_id", classId)
      .eq("student_id", studentId);

    if (error) {
      console.error("Erreur retrait étudiant:", error);
      return { success: false, error: "Erreur lors du retrait de l'étudiant" };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/class/${classId}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur removeStudentFromClass:", error);
    return { success: false, error: "Erreur inattendue" };
  }
}

export async function getClassMembers(classId: string): Promise<Profile[]> {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseClient();

    // Vérifier que la classe appartient au professeur connecté
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("class_id")
      .eq("class_id", classId)
      .eq("teacher_id", userId)
      .single();

    if (classError || !classData) {
      return [];
    }

    // Récupérer les IDs des étudiants de la classe
    const { data: memberData, error: memberError } = await supabase
      .from("class_members")
      .select("student_id")
      .eq("class_id", classId);

    if (memberError || !memberData) {
      console.error("Erreur récupération membres:", memberError);
      return [];
    }

    const studentIds = memberData.map((member) => member.student_id);

    if (studentIds.length === 0) {
      return [];
    }

    // Récupérer les profils des étudiants
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", studentIds)
      .eq("role", "student");

    if (profilesError) {
      console.error("Erreur récupération profils:", profilesError);
      return [];
    }

    return profiles || [];
  } catch (error) {
    console.error("Erreur getClassMembers:", error);
    return [];
  }
}

export async function getAllStudents(): Promise<Profile[]> {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .order("first_name", { ascending: true });

    if (error) {
      console.error("Erreur récupération étudiants:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur getAllStudents:", error);
    return [];
  }
}

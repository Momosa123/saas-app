"use server";

import { createSupabaseClient } from "@/lib/supabase";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Profile, CreateProfile, UpdateProfile, UserRole } from "@/types";

export async function getCurrentUserProfile(): Promise<Profile | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Erreur récupération profil:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erreur getCurrentUserProfile:", error);
    return null;
  }
}

export async function getOrCreateUserProfile(): Promise<Profile | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    // D'abord essayer de récupérer le profil existant
    let profile = await getCurrentUserProfile();

    // Si pas de profil, le créer avec les données Clerk
    if (!profile) {
      // Récupérer les données depuis Clerk
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);

      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          role: "student", // rôle par défaut
          first_name: clerkUser.firstName || null,
          last_name: clerkUser.lastName || null,
          avatar_url: clerkUser.imageUrl || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur création profil automatique:", error);
        return null;
      }

      profile = data;
    }

    return profile;
  } catch (error) {
    console.error("Erreur getOrCreateUserProfile:", error);
    return null;
  }
}

export async function syncUserDataFromClerk(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    // Récupérer les données depuis Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    // Mettre à jour le profil avec les données Clerk
    const supabase = createSupabaseClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: clerkUser.firstName || null,
        last_name: clerkUser.lastName || null,
        avatar_url: clerkUser.imageUrl || null,
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Erreur synchronisation profil:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur syncUserDataFromClerk:", error);
    return false;
  }
}

export async function updateProfile(updates: UpdateProfile): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const supabase = createSupabaseClient();

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId);

    if (error) {
      console.error("Erreur mise à jour profil:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur updateProfile:", error);
    return false;
  }
}

export async function getUserRole(): Promise<UserRole | null> {
  try {
    const profile = await getOrCreateUserProfile(); // Utilise la version qui crée automatiquement
    return profile?.role || null;
  } catch (error) {
    console.error("Erreur getUserRole:", error);
    return null;
  }
}

export async function createProfile(
  profileData: CreateProfile
): Promise<boolean> {
  try {
    const supabase = createSupabaseClient();

    const { error } = await supabase.from("profiles").insert(profileData);

    if (error) {
      console.error("Erreur création profil:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur createProfile:", error);
    return false;
  }
}

export async function isTeacher(): Promise<boolean> {
  try {
    const role = await getUserRole();
    return role === "teacher";
  } catch (error) {
    console.error("Erreur isTeacher:", error);
    return false;
  }
}

export async function isStudent(): Promise<boolean> {
  try {
    const role = await getUserRole();
    return role === "student";
  } catch (error) {
    console.error("Erreur isStudent:", error);
    return false;
  }
}

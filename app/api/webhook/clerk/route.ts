import { createSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Types pour le webhook Clerk
interface ClerkWebhookPayload {
  type: string;
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    email_addresses?: Array<{ email_address: string }>;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    // Pour l'instant, on parse directement le JSON
    // TODO: Ajouter la vérification des signatures avec svix
    const payload: ClerkWebhookPayload = JSON.parse(body);

    const { type, data } = payload;

    if (type === "user.created") {
      const supabase = createSupabaseClient();

      // Créer un profil pour le nouvel utilisateur
      const { error } = await supabase.from("profiles").insert({
        user_id: data.id,
        role: "student", // rôle par défaut
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        avatar_url: data.image_url || null,
      });

      if (error) {
        console.error("Erreur création profil:", error);
        return NextResponse.json(
          { error: "Erreur création profil" },
          { status: 500 }
        );
      }

      console.log("Profil créé pour:", data.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur webhook:", error);
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 });
  }
}

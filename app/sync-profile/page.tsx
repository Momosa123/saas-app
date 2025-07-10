import {
  syncUserDataFromClerk,
  getCurrentUserProfile,
} from "@/lib/actions/profile.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SyncProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Synchroniser les données
  const syncSuccess = await syncUserDataFromClerk();

  // Récupérer le profil mis à jour
  const profile = await getCurrentUserProfile();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Synchronisation du Profil</h1>

      <div className="space-y-4">
        <div
          className={`p-4 border rounded ${
            syncSuccess
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"
          }`}
        >
          <h2 className="text-lg font-semibold">Status de synchronisation</h2>
          <p
            className={`text-lg ${
              syncSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {syncSuccess
              ? "✅ Synchronisation réussie"
              : "❌ Erreur de synchronisation"}
          </p>
        </div>

        {profile && (
          <div className="p-4 border rounded bg-blue-50">
            <h2 className="text-lg font-semibold">Profil mis à jour</h2>
            <div className="space-y-2 mt-2">
              <p>
                <strong>ID:</strong> {profile.user_id}
              </p>
              <p>
                <strong>Prénom:</strong> {profile.first_name || "Non défini"}
              </p>
              <p>
                <strong>Nom:</strong> {profile.last_name || "Non défini"}
              </p>
              <p>
                <strong>Rôle:</strong> {profile.role}
              </p>
              <p>
                <strong>Avatar:</strong>{" "}
                {profile.avatar_url ? "Défini" : "Non défini"}
              </p>
            </div>
          </div>
        )}

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold">Instructions</h2>
          <p className="text-sm text-gray-600">
            Cette page synchronise automatiquement tes données depuis Clerk
            (nom, prénom, avatar) vers ton profil Supabase. Si tu ne vois pas
            ton nom, assure-toi d&apos;avoir complété ton profil dans Clerk.
          </p>
        </div>

        <div className="flex space-x-4">
          <a
            href="/test"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour au test
          </a>
          <a
            href="/sync-profile"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Synchroniser à nouveau
          </a>
        </div>
      </div>
    </div>
  );
}

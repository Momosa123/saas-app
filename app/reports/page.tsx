import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/actions/profile.actions";

export default async function ReportsPage() {
  // Vérifier que l'utilisateur est bien un étudiant
  const role = await getUserRole();

  if (role !== "student") {
    redirect("/"); // Rediriger si pas étudiant
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mes Rapports de Session
          </h1>
          <p className="mt-2 text-gray-600">
            Consultez vos performances et progrès dans l&apos;apprentissage de
            l&apos;anglais
          </p>
        </div>

        {/* Contenu temporaire */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-12 w-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Rapports de Session
            </h3>
            <p className="text-gray-600 mb-6">
              Cette fonctionnalité sera bientôt disponible. Vous pourrez
              consulter vos scores de prononciation, fluidité et les feedbacks
              de vos sessions de pratique.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Prochainement :</strong>
                <br />• Historique des sessions
                <br />• Scores détaillés
                <br />• Analyse des progrès
                <br />• Recommandations personnalisées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

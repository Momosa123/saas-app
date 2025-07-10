import { redirect } from "next/navigation";
import {
  getUserRole,
  getCurrentUserProfile,
} from "@/lib/actions/profile.actions";
import {
  getStudentStats,
  getStudentAssignments,
  getStudentClasses,
  getRecentSessions,
} from "@/lib/actions/student.actions";
import { StudentStatsCards } from "@/components/student/StudentStatsCards";
import { AssignmentsList } from "@/components/student/AssignmentsList";
import { RecentSessionsList } from "@/components/student/RecentSessionsList";
import { StudentClasses } from "@/components/student/StudentClasses";
import { MotivationalSection } from "@/components/student/MotivationalSection";

export default async function MyJourneyPage() {
  // Vérifier que l'utilisateur est bien un étudiant
  const role = await getUserRole();
  if (role !== "student") {
    redirect("/dashboard"); // Rediriger les professeurs vers leur dashboard
  }

  // Récupérer le profil et les données de l'étudiant
  const profile = await getCurrentUserProfile();
  if (!profile) {
    redirect("/");
  }

  // Récupérer toutes les données en parallèle
  const [stats, assignments, classes, recentSessions] = await Promise.all([
    getStudentStats(),
    getStudentAssignments(),
    getStudentClasses(),
    getRecentSessions(3),
  ]);

  const firstName = profile.first_name || "Étudiant";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec salutation personnalisée */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Bonjour {firstName} ! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Continuons votre apprentissage de l&apos;anglais
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <span className="text-2xl">🎯</span>
                <span className="text-sm font-medium text-gray-700">
                  Objectif du jour : 1 session
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <StudentStatsCards stats={stats} />

        {/* Section motivationnelle */}
        <MotivationalSection stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Colonne gauche - Devoirs et Classes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Devoirs assignés */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">📚</span>
                    Devoirs assignés
                  </h2>
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-medium">
                    {assignments.length}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <AssignmentsList assignments={assignments} />
              </div>
            </div>

            {/* Mes Classes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">🏫</span>
                  Mes Classes
                </h2>
              </div>
              <div className="p-6">
                <StudentClasses classes={classes} />
              </div>
            </div>
          </div>

          {/* Colonne droite - Sessions récentes et Quick Actions */}
          <div className="space-y-8">
            {/* Sessions récentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">⚡</span>
                  Sessions récentes
                </h2>
              </div>
              <div className="p-6">
                <RecentSessionsList sessions={recentSessions} />
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">🚀</span>
                  Actions rapides
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <a
                  href="/tutors"
                  className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-center font-medium shadow-sm"
                >
                  🤖 Nouvelle session IA
                </a>
                <a
                  href="/reports"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors text-center font-medium"
                >
                  📊 Voir tous mes rapports
                </a>
                <button className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-4 py-3 rounded-lg transition-colors text-center font-medium">
                  🎯 Définir objectifs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/actions/profile.actions";
import { getTeacherClasses } from "@/lib/actions/class.actions";
import { CreateClassButton } from "@/components/dashboard/CreateClassButton";
import { ClassCard } from "@/components/dashboard/ClassCard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

export default async function DashboardPage() {
  // Vérifier que l'utilisateur est bien un professeur
  const role = await getUserRole();

  if (role !== "teacher") {
    redirect("/"); // Rediriger vers l'accueil si pas professeur
  }

  // Récupérer les classes du professeur
  const classes = await getTeacherClasses();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord professeur
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez vos classes et suivez les progrès de vos étudiants
          </p>
        </div>

        {/* Statistiques */}
        <DashboardStats classes={classes} />

        {/* Section Classes */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Mes Classes ({classes.length})
            </h2>
            <CreateClassButton />
          </div>

          {/* Liste des classes */}
          {classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <ClassCard key={classItem.class_id} classData={classItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="mx-auto max-w-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune classe créée
                </h3>
                <p className="text-gray-500 mb-6">
                  Commencez par créer votre première classe pour regrouper vos
                  étudiants.
                </p>
                <CreateClassButton variant="primary" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

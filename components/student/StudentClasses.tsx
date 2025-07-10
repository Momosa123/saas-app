import type { Class } from "@/types";

interface StudentClassesProps {
  classes: Class[];
}

export function StudentClasses({ classes }: StudentClassesProps) {
  if (classes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto max-w-sm">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🏫</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune classe assignée
          </h3>
          <p className="text-gray-500 text-sm">
            Votre professeur ne vous a pas encore ajouté à une classe.
            Contactez-le pour rejoindre une classe !
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {classes.map((classItem) => (
        <div
          key={classItem.class_id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">
                  {classItem.class_name}
                </h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Actif
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <span className="mr-1">👨‍🏫</span>
                  Professeur: {classItem.teacher_id || "Non défini"}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">📅</span>
                  Créée:{" "}
                  {new Date(classItem.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>

              {classItem.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {classItem.description}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">📊 Progression</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 80 + 20)}%` }}
                  />
                </div>
              </div>

              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Voir détails →
              </button>
            </div>
          </div>
        </div>
      ))}

      {classes.length > 2 && (
        <div className="pt-4 border-t border-gray-100">
          <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2">
            Voir toutes les classes ({classes.length})
          </button>
        </div>
      )}
    </div>
  );
}

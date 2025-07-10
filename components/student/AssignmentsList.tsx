import type { Assignment } from "@/types";

interface AssignmentsListProps {
  assignments: Assignment[];
}

export function AssignmentsList({ assignments }: AssignmentsListProps) {
  if (assignments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto max-w-sm">
          <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun devoir assigné
          </h3>
          <p className="text-gray-500 text-sm">
            Votre professeur n&apos;a pas encore assigné de devoirs. En
            attendant, vous pouvez pratiquer librement avec nos AI Tutors !
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.slice(0, 3).map((assignment) => (
        <div
          key={assignment.assignment_id}
          className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {assignment.title}
              </h4>
              {assignment.description && (
                <p className="text-gray-600 text-sm mb-2">
                  {assignment.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="mr-1">🏫</span>
                  Classe: {assignment.class_id}
                </span>
                {assignment.due_date && (
                  <span className="flex items-center">
                    <span className="mr-1">📅</span>À rendre:{" "}
                    {new Date(assignment.due_date).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {assignment.due_date &&
              new Date(assignment.due_date) < new Date() ? (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  En retard
                </span>
              ) : (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  À faire
                </span>
              )}
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Commencer →
              </button>
            </div>
          </div>
        </div>
      ))}

      {assignments.length > 3 && (
        <div className="pt-4 border-t border-gray-100">
          <button className="w-full text-center text-orange-600 hover:text-orange-800 font-medium py-2">
            Voir tous les devoirs ({assignments.length})
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { removeStudentFromClass } from "@/lib/actions/class.actions";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

interface StudentListProps {
  students: Profile[];
  classId: string;
}

export function StudentList({ students, classId }: StudentListProps) {
  const [removingStudent, setRemovingStudent] = useState<string | null>(null);

  const handleRemoveStudent = async (studentId: string) => {
    if (
      !confirm("Êtes-vous sûr de vouloir retirer cet étudiant de la classe ?")
    ) {
      return;
    }

    setRemovingStudent(studentId);
    try {
      const result = await removeStudentFromClass(classId, studentId);
      if (result.success) {
        // La page sera automatiquement mise à jour grâce à revalidatePath
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch {
      alert("Erreur inattendue");
    } finally {
      setRemovingStudent(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (students.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="mx-auto max-w-sm">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucun étudiant
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter des étudiants à votre classe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Étudiant
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Statut
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Inscrit depuis
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Dernière activité
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.user_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={student.avatar_url || "/default-avatar.png"}
                      alt={`${student.first_name} ${student.last_name}`}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {student.first_name && student.last_name
                        ? `${student.first_name} ${student.last_name}`
                        : "Utilisateur sans nom"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.role === "student" ? "Étudiant" : "Professeur"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Actif
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(student.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    // TODO: Implémenter la vue des détails de l'étudiant
                    alert("Fonctionnalité à venir");
                  }}
                >
                  Voir détails
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveStudent(student.user_id)}
                  disabled={removingStudent === student.user_id}
                >
                  {removingStudent === student.user_id
                    ? "Suppression..."
                    : "Retirer"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getAllStudents, addStudentToClass } from "@/lib/actions/class.actions";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

interface AddStudentButtonProps {
  classId: string;
}

export function AddStudentButton({ classId }: AddStudentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const allStudents = await getAllStudents();
      setStudents(allStudents);
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentId: string) => {
    try {
      const result = await addStudentToClass(classId, studentId);
      if (result.success) {
        setIsOpen(false);
        // La page sera automatiquement mise à jour grâce à revalidatePath
      } else {
        alert(result.error || "Erreur lors de l'ajout");
      }
    } catch {
      alert("Erreur inattendue");
    }
  };

  const filteredStudents = students.filter((student) => {
    // Si pas de terme de recherche, afficher tous les étudiants
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const firstName = student.first_name?.toLowerCase() || "";
    const lastName = student.last_name?.toLowerCase() || "";

    return firstName.includes(searchLower) || lastName.includes(searchLower);
  });

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        + Ajouter un étudiant
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Ajouter un étudiant</h2>

            {/* Recherche */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Liste des étudiants */}
            <div className="space-y-2 mb-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">
                    Chargement des étudiants...
                  </p>
                </div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div
                    key={student.user_id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                  >
                    <div className="flex items-center">
                      <img
                        src={student.avatar_url || "/default-avatar.png"}
                        alt={`${student.first_name} ${student.last_name}`}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.first_name && student.last_name
                            ? `${student.first_name} ${student.last_name}`
                            : "Utilisateur sans nom"}
                        </p>
                        <p className="text-sm text-gray-500">Étudiant</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddStudent(student.user_id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Ajouter
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm
                    ? "Aucun étudiant trouvé"
                    : "Aucun étudiant disponible"}
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

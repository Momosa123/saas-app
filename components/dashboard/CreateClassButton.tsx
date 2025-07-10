"use client";

import { useState } from "react";
import { createClass } from "@/lib/actions/class.actions";
import { Button } from "@/components/ui/button";

interface CreateClassButtonProps {
  variant?: "default" | "primary";
}

export function CreateClassButton({
  variant = "default",
}: CreateClassButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const className = formData.get("class_name") as string;
      const description = formData.get("description") as string;

      if (!className.trim()) {
        setError("Le nom de la classe est requis");
        return;
      }

      const result = await createClass({
        class_name: className,
        description: description || undefined,
      });

      if (result.success) {
        setIsOpen(false);
        // La page sera automatiquement mise à jour grâce à revalidatePath
      } else {
        setError(result.error || "Erreur lors de la création");
      }
    } catch {
      setError("Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={variant === "primary" ? "default" : "outline"}
        className={variant === "primary" ? "bg-blue-600 hover:bg-blue-700" : ""}
      >
        <span className="mr-2">+</span>
        Créer une classe
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              Créer une nouvelle classe
            </h2>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="class_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom de la classe *
                </label>
                <input
                  type="text"
                  id="class_name"
                  name="class_name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Anglais niveau intermédiaire"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description (optionnel)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description de la classe..."
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Création..." : "Créer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

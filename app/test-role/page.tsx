import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  getOrCreateUserProfile,
  updateProfile,
} from "@/lib/actions/profile.actions";
import { Button } from "@/components/ui/button";

async function changeRole(formData: FormData) {
  "use server";

  const { userId } = await auth();
  if (!userId) return;

  const newRole = formData.get("role") as "student" | "teacher";

  await updateProfile({
    role: newRole,
  });

  redirect("/test-role");
}

export default async function TestRolePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getOrCreateUserProfile();

  if (!profile) {
    return <div>Profil non trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Test - Changer de rôle
        </h1>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Profil actuel :</p>
          <div className="bg-gray-50 p-3 rounded-md">
            <p>
              <strong>Nom :</strong> {profile.first_name} {profile.last_name}
            </p>
            <p>
              <strong>Rôle :</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  profile.role === "teacher"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {profile.role === "teacher" ? "Professeur" : "Étudiant"}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Changer de rôle :</h2>

          <form action={changeRole} className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  defaultChecked={profile.role === "student"}
                  className="text-blue-600"
                />
                <span>Étudiant</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  defaultChecked={profile.role === "teacher"}
                  className="text-blue-600"
                />
                <span>Professeur</span>
              </label>
            </div>

            <Button type="submit" className="w-full">
              Changer de rôle
            </Button>
          </form>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            ⚠️ Cette page est uniquement pour les tests. Elle sera supprimée en
            production.
          </p>
        </div>
      </div>
    </div>
  );
}

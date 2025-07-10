import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/actions/profile.actions";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const role = await getUserRole();

    return NextResponse.json({
      role,
      userId,
    });
  } catch (error) {
    console.error("Erreur API user/role:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

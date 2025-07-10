import { redirect } from "next/navigation";

export default function TutorsPage() {
  // Redirection temporaire vers l'ancienne page companions
  // TODO: Renommer complètement companions → tutors dans une prochaine étape
  redirect("/companions");
}

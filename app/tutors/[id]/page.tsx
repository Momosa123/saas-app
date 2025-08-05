import CompanionComponent from "@/components/CompanionComponent";
import { getCompanion } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

interface TutorSessionPageProps {
  params: Promise<{ id: string }>;
}

const TutorSession = async ({ params }: TutorSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();

  const { name, subject, topic, duration } = companion;

  if (!user) redirect("/sign-in");
  if (!name) redirect("/tutors");

  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={35}
              height={35}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">🤖 {name}</p>
              <div className="subject-badge max-sm:hidden">{subject}</div>
            </div>
            <p className="text-lg">📚 {topic}</p>
            <p className="text-sm text-gray-600">
              AI-powered English learning session
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end max-md:items-start max-md:mt-4">
          <div className="text-2xl font-bold max-md:text-lg">
            ⏱️ {duration} minutes
          </div>
          <div className="text-sm text-gray-500 mt-1">Practice session</div>
        </div>
      </article>

      <CompanionComponent
        {...companion}
        companionId={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
        tutorType="conversation" // Par défaut, peut être configuré dynamiquement
      />
    </main>
  );
};

export default TutorSession;

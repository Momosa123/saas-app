interface StudentStats {
  totalSessions: number;
  thisWeekSessions: number;
  averageScore: number;
  lastSessionDate: string | null;
}

interface MotivationalSectionProps {
  stats: StudentStats | null;
}

export function MotivationalSection({ stats }: MotivationalSectionProps) {
  const getMotivationalMessage = () => {
    const sessions = stats?.thisWeekSessions || 0;
    const score = stats?.averageScore || 0;

    if (sessions === 0) {
      return {
        message: "Prêt à commencer votre parcours d'apprentissage ?",
        subtitle: "Lancez votre première session aujourd'hui !",
        emoji: "🚀",
        color: "from-blue-500 to-purple-600",
      };
    }

    if (sessions >= 5) {
      return {
        message: "Incroyable ! Vous êtes très assidu cette semaine !",
        subtitle: `${sessions} sessions cette semaine - continuez ainsi !`,
        emoji: "🔥",
        color: "from-orange-400 to-red-500",
      };
    }

    if (score >= 80) {
      return {
        message: "Excellent travail ! Vos scores sont impressionnants !",
        subtitle: "Vous maîtrisez de mieux en mieux l'anglais !",
        emoji: "⭐",
        color: "from-yellow-400 to-orange-500",
      };
    }

    if (sessions >= 3) {
      return {
        message: "Beau progrès cette semaine !",
        subtitle: "Votre régularité porte ses fruits !",
        emoji: "👏",
        color: "from-green-400 to-blue-500",
      };
    }

    return {
      message: "Continuez sur cette lancée !",
      subtitle: "Chaque session vous rapproche de vos objectifs !",
      emoji: "💪",
      color: "from-purple-400 to-pink-500",
    };
  };

  const motivation = getMotivationalMessage();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${motivation.color} p-8 text-white shadow-lg mb-8`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          fill="currentColor"
          viewBox="0 0 100 100"
        >
          <defs>
            <pattern
              id="hero-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-5xl">{motivation.emoji}</span>
            <div>
              <h3 className="text-2xl font-bold mb-2">{motivation.message}</h3>
              <p className="text-lg opacity-90">{motivation.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Streak counter si applicable */}
        {stats && stats.thisWeekSessions > 0 && (
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.thisWeekSessions}</div>
              <div className="text-sm opacity-75">sessions cette semaine</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

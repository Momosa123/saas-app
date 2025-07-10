interface StudentStats {
  totalSessions: number;
  thisWeekSessions: number;
  averageScore: number;
  lastSessionDate: string | null;
}

interface StudentStatsCardsProps {
  stats: StudentStats | null;
}

export function StudentStatsCards({ stats }: StudentStatsCardsProps) {
  const statsData = [
    {
      label: "Sessions totales",
      value: stats?.totalSessions || 0,
      icon: "🎯",
      color: "from-blue-400 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      label: "Cette semaine",
      value: stats?.thisWeekSessions || 0,
      icon: "⚡",
      color: "from-green-400 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      label: "Score moyen",
      value: `${stats?.averageScore || 0}%`,
      icon: "📊",
      color: "from-purple-400 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      label: "Niveau actuel",
      value: getLevel(stats?.averageScore || 0),
      icon: "🌟",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bgColor} p-6 shadow-sm border border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div
              className={`text-4xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
            >
              {stat.icon}
            </div>
          </div>

          {/* Effet de brillance */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      ))}
    </div>
  );
}

function getLevel(averageScore: number): string {
  if (averageScore >= 90) return "Expert";
  if (averageScore >= 80) return "Avancé";
  if (averageScore >= 70) return "Intermédiaire";
  if (averageScore >= 60) return "Débutant+";
  if (averageScore >= 50) return "Débutant";
  return "Nouveau";
}

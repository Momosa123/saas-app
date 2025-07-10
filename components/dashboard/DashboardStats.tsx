import type { Class } from "@/types";

interface DashboardStatsProps {
  classes: Class[];
}

export function DashboardStats({ classes }: DashboardStatsProps) {
  // Calculer les statistiques de base
  const totalClasses = classes.length;
  const totalStudents = 0; // À calculer quand on aura les données des membres
  const recentClasses = classes.filter(
    (cls) =>
      new Date(cls.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const stats = [
    {
      label: "Classes actives",
      value: totalClasses,
      icon: "🏫",
      color: "blue",
    },
    {
      label: "Étudiants total",
      value: totalStudents,
      icon: "👥",
      color: "green",
    },
    {
      label: "Classes créées cette semaine",
      value: recentClasses,
      icon: "📈",
      color: "purple",
    },
    {
      label: "Devoirs assignés",
      value: 0, // À implémenter plus tard
      icon: "📚",
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

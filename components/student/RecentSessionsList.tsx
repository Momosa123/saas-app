import type { SessionReport } from "@/types";

interface RecentSessionsListProps {
  sessions: SessionReport[];
}

export function RecentSessionsList({ sessions }: RecentSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto max-w-sm">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚡</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune session récente
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Commencez votre première session pour voir vos progrès ici !
          </p>
          <a
            href="/tutors"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            🚀 Commencer maintenant
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.report_id}
          className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  Session #{session.report_id}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(session.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {session.assignment_id && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-2">
                  📚 Devoir
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {session.pronunciation_score && (
                <div className="text-center">
                  <div className="text-xs text-gray-500">Prononciation</div>
                  <div
                    className={`text-sm font-semibold ${
                      session.pronunciation_score >= 80
                        ? "text-green-600"
                        : session.pronunciation_score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {session.pronunciation_score}%
                  </div>
                </div>
              )}

              {session.fluency_score && (
                <div className="text-center">
                  <div className="text-xs text-gray-500">Fluidité</div>
                  <div
                    className={`text-sm font-semibold ${
                      session.fluency_score >= 80
                        ? "text-green-600"
                        : session.fluency_score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {session.fluency_score}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {session.grammar_feedback && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              💡 {session.grammar_feedback}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                Durée: {Math.floor(Math.random() * 15 + 5)} min
              </span>
              {session.audio_url && (
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  🎵 Écouter
                </button>
              )}
            </div>

            <button className="text-xs text-green-600 hover:text-green-800 font-medium">
              Voir détails →
            </button>
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-gray-100">
        <a
          href="/reports"
          className="block w-full text-center text-green-600 hover:text-green-800 font-medium py-2"
        >
          Voir toutes les sessions
        </a>
      </div>
    </div>
  );
}

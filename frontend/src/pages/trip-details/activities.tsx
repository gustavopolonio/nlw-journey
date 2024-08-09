import { CircleCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../lib/axios';

interface Activity {
  id: string
  title: string
  occurs_at: string
  trip_id: string
}

interface ActivitiesByDate {
  date: string
  activities: Activity[]
}

export function Activities() {
  const { tripId } = useParams();

  const [activities, setActivities] = useState<ActivitiesByDate[]>([]);

  useEffect(() => {
    async function getActivities() {
      try {
        const response = await api.get<{ activities: ActivitiesByDate[] }>(`/trips/${tripId}/activity`);
        setActivities(response.data.activities);
      } catch (error) {
        console.log(error);
      }
    }

    getActivities();
  }, [tripId]);

  return (
    <div className="space-y-8">
      {activities.map((activityByDate) => (
        <div key={activityByDate.date} className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-zinc-300 text-xl font-semibold">
              Dia
              {' '}
              {format(activityByDate.date, 'd')}
            </span>
            <span className="text-zinc-500 text-xs">
              {format(activityByDate.date, 'EEEE', {
                locale: ptBR,
              })}
            </span>
          </div>
          {activityByDate.activities.length > 0 ? (
            activityByDate.activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2.5 px-4 bg-zinc-900 rounded-xl shadow-shape"
              >
                <div className="flex items-center gap-3">
                  <CircleCheck className="size-5 text-lime-300" />
                  <span className="text-zinc-100">{activity.title}</span>
                </div>
                <span className="text-zinc-400 text-sm">{format(activity.occurs_at, "HH:mm'h'")}</span>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
          )}
        </div>
      ))}
    </div>
  );
}

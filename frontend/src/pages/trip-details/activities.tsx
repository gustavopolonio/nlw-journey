import { CircleCheck, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCallback, useEffect } from 'react';
import { Popconfirm } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Activity, getActivitiesThunk, selectAllActivities } from '../../features/acitivities/activitiesSlice';
import { Button } from '../../components/button';
import { api } from '../../lib/axios';

export function Activities() {
  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const activities = useAppSelector(selectAllActivities);

  async function handleRemoveActivity(activity: Activity) {
    try {
      await api.delete(`/activities/${activity.id}`);
      await getActivities();
    } catch (error) {
      console.log(error);
    }
  }

  const getActivities = useCallback(async () => {
    if (tripId) await dispatch(getActivitiesThunk({ tripId }));
  }, [dispatch, tripId]);

  useEffect(() => {
    getActivities();
  }, [getActivities]);

  return (
    <div className="space-y-8">
      {activities.length > 0 ? activities.map((activityByDate) => (
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
          {activityByDate.items.length > 0 ? (
            activityByDate.items.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-2 pl-4 pr-1 bg-zinc-900 rounded-xl shadow-shape"
              >
                <div className="flex items-center gap-3">
                  <CircleCheck className="size-5 text-lime-300 shrink-0" />
                  <span className="text-zinc-100 block truncate">{activity.title}</span>
                </div>
                <span className="flex items-center text-zinc-400 text-sm shrink-0">
                  {format(activity.occurs_at, "HH:mm'h'")}
                  <Popconfirm
                    title="Remover atividade"
                    description={(
                      <div>
                        Tem certeza que deseja remover a atividade
                        {' '}
                        <span className="font-medium">
                          {activity.title}
                        </span>
                        ?
                      </div>
                    )}
                    okText="Sim"
                    cancelText="Cancelar"
                    onConfirm={() => handleRemoveActivity(activity)}
                  >
                    <Button variant="outline" className="p-3">
                      <Trash className="size-5 text-zinc-400" />
                    </Button>
                  </Popconfirm>
                </span>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
          )}
        </div>
      )) : (
        <p>Nenhum atividade cadastrada.</p>
      )}
    </div>
  );
}

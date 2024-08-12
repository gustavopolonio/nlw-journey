import { AxiosError } from 'axios';
import { useRouteError, Link } from 'react-router-dom';
import { Button } from '../../components/button';

export function ErrorPage() {
  const error = useRouteError();

  if (error instanceof AxiosError && error.response?.data.message === 'Trip not found!') {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-6 bg-pattern bg-no-repeat bg-center text-lg font-bold text-zinc-300">
        <span>Viagem não encontrada :(</span>
        <Button>
          <Link to="/">Volte para a homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 bg-pattern bg-no-repeat bg-center text-lg font-bold text-zinc-300">
      <h1>Oops!</h1>
      <span>Algo deu errado :(</span>
      <Button>
        <Link to="/">Volte para a homepage</Link>
      </Button>
    </div>
  );
}

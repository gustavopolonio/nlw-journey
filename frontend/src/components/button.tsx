import { ReactNode, ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import { Spinner } from './spinner';

const buttonVariants = tv({
  base: 'font-medium rounded-lg px-5 flex items-center justify-center gap-2',
  variants: {
    variant: {
      primary: 'bg-lime-300 text-zinc-950 enabled:hover:bg-lime-400',
      secondary: 'bg-zinc-800 text-zinc-200 enabled:hover:bg-zinc-700',
      danger: 'bg-red-500 text-zinc-100 enabled:hover:bg-red-600',
      outline: 'bg-transparent text-zinc-200',
    },
    size: {
      default: 'py-2',
      full: 'w-full h-11',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  children: ReactNode
}

export function Button({
  loading = false,
  children,
  variant,
  size,
  ...props
}: ButtonProps) {
  const isDisabled = props.disabled ? 'cursor-not-allowed opacity-30' : '';
  const classNames = props.className || '';

  return (
    <button
      type="button"
      {...props}
      className={buttonVariants({ variant, size, class: `${isDisabled} ${classNames}` })}
    >
      {loading ? (
        <Spinner />
      ) : (
        children
      )}
    </button>
  );
}

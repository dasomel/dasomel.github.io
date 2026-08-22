import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-sm',
        primary: 'bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 shadow-sm',
        secondary: 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-hi)] hover:border-[var(--border-hi)]',
        outline: 'border border-[var(--border)] text-[var(--text)] hover:border-[var(--border-hi)] hover:bg-[var(--surface-hi)]',
        ghost: 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hi)]',
        link: 'text-[var(--accent)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-6 py-2.5',
        sm: 'px-3.5 py-1.5 text-xs',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';
export { Button, buttonVariants };

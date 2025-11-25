import { cn } from '@/lib/utils'; // Assumo tu abbia la utility cn visto che usi clsx e tailwind-merge
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number; // opzionale, per gestire la grandezza
}

export const Spinner = ({ className, size = 24, ...props }: SpinnerProps) => {
  return <Loader2 className={cn('animate-spin text-primary', className)} size={size} {...props} />;
};

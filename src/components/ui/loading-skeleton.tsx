import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'button';
}

export function LoadingSkeleton({ className, variant = 'text' }: LoadingSkeletonProps) {
  const variants = {
    card: 'h-32 rounded-xl',
    text: 'h-4 rounded',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  };

  return (
    <motion.div
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn(
        'bg-muted/50',
        variants[variant],
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-border/30 bg-card space-y-3">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="w-16 h-5" />
        <LoadingSkeleton variant="avatar" className="h-6 w-6" />
      </div>
      <LoadingSkeleton className="w-full" />
      <LoadingSkeleton className="w-3/4" />
      <div className="flex items-center gap-2 pt-2">
        <LoadingSkeleton className="w-12 h-5 rounded-full" />
        <LoadingSkeleton className="w-12 h-5 rounded-full" />
      </div>
    </div>
  );
}

export function ColumnSkeleton() {
  return (
    <div className="w-72 flex-shrink-0 space-y-3">
      <div className="flex items-center justify-between px-2">
        <LoadingSkeleton className="w-24 h-5" />
        <LoadingSkeleton className="w-8 h-5" />
      </div>
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 p-6 overflow-x-auto">
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
    </div>
  );
}

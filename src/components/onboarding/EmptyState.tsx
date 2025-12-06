import { motion } from 'framer-motion';
import { LucideIcon, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  variant?: 'default' | 'hero';
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  variant = 'default',
  className,
}: EmptyStateProps) {
  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/50 p-12",
          "bg-gradient-to-br from-primary/5 via-background to-accent/5",
          className
        )}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          >
            <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-primary/30" />
            <div className="absolute top-1/4 right-0 w-1.5 h-1.5 rounded-full bg-accent/30" />
            <div className="absolute bottom-1/4 left-0 w-1 h-1 rounded-full bg-primary/20" />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 p-4 rounded-2xl bg-primary/10 text-primary"
          >
            <Icon className="h-10 w-10" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-3"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8 leading-relaxed"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            {actionLabel && onAction && (
              <Button
                onClick={onAction}
                size="lg"
                className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
              >
                <Sparkles className="h-4 w-4" />
                {actionLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {secondaryLabel && onSecondary && (
              <Button variant="outline" onClick={onSecondary} size="lg">
                {secondaryLabel}
              </Button>
            )}
          </motion.div>
        </div>

        {/* Feature hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-methodology-scrum" />
            <span>Scrum</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-methodology-kanban" />
            <span>Kanban</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-methodology-dmaic" />
            <span>DMAIC</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-methodology-waterfall" />
            <span>Waterfall</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center p-12 rounded-xl",
        "border border-dashed border-border/50 bg-muted/20",
        className
      )}
    >
      <div className="p-3 rounded-xl bg-muted/50 text-muted-foreground mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="gap-2">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

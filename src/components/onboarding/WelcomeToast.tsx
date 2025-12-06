import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Keyboard, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeToastProps {
  onDismiss: () => void;
}

const tips = [
  {
    icon: MousePointer2,
    title: 'Arraste e solte',
    description: 'Mova cards entre colunas arrastando-os',
  },
  {
    icon: Keyboard,
    title: 'Atalhos rápidos',
    description: 'Clique no + para adicionar novos cards',
  },
  {
    icon: Lightbulb,
    title: 'Metodologias',
    description: 'Cada metodologia tem regras próprias de fluxo',
  },
];

export function WelcomeToast({ onDismiss }: WelcomeToastProps) {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const tip = tips[currentTip];
  const Icon = tip.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-xl border border-border/50 bg-card shadow-xl"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Dica rápida</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">{tip.title}</h4>
              <p className="text-muted-foreground text-sm mt-0.5">{tip.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentTip
                  ? 'w-4 bg-primary'
                  : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

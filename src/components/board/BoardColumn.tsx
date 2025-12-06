import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { MoreHorizontal, Plus, AlertCircle } from 'lucide-react';
import { Column, Card as CardType } from '@/types/project';
import { BoardCard } from './BoardCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BoardColumnProps {
  column: Column;
  onAddCard: (columnId: string) => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (cardId: string) => void;
}

export function BoardColumn({ column, onAddCard, onEditCard, onDeleteCard }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const isOverLimit = column.wipLimit ? column.cards.length >= column.wipLimit : false;
  const atLimit = column.wipLimit ? column.cards.length === column.wipLimit : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col w-80 flex-shrink-0 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm",
        isOver && !isOverLimit && "ring-2 ring-primary/50",
        isOver && isOverLimit && "ring-2 ring-destructive/50"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">{column.name}</h3>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            atLimit 
              ? "bg-destructive/20 text-destructive" 
              : "bg-muted text-muted-foreground"
          )}>
            {column.cards.length}
            {column.wipLimit && `/${column.wipLimit}`}
          </span>
          {isOverLimit && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)]"
      >
        {column.cards.map((card, index) => (
          <BoardCard
            key={card.id}
            card={card}
            index={index}
            onEdit={() => onEditCard(card)}
            onDelete={() => onDeleteCard(card.id)}
          />
        ))}
        
        {column.cards.length === 0 && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-border/50 rounded-lg text-muted-foreground text-sm">
            Arraste cards aqui
          </div>
        )}
      </div>

      {/* Add Card Button */}
      <div className="p-3 border-t border-border/30">
        <Button
          variant="ghost"
          onClick={() => onAddCard(column.id)}
          disabled={isOverLimit}
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
            isOverLimit && "opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="h-4 w-4" />
          Adicionar Card
        </Button>
      </div>
    </motion.div>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Clock, User, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Card as CardType } from '@/types/project';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BoardCardProps {
  card: CardType;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityConfig = {
  critical: { label: 'Crítico', class: 'card-priority-critical', dotClass: 'bg-priority-critical' },
  high: { label: 'Alto', class: 'card-priority-high', dotClass: 'bg-priority-high' },
  medium: { label: 'Médio', class: 'card-priority-medium', dotClass: 'bg-priority-medium' },
  low: { label: 'Baixo', class: 'card-priority-low', dotClass: 'bg-priority-low' },
};

export function BoardCard({ card, index, onEdit, onDelete }: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[card.priority];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group glass-card p-4 cursor-pointer transition-all duration-200",
        priority.class,
        isDragging && "opacity-50 shadow-lg scale-105 rotate-2"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Card Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-foreground leading-snug">{card.title}</h4>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {card.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          )}

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {card.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
            <div className="flex items-center gap-3">
              {/* Priority */}
              <div className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", priority.dotClass)} />
                <span className="text-xs text-muted-foreground">{priority.label}</span>
              </div>

              {/* Story Points */}
              {card.storyPoints && (
                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                  {card.storyPoints} pts
                </span>
              )}
            </div>

            {/* Assignee */}
            {card.assignee && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{card.assignee}</span>
              </div>
            )}
          </div>

          {/* Due Date */}
          {card.dueDate && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{new Date(card.dueDate).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Plus, FolderKanban } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { EmptyState } from '@/components/onboarding/EmptyState';
import { BoardColumn } from './BoardColumn';
import { BoardCard } from './BoardCard';
import { CardModal } from './CardModal';
import { Button } from '@/components/ui/button';
import { Card as CardType, PriorityType } from '@/types/project';
import { toast } from 'sonner';

export function KanbanBoard() {
  const { currentBoard, addCard, updateCard, deleteCard, moveCard } = useProjectStore();
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <EmptyState
          icon={FolderKanban}
          title="Nenhum projeto selecionado"
          description="Selecione um projeto na barra lateral ou crie um novo para começar a organizar suas tarefas."
          actionLabel="Ver Dashboard"
          onAction={() => {}}
        />
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    
    if (activeData?.type === 'card') {
      setActiveCard(activeData.card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeData = active.data.current;
    if (activeData?.type !== 'card') return;

    const card = activeData.card as CardType;
    const fromColumnId = card.columnId;
    const toColumnId = over.id as string;

    if (fromColumnId === toColumnId) return;

    const toColumn = currentBoard.columns.find(col => col.id === toColumnId);
    if (!toColumn) return;

    const success = moveCard(card.id, fromColumnId, toColumnId, toColumn.cards.length);
    
    if (!success) {
      // Check why it failed
      const column = currentBoard.columns.find(c => c.id === toColumnId);
      if (column?.wipLimit && column.cards.length >= column.wipLimit) {
        toast.error(`Limite WIP atingido na coluna "${column.name}"`);
      } else {
        toast.error('Transição bloqueada pela metodologia');
      }
    }
  };

  const handleAddCard = (columnId: string) => {
    setSelectedColumnId(columnId);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    setSelectedColumnId(card.columnId);
    setIsModalOpen(true);
  };

  const handleSaveCard = (data: {
    title: string;
    description?: string;
    priority: PriorityType;
    assignee?: string;
    tags?: string[];
    storyPoints?: number;
    dueDate?: string;
  }) => {
    if (editingCard) {
      updateCard(editingCard.id, data);
      toast.success('Card atualizado!');
    } else if (selectedColumnId) {
      addCard(selectedColumnId, {
        ...data,
        status: 'todo',
      });
      toast.success('Card criado!');
    }
    setIsModalOpen(false);
    setEditingCard(null);
    setSelectedColumnId(null);
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
    toast.success('Card excluído!');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{currentBoard.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentBoard.columns.reduce((acc, col) => acc + col.cards.length, 0)} cards • 
            {currentBoard.columns.length} colunas
          </p>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full">
            {currentBoard.columns
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  onAddCard={handleAddCard}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />
              ))}
          </div>

          <DragOverlay>
            {activeCard && (
              <div className="rotate-3 scale-105">
                <BoardCard
                  card={activeCard}
                  index={0}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Card Modal */}
      <CardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
          setSelectedColumnId(null);
        }}
        onSave={handleSaveCard}
        card={editingCard}
      />
    </div>
  );
}

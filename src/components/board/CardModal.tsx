import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react';
import { Card as CardType, PriorityType } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description?: string;
    priority: PriorityType;
    assignee?: string;
    tags?: string[];
    storyPoints?: number;
    dueDate?: string;
  }) => void;
  card?: CardType | null;
}

export function CardModal({ isOpen, onClose, onSave, card }: CardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [assignee, setAssignee] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [storyPoints, setStoryPoints] = useState<string>('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setPriority(card.priority);
      setAssignee(card.assignee || '');
      setTags(card.tags || []);
      setStoryPoints(card.storyPoints?.toString() || '');
      setDueDate(card.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssignee('');
      setTags([]);
      setStoryPoints('');
      setDueDate('');
    }
  }, [card, isOpen]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assignee: assignee.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      storyPoints: storyPoints ? parseInt(storyPoints) : undefined,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {card ? 'Editar Card' : 'Novo Card'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do card"
              className="bg-muted/50 border-border/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a tarefa..."
              rows={3}
              className="bg-muted/50 border-border/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as PriorityType)}>
                <SelectTrigger className="bg-muted/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">🔴 Crítico</SelectItem>
                  <SelectItem value="high">🟠 Alto</SelectItem>
                  <SelectItem value="medium">🔵 Médio</SelectItem>
                  <SelectItem value="low">🟢 Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Story Points */}
            <div className="space-y-2">
              <Label htmlFor="storyPoints">Story Points</Label>
              <Input
                id="storyPoints"
                type="number"
                min="0"
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
                placeholder="0"
                className="bg-muted/50 border-border/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="space-y-2">
              <Label htmlFor="assignee">Responsável</Label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Nome do responsável"
                className="bg-muted/50 border-border/50"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Entrega</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-muted/50 border-border/50"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Adicionar tag"
                className="bg-muted/50 border-border/50"
              />
              <Button type="button" variant="secondary" onClick={handleAddTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {card ? 'Salvar Alterações' : 'Criar Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

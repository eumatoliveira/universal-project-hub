import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';
import { methodologies, getMethodologiesByCategory } from '@/config/methodologies';
import { MethodologyType, MethodologyConfig } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface MethodologyPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (methodology: MethodologyType, projectName: string) => void;
}

const categories = [
  { id: 'agile', name: 'Ágeis', description: 'Scrum, Kanban, XP...' },
  { id: 'lean', name: 'Lean & Melhoria', description: 'DMAIC, Kaizen, Lean...' },
  { id: 'traditional', name: 'Tradicionais', description: 'PMBOK, Waterfall, PRINCE2...' },
  { id: 'strategic', name: 'Estratégia', description: 'OKR, BSC...' },
];

export function MethodologyPicker({ isOpen, onClose, onSelect }: MethodologyPickerProps) {
  const [step, setStep] = useState<'category' | 'methodology' | 'name'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMethodology, setSelectedMethodology] = useState<MethodologyConfig | null>(null);
  const [projectName, setProjectName] = useState('');
  const [search, setSearch] = useState('');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('methodology');
  };

  const handleMethodologySelect = (methodology: MethodologyConfig) => {
    setSelectedMethodology(methodology);
    setStep('name');
  };

  const handleCreate = () => {
    if (selectedMethodology && projectName.trim()) {
      onSelect(selectedMethodology.id, projectName.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('category');
    setSelectedCategory(null);
    setSelectedMethodology(null);
    setProjectName('');
    setSearch('');
    onClose();
  };

  const handleBack = () => {
    if (step === 'name') {
      setStep('methodology');
      setSelectedMethodology(null);
    } else if (step === 'methodology') {
      setStep('category');
      setSelectedCategory(null);
    }
  };

  const filteredMethodologies = selectedCategory
    ? getMethodologiesByCategory(selectedCategory).filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] glass-card border-border/50 p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {step === 'category' && 'Escolha a Categoria'}
              {step === 'methodology' && 'Selecione a Metodologia'}
              {step === 'name' && 'Nome do Projeto'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {step === 'category' && 'Qual tipo de metodologia melhor se adapta ao seu projeto?'}
              {step === 'methodology' && `Metodologias ${categories.find(c => c.id === selectedCategory)?.name}`}
              {step === 'name' && `Usando ${selectedMethodology?.name}`}
            </DialogDescription>
          </DialogHeader>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Category Selection */}
          {step === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-6 pb-6"
            >
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="group p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all text-left"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Methodology Selection */}
          {step === 'methodology' && (
            <motion.div
              key="methodology"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-6 pb-6"
            >
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar metodologia..."
                  className="pl-10 bg-muted/50 border-border/50"
                />
              </div>

              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                {filteredMethodologies.map((methodology) => (
                  <button
                    key={methodology.id}
                    onClick={() => handleMethodologySelect(methodology)}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all text-left"
                  >
                    <span className="text-2xl">{methodology.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {methodology.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {methodology.description}
                      </p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(var(--${methodology.color}))` }}
                    />
                  </button>
                ))}
              </div>

              <Button variant="ghost" onClick={handleBack} className="mt-4">
                Voltar
              </Button>
            </motion.div>
          )}

          {/* Step 3: Project Name */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-6 pb-6"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 mb-4">
                <span className="text-2xl">{selectedMethodology?.icon}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedMethodology?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMethodology?.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Nome do projeto"
                  className="bg-muted/50 border-border/50"
                  autoFocus
                />

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={handleBack}>
                    Voltar
                  </Button>
                  <Button onClick={handleCreate} disabled={!projectName.trim()}>
                    <Check className="h-4 w-4 mr-2" />
                    Criar Projeto
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

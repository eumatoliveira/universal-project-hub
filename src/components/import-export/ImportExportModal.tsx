import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, FileJson, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { ExportedProject } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'import' | 'export';
}

export function ImportExportModal({ isOpen, onClose, mode }: ImportExportModalProps) {
  const { exportProject, importProject, currentProject } = useProjectStore();
  const [importMode, setImportMode] = useState<'merge' | 'overwrite'>('merge');
  const [importData, setImportData] = useState<ExportedProject | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportProject();
    if (!data) {
      toast.error('Nenhum projeto selecionado para exportar');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.project.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Projeto exportado com sucesso!');
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ExportedProject;
        
        // Validate structure
        if (!data.version || !data.project || !data.project.boards) {
          throw new Error('Formato de arquivo inválido');
        }
        
        if (data.version !== '1.0') {
          throw new Error(`Versão não suportada: ${data.version}`);
        }

        setImportData(data);
        setImportError(null);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Erro ao ler arquivo');
        setImportData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!importData) return;

    const success = importProject(importData, importMode);
    if (success) {
      toast.success('Projeto importado com sucesso!');
      onClose();
    } else {
      toast.error('Erro ao importar projeto');
    }
  };

  const handleClose = () => {
    setImportData(null);
    setImportError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {mode === 'export' ? (
              <>
                <Download className="h-5 w-5 text-primary" />
                Exportar Projeto
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 text-primary" />
                Importar Projeto
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'export'
              ? 'Exporte seu projeto para um arquivo JSON'
              : 'Importe um projeto a partir de um arquivo JSON'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {mode === 'export' ? (
            <>
              {currentProject ? (
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <FileJson className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">{currentProject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentProject.boards.length} boards • 
                        {currentProject.boards.reduce((acc, b) => 
                          acc + b.columns.reduce((a, c) => a + c.cards.length, 0), 0
                        )} cards
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-2" />
                  <p className="text-sm text-destructive">Nenhum projeto selecionado</p>
                </div>
              )}

              <Button
                onClick={handleExport}
                disabled={!currentProject}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar JSON
              </Button>
            </>
          ) : (
            <>
              {/* File Input */}
              <div 
                className="p-8 rounded-xl border-2 border-dashed border-border/50 bg-muted/20 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-foreground font-medium">
                  Clique para selecionar arquivo
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Apenas arquivos .json
                </p>
              </div>

              {/* Import Error */}
              {importError && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{importError}</span>
                  </div>
                </div>
              )}

              {/* Import Preview */}
              {importData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-foreground">{importData.project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Metodologia: {importData.project.methodology} • 
                          {importData.project.boards.length} boards
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Import Mode */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Modo de Importação</Label>
                    <RadioGroup
                      value={importMode}
                      onValueChange={(val) => setImportMode(val as 'merge' | 'overwrite')}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <RadioGroupItem value="merge" id="merge" />
                        <div>
                          <Label htmlFor="merge" className="font-medium cursor-pointer">
                            Mesclar
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Cria uma cópia com novos IDs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <RadioGroupItem value="overwrite" id="overwrite" />
                        <div>
                          <Label htmlFor="overwrite" className="font-medium cursor-pointer">
                            Substituir
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Substitui projeto existente com mesmo ID
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button onClick={handleImport} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Projeto
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

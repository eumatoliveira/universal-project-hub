import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { MethodologyPicker } from '@/components/methodology/MethodologyPicker';
import { ImportExportModal } from '@/components/import-export/ImportExportModal';
import { useProjectStore } from '@/store/projectStore';
import { MethodologyType } from '@/types/project';
import { toast } from 'sonner';

type PageType = 'dashboard' | 'board' | 'calendar' | 'analytics' | 'settings';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isMethodologyPickerOpen, setIsMethodologyPickerOpen] = useState(false);
  const [importExportMode, setImportExportMode] = useState<'import' | 'export' | null>(null);
  
  const { createProject, setCurrentProject } = useProjectStore();

  const handleCreateProject = (methodology: MethodologyType, name: string) => {
    const project = createProject(name, methodology);
    toast.success(`Projeto "${name}" criado com sucesso!`);
    setCurrentPage('board');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'board':
        return <KanbanBoard />;
      case 'calendar':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Calendário</h2>
              <p className="text-muted-foreground">Em breve: integração com Google, Apple e Outlook Calendar</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Métricas & Analytics</h2>
              <p className="text-muted-foreground">Em breve: dashboards de métricas, gargalos e IA</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Configurações</h2>
              <p className="text-muted-foreground">Em breve: integrações, notificações e preferências</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        onNavigate={(page) => setCurrentPage(page as PageType)}
        currentPage={currentPage}
        onNewProject={() => setIsMethodologyPickerOpen(true)}
        onExport={() => setImportExportMode('export')}
        onImport={() => setImportExportMode('import')}
      />
      
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Methodology Picker Modal */}
      <MethodologyPicker
        isOpen={isMethodologyPickerOpen}
        onClose={() => setIsMethodologyPickerOpen(false)}
        onSelect={handleCreateProject}
      />

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={importExportMode !== null}
        onClose={() => setImportExportMode(null)}
        mode={importExportMode || 'export'}
      />
    </div>
  );
};

export default Index;

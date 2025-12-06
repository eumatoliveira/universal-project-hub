import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  Zap
} from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { getMethodologyConfig } from '@/config/methodologies';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function Dashboard() {
  const { projects, currentProject, currentBoard } = useProjectStore();

  const stats = currentBoard ? {
    total: currentBoard.columns.reduce((acc, col) => acc + col.cards.length, 0),
    done: currentBoard.columns.find(c => 
      c.name.toLowerCase().includes('done') || 
      c.name.toLowerCase().includes('completed') ||
      c.name.toLowerCase().includes('control')
    )?.cards.length || 0,
    inProgress: currentBoard.columns.find(c => 
      c.name.toLowerCase().includes('progress') || 
      c.name.toLowerCase().includes('doing')
    )?.cards.length || 0,
    critical: currentBoard.columns.reduce((acc, col) => 
      acc + col.cards.filter(c => c.priority === 'critical' || c.priority === 'high').length, 0
    ),
  } : { total: 0, done: 0, inProgress: 0, critical: 0 };

  const methodologyConfig = currentProject ? getMethodologyConfig(currentProject.methodology) : null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral dos seus projetos e métricas
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderKanban}
          label="Total de Cards"
          value={stats.total}
          color="primary"
        />
        <StatCard
          icon={CheckCircle2}
          label="Concluídos"
          value={stats.done}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Em Progresso"
          value={stats.inProgress}
          color="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="Alta Prioridade"
          value={stats.critical}
          color="orange"
        />
      </motion.div>

      {/* Current Project Info */}
      {currentProject && methodologyConfig && (
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{methodologyConfig.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{currentProject.name}</h2>
                  <span className="text-sm text-muted-foreground">{methodologyConfig.name}</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {methodologyConfig.description}
              </p>
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ 
                backgroundColor: `hsl(var(--${methodologyConfig.color}) / 0.15)`,
                color: `hsl(var(--${methodologyConfig.color}))`
              }}
            >
              {methodologyConfig.category}
            </div>
          </div>

          {/* Workflow Rules */}
          {currentProject.workflowRules.order && (
            <div className="mt-6 pt-6 border-t border-border/30">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Fluxo de Trabalho
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {currentProject.workflowRules.order.map((phase, index) => (
                  <div key={phase} className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm font-medium">
                      {phase}
                    </span>
                    {index < currentProject.workflowRules.order!.length - 1 && (
                      <span className="text-muted-foreground">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WIP Limits */}
          {currentProject.workflowRules.wipLimits && Object.keys(currentProject.workflowRules.wipLimits).length > 0 && (
            <div className="mt-6 pt-6 border-t border-border/30">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Limites WIP
              </h3>
              <div className="flex items-center gap-4 flex-wrap">
                {Object.entries(currentProject.workflowRules.wipLimits).map(([column, limit]) => (
                  <div key={column} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{column}:</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-sm font-semibold">
                      {limit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Projects List */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-foreground mb-4">Seus Projetos</h2>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const config = getMethodologyConfig(project.methodology);
              return (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "glass-card p-5 cursor-pointer transition-all",
                    currentProject?.id === project.id && "ring-2 ring-primary"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config?.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{config?.name}</p>
                      </div>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(var(--${config?.color}))` }}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.boards.length} boards</span>
                    <span>
                      {project.boards.reduce((acc: number, b) => 
                        acc + b.columns.reduce((a: number, c) => a + c.cards.length, 0), 0
                      )} cards
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Zap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum projeto ainda
            </h3>
            <p className="text-muted-foreground">
              Crie seu primeiro projeto clicando no botão + na barra lateral
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: 'primary' | 'green' | 'blue' | 'orange';
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-methodology-lean/10 text-methodology-lean',
    blue: 'bg-methodology-pmbok/10 text-methodology-pmbok',
    orange: 'bg-methodology-waterfall/10 text-methodology-waterfall',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between">
        <div className={cn("p-2.5 rounded-lg", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-3xl font-bold text-foreground">{value}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

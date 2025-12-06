import { MethodologyConfig } from '@/types/project';

export const methodologies: MethodologyConfig[] = [
  // Agile Methodologies
  {
    id: 'scrum',
    name: 'Scrum',
    description: 'Framework ágil com sprints, daily standups e retrospectivas',
    category: 'agile',
    color: 'methodology-scrum',
    icon: '🏃',
    defaultColumns: [
      { name: 'Backlog', order: 0 },
      { name: 'Sprint Backlog', order: 1 },
      { name: 'In Progress', order: 2, wipLimit: 3 },
      { name: 'Review', order: 3, wipLimit: 2 },
      { name: 'Done', order: 4 },
    ],
    workflowRules: {
      requiredFields: {
        'Done': ['storyPoints', 'assignee'],
      },
    },
  },
  {
    id: 'kanban',
    name: 'Kanban',
    description: 'Fluxo contínuo com limites WIP e visualização do trabalho',
    category: 'agile',
    color: 'methodology-kanban',
    icon: '📋',
    defaultColumns: [
      { name: 'To Do', order: 0 },
      { name: 'In Progress', order: 1, wipLimit: 4 },
      { name: 'Review', order: 2, wipLimit: 2 },
      { name: 'Done', order: 3 },
    ],
    workflowRules: {
      wipLimits: {
        'In Progress': 4,
        'Review': 2,
      },
    },
  },
  {
    id: 'scrumban',
    name: 'Scrumban',
    description: 'Combinação de Scrum e Kanban para maior flexibilidade',
    category: 'agile',
    color: 'methodology-scrum',
    icon: '🔄',
    defaultColumns: [
      { name: 'Backlog', order: 0 },
      { name: 'Ready', order: 1 },
      { name: 'In Progress', order: 2, wipLimit: 3 },
      { name: 'Review', order: 3, wipLimit: 2 },
      { name: 'Done', order: 4 },
    ],
    workflowRules: {
      wipLimits: {
        'In Progress': 3,
        'Review': 2,
      },
    },
  },
  // Lean Methodologies
  {
    id: 'dmaic',
    name: 'DMAIC (Lean Six Sigma)',
    description: 'Define, Measure, Analyze, Improve, Control - para melhoria de processos',
    category: 'lean',
    color: 'methodology-dmaic',
    icon: '📊',
    defaultColumns: [
      { name: 'DEFINE', order: 0 },
      { name: 'MEASURE', order: 1 },
      { name: 'ANALYZE', order: 2 },
      { name: 'IMPROVE', order: 3 },
      { name: 'CONTROL', order: 4 },
    ],
    workflowRules: {
      order: ['DEFINE', 'MEASURE', 'ANALYZE', 'IMPROVE', 'CONTROL'],
      blockedTransitions: [
        { from: 'DEFINE', to: 'ANALYZE' },
        { from: 'DEFINE', to: 'IMPROVE' },
        { from: 'DEFINE', to: 'CONTROL' },
        { from: 'MEASURE', to: 'IMPROVE' },
        { from: 'MEASURE', to: 'CONTROL' },
        { from: 'ANALYZE', to: 'CONTROL' },
      ],
    },
  },
  {
    id: 'lean',
    name: 'Lean',
    description: 'Eliminação de desperdícios e melhoria contínua',
    category: 'lean',
    color: 'methodology-lean',
    icon: '🎯',
    defaultColumns: [
      { name: 'Value Stream', order: 0 },
      { name: 'Pull', order: 1 },
      { name: 'Flow', order: 2 },
      { name: 'Perfection', order: 3 },
    ],
    workflowRules: {},
  },
  {
    id: 'kaizen',
    name: 'Kaizen',
    description: 'Melhoria contínua através de pequenas mudanças incrementais',
    category: 'lean',
    color: 'methodology-lean',
    icon: '🌱',
    defaultColumns: [
      { name: 'Identificar', order: 0 },
      { name: 'Planejar', order: 1 },
      { name: 'Implementar', order: 2 },
      { name: 'Verificar', order: 3 },
      { name: 'Padronizar', order: 4 },
    ],
    workflowRules: {},
  },
  // Traditional Methodologies
  {
    id: 'waterfall',
    name: 'Waterfall',
    description: 'Metodologia sequencial com fases bem definidas',
    category: 'traditional',
    color: 'methodology-waterfall',
    icon: '💧',
    defaultColumns: [
      { name: 'Requisitos', order: 0 },
      { name: 'Design', order: 1 },
      { name: 'Implementação', order: 2 },
      { name: 'Verificação', order: 3 },
      { name: 'Manutenção', order: 4 },
    ],
    workflowRules: {
      order: ['Requisitos', 'Design', 'Implementação', 'Verificação', 'Manutenção'],
      blockedTransitions: [
        { from: 'Requisitos', to: 'Implementação' },
        { from: 'Requisitos', to: 'Verificação' },
        { from: 'Requisitos', to: 'Manutenção' },
        { from: 'Design', to: 'Verificação' },
        { from: 'Design', to: 'Manutenção' },
        { from: 'Implementação', to: 'Manutenção' },
      ],
    },
  },
  {
    id: 'pmbok',
    name: 'PMBOK',
    description: 'Guia de boas práticas do PMI para gestão de projetos',
    category: 'traditional',
    color: 'methodology-pmbok',
    icon: '📘',
    defaultColumns: [
      { name: 'Iniciação', order: 0 },
      { name: 'Planejamento', order: 1 },
      { name: 'Execução', order: 2 },
      { name: 'Monitoramento', order: 3 },
      { name: 'Encerramento', order: 4 },
    ],
    workflowRules: {},
  },
  {
    id: 'prince2',
    name: 'PRINCE2',
    description: 'Metodologia estruturada com foco em controle e governança',
    category: 'traditional',
    color: 'methodology-prince2',
    icon: '👑',
    defaultColumns: [
      { name: 'Starting Up', order: 0 },
      { name: 'Initiating', order: 1 },
      { name: 'Directing', order: 2 },
      { name: 'Controlling', order: 3 },
      { name: 'Closing', order: 4 },
    ],
    workflowRules: {},
  },
  // Strategic Methodologies
  {
    id: 'okr',
    name: 'OKR',
    description: 'Objectives and Key Results para alinhamento estratégico',
    category: 'strategic',
    color: 'methodology-okr',
    icon: '🎯',
    defaultColumns: [
      { name: 'Objectives', order: 0 },
      { name: 'Key Results', order: 1 },
      { name: 'Initiatives', order: 2 },
      { name: 'Completed', order: 3 },
    ],
    workflowRules: {},
  },
  {
    id: 'bsc',
    name: 'Balanced Scorecard',
    description: 'Gestão estratégica com perspectivas financeiras e não-financeiras',
    category: 'strategic',
    color: 'methodology-okr',
    icon: '⚖️',
    defaultColumns: [
      { name: 'Financial', order: 0 },
      { name: 'Customer', order: 1 },
      { name: 'Internal Process', order: 2 },
      { name: 'Learning & Growth', order: 3 },
    ],
    workflowRules: {},
  },
];

export const getMethodologyConfig = (id: string): MethodologyConfig | undefined => {
  return methodologies.find(m => m.id === id);
};

export const getMethodologiesByCategory = (category: string): MethodologyConfig[] => {
  return methodologies.filter(m => m.category === category);
};

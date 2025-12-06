export type MethodologyType = 
  | 'scrum' 
  | 'kanban' 
  | 'scrumban' 
  | 'xp' 
  | 'safe' 
  | 'dmaic' 
  | 'dmadv' 
  | 'lean' 
  | 'kaizen' 
  | 'waterfall' 
  | 'pmbok' 
  | 'prince2' 
  | 'okr' 
  | 'bsc';

export type PriorityType = 'critical' | 'high' | 'medium' | 'low';

export type CardStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';

export interface Card {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority: PriorityType;
  status: CardStatus;
  tags?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  storyPoints?: number;
  columnId: string;
}

export interface Column {
  id: string;
  name: string;
  wipLimit?: number;
  color?: string;
  order: number;
  cards: Card[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRule {
  order?: string[];
  wipLimits?: Record<string, number>;
  blockedTransitions?: Array<{ from: string; to: string }>;
  requiredFields?: Record<string, string[]>;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  methodology: MethodologyType;
  boards: Board[];
  workflowRules: WorkflowRule;
  integrations?: {
    googleCalendar?: boolean;
    appleCalendar?: boolean;
    outlookCalendar?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExportedProject {
  version: string;
  exportedAt: string;
  project: Project;
}

export interface MethodologyConfig {
  id: MethodologyType;
  name: string;
  description: string;
  category: 'agile' | 'lean' | 'traditional' | 'strategic';
  defaultColumns: Omit<Column, 'id' | 'cards'>[];
  workflowRules: WorkflowRule;
  color: string;
  icon: string;
}

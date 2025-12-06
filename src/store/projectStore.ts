import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Project, Board, Column, Card, MethodologyType, PriorityType, ExportedProject } from '@/types/project';
import { getMethodologyConfig } from '@/config/methodologies';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentBoard: Board | null;
  
  // Project Actions
  createProject: (name: string, methodology: MethodologyType, description?: string) => Project;
  setCurrentProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  
  // Board Actions
  setCurrentBoard: (boardId: string) => void;
  createBoard: (name: string) => void;
  
  // Column Actions
  addColumn: (name: string, wipLimit?: number) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  
  // Card Actions
  addCard: (columnId: string, card: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'columnId'>) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => boolean;
  
  // Import/Export
  exportProject: () => ExportedProject | null;
  importProject: (data: ExportedProject, mode: 'merge' | 'overwrite') => boolean;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  currentBoard: null,

  createProject: (name, methodology, description) => {
    const config = getMethodologyConfig(methodology);
    if (!config) throw new Error(`Unknown methodology: ${methodology}`);

    const now = new Date().toISOString();
    const boardId = uuidv4();
    
    const columns: Column[] = config.defaultColumns.map((col, index) => ({
      id: uuidv4(),
      name: col.name,
      wipLimit: col.wipLimit,
      order: col.order ?? index,
      cards: [],
    }));

    const board: Board = {
      id: boardId,
      name: `${name} - Principal`,
      columns,
      createdAt: now,
      updatedAt: now,
    };

    const project: Project = {
      id: uuidv4(),
      name,
      description,
      methodology,
      boards: [board],
      workflowRules: config.workflowRules,
      createdAt: now,
      updatedAt: now,
    };

    set(state => ({
      projects: [...state.projects, project],
      currentProject: project,
      currentBoard: board,
    }));

    return project;
  },

  setCurrentProject: (projectId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (project) {
      set({
        currentProject: project,
        currentBoard: project.boards[0] || null,
      });
    }
  },

  deleteProject: (projectId) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== projectId),
      currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
      currentBoard: state.currentProject?.id === projectId ? null : state.currentBoard,
    }));
  },

  setCurrentBoard: (boardId) => {
    const project = get().currentProject;
    if (project) {
      const board = project.boards.find(b => b.id === boardId);
      if (board) {
        set({ currentBoard: board });
      }
    }
  },

  createBoard: (name) => {
    const project = get().currentProject;
    if (!project) return;

    const config = getMethodologyConfig(project.methodology);
    if (!config) return;

    const now = new Date().toISOString();
    const columns: Column[] = config.defaultColumns.map((col, index) => ({
      id: uuidv4(),
      name: col.name,
      wipLimit: col.wipLimit,
      order: col.order ?? index,
      cards: [],
    }));

    const newBoard: Board = {
      id: uuidv4(),
      name,
      columns,
      createdAt: now,
      updatedAt: now,
    };

    const updatedProject = {
      ...project,
      boards: [...project.boards, newBoard],
      updatedAt: now,
    };

    set(state => ({
      projects: state.projects.map(p => p.id === project.id ? updatedProject : p),
      currentProject: updatedProject,
      currentBoard: newBoard,
    }));
  },

  addColumn: (name, wipLimit) => {
    const { currentProject, currentBoard } = get();
    if (!currentProject || !currentBoard) return;

    const now = new Date().toISOString();
    const newColumn: Column = {
      id: uuidv4(),
      name,
      wipLimit,
      order: currentBoard.columns.length,
      cards: [],
    };

    const updatedBoard = {
      ...currentBoard,
      columns: [...currentBoard.columns, newColumn],
      updatedAt: now,
    };

    const updatedProject = {
      ...currentProject,
      boards: currentProject.boards.map(b => b.id === currentBoard.id ? updatedBoard : b),
      updatedAt: now,
    };

    set(state => ({
      projects: state.projects.map(p => p.id === currentProject.id ? updatedProject : p),
      currentProject: updatedProject,
      currentBoard: updatedBoard,
    }));
  },

  updateColumn: (columnId, updates) => {
    const { currentProject, currentBoard } = get();
    if (!currentProject || !currentBoard) return;

    const now = new Date().toISOString();
    const updatedBoard = {
      ...currentBoard,
      columns: currentBoard.columns.map(col =>
        col.id === columnId ? { ...col, ...updates } : col
      ),
      updatedAt: now,
    };

    const updatedProject = {
      ...currentProject,
      boards: currentProject.boards.map(b => b.id === currentBoard.id ? updatedBoard : b),
      updatedAt: now,
    };

    set(state => ({
      projects: state.projects.map(p => p.id === currentProject.id ? updatedProject : p),
      currentProject: updatedProject,
      currentBoard: updatedBoard,
    }));
  },

  deleteColumn: (columnId) => {
    const { currentProject, currentBoard } = get();
    if (!currentProject || !currentBoard) return;

    const now = new Date().toISOString();
    const updatedBoard = {
      ...currentBoard,
      columns: currentBoard.columns.filter(col => col.id !== columnId),
      updatedAt: now,
    };

    const updatedProject = {
      ...currentProject,
      boards: currentProject.boards.map(b => b.id === currentBoard.id ? updatedBoard : b),
      updatedAt: now,
    };

    set(state => ({
      projects: state.projects.map(p => p.id === currentProject.id ? updatedProject : p),
      currentProject: updatedProject,
      currentBoard: updatedBoard,
    }));
  },

  addCard: (columnId, cardData) => {
    const { currentProject, currentBoard } = get();
    if (!currentProject || !currentBoard) return;

    const now = new Date().toISOString();
    const newCard: Card = {
      ...cardData,
      id: uuidv4(),
      columnId,
      createdAt: now,
      updatedAt: now,
    };

    const updatedBoard = {
      ...currentBoard,
      columns: currentBoard.columns.map(col =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      ),
      updatedAt: now,
    };

    const updatedProject = {
      ...currentProject,
      boards: currentProject.boards.map(b => b.id === currentBoard.id ? updatedBoard : b),
      updatedAt: now,
    };

    set(state => ({
      projects: state.projects.map(p => p.id === currentProject.id ? updatedProject : p),
      currentProject: updatedProject,
      currentBoard: updatedBoard,
    }));
  },

  updateCard: (cardId, updates) => {
    const { currentProject, currentBoard } = get();
    if (!currentProject || !currentBoard) return;

    const now = new Date().toISOString();
    const updatedBoard = {
      ...currentBoard,
      columns: currentBoard.columns.map(col => ({
        ...col,
        cards: col.cards.map(card =>
          card.id === cardId ? { ...card, ...updates, updatedAt: now } : card
        ),
      })),
      updatedAt: now,
    };

    const updatedProject = {
      ...currentProject,
      boards: currentProject.boards.map(b => b.id === currentBoard.id ? updatedBoard : b),
      updatedAt: now,
    };

    set(state => ({
      projects: state.projects.map(p => p.id === currentProject.id ? updatedProject : p),
      currentProject: updatedProject,
      currentBoard: updatedBoard,
    }));
  },

  deleteCard: (cardId) => {
    const { currentProject, currentBoard } = get();
    if (!currentProject || !currentBoard) return;

    const now = new Date().toISOString();
    const updatedBoard = {
      ...currentBoard,
      columns: currentBoard.columns.map(col => ({
        ...col,
        cards: col.cards.filter(card => card.id !== cardId),
      })),
      updatedAt: now,
    };

    const updatedProject = {
      ...currentProject,
      boards: currentProject.boards.map(b => b.id === currentBoard.id ? updatedBoard : b),
      updatedAt: now,
    };

    set(state => ({
      projects: state.projects.map(p => p.id === currentProject.id ? updatedProject : p),
      currentProject: updatedProject,
      currentBoard: updatedBoard,
    }));
  },

  moveCard: (cardId, fromColumnId, toColumnId, newIndex) => {
    const { currentProject, currentBoard } = get();
    if (!currentProject || !currentBoard) return false;

    // Find the card
    const fromColumn = currentBoard.columns.find(col => col.id === fromColumnId);
    const toColumn = currentBoard.columns.find(col => col.id === toColumnId);
    if (!fromColumn || !toColumn) return false;

    const card = fromColumn.cards.find(c => c.id === cardId);
    if (!card) return false;

    // Check WIP limit
    if (fromColumnId !== toColumnId && toColumn.wipLimit) {
      if (toColumn.cards.length >= toColumn.wipLimit) {
        return false; // WIP limit exceeded
      }
    }

    // Check workflow rules (blocked transitions)
    const blockedTransitions = currentProject.workflowRules.blockedTransitions || [];
    const isBlocked = blockedTransitions.some(
      rule => rule.from === fromColumn.name && rule.to === toColumn.name
    );
    if (isBlocked) return false;

    const now = new Date().toISOString();
    
    // Remove card from source column
    const newFromCards = fromColumn.cards.filter(c => c.id !== cardId);
    
    // Add card to destination column
    const newToCards = [...toColumn.cards];
    const updatedCard = { ...card, columnId: toColumnId, updatedAt: now };
    newToCards.splice(newIndex, 0, updatedCard);

    const updatedBoard = {
      ...currentBoard,
      columns: currentBoard.columns.map(col => {
        if (col.id === fromColumnId) {
          return { ...col, cards: newFromCards };
        }
        if (col.id === toColumnId) {
          return { ...col, cards: newToCards };
        }
        return col;
      }),
      updatedAt: now,
    };

    const updatedProject = {
      ...currentProject,
      boards: currentProject.boards.map(b => b.id === currentBoard.id ? updatedBoard : b),
      updatedAt: now,
    };

    set(state => ({
      projects: state.projects.map(p => p.id === currentProject.id ? updatedProject : p),
      currentProject: updatedProject,
      currentBoard: updatedBoard,
    }));

    return true;
  },

  exportProject: () => {
    const project = get().currentProject;
    if (!project) return null;

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      project,
    };
  },

  importProject: (data, mode) => {
    try {
      if (data.version !== '1.0') {
        console.error('Unsupported version');
        return false;
      }

      const importedProject = data.project;
      
      if (mode === 'overwrite') {
        set(state => ({
          projects: state.projects.filter(p => p.id !== importedProject.id).concat(importedProject),
          currentProject: importedProject,
          currentBoard: importedProject.boards[0] || null,
        }));
      } else {
        // Merge mode - generate new IDs
        const newProjectId = uuidv4();
        const newProject = {
          ...importedProject,
          id: newProjectId,
          name: `${importedProject.name} (Imported)`,
          boards: importedProject.boards.map(board => ({
            ...board,
            id: uuidv4(),
            columns: board.columns.map(col => ({
              ...col,
              id: uuidv4(),
              cards: col.cards.map(card => ({
                ...card,
                id: uuidv4(),
              })),
            })),
          })),
        };

        set(state => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
          currentBoard: newProject.boards[0] || null,
        }));
      }

      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  },
}));

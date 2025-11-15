import { create } from 'zustand';
import { sessionService } from '../services/sessionService';
import { 
  type Session, 
  type CreateSessionRequest, 
  type UpdateSessionRequest, 
  type GetSessionsParams,
  type SessionFilters 
} from '../types/session';
import { type PaginationMeta } from '../types/pagination';

interface SessionState {
  sessions: Session[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  filters: SessionFilters;
  selectedSession: Session | null;
}

interface SessionActions {
  // Data fetching
  fetchSessions: (params?: GetSessionsParams) => Promise<void>;
  fetchSessionById: (id: string) => Promise<void>;
  
  // CRUD operations
  createSession: (sessionData: CreateSessionRequest) => Promise<void>;
  updateSession: (id: string, sessionData: UpdateSessionRequest) => Promise<void>;
  cancelSession: (id: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  
  // Session operations
  startSession: (id: string) => Promise<void>;
  completeSession: (id: string) => Promise<void>;
  uploadPhoto: (sessionId: string, file: File, caption?: string) => Promise<void>;
  clearSessionFromPhotobooth: (photoboothId: string) => Promise<void>;
  startCapture: (sessionId: string) => Promise<void>;
  
  
  // Filters and UI
  setFilters: (filters: Partial<SessionFilters>) => void;
  clearFilters: () => void;
  setSelectedSession: (session: Session | null) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>((set) => ({
  // Initial state
  sessions: [],
  pagination: null,
  loading: false,
  error: null,
  filters: {},
  selectedSession: null,

  // Actions
  fetchSessions: async (params?: GetSessionsParams) => {
    set({ loading: true, error: null });
    try {
      const response = await sessionService.getAllSessions(params);
      set({ 
        sessions: response.data, 
        pagination: response.meta,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch sessions',
        loading: false 
      });
    }
  },

  fetchSessionById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const session = await sessionService.getSessionById(id);
      set({ selectedSession: session, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch session',
        loading: false 
      });
    }
  },

  createSession: async (sessionData: CreateSessionRequest) => {
    set({ loading: true, error: null });
    try {
      const newSession = await sessionService.createSession(sessionData);
      set(state => ({ 
        sessions: [newSession, ...state.sessions],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create session',
        loading: false 
      });
      throw error;
    }
  },

  updateSession: async (id: string, sessionData: UpdateSessionRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedSession = await sessionService.updateSession(id, sessionData);
      set(state => ({
        sessions: state.sessions.map(s => s.id === id ? updatedSession : s),
        selectedSession: state.selectedSession?.id === id ? updatedSession : state.selectedSession,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update session',
        loading: false 
      });
      throw error;
    }
  },

  cancelSession: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const cancelledSession = await sessionService.cancelSession(id);
      set(state => ({
        sessions: state.sessions.map(s => s.id === id ? cancelledSession : s),
        selectedSession: state.selectedSession?.id === id ? cancelledSession : state.selectedSession,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel session',
        loading: false 
      });
      throw error;
    }
  },

  deleteSession: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await sessionService.deleteSession(id);
      set(state => ({
        sessions: state.sessions.filter(s => s.id !== id),
        selectedSession: state.selectedSession?.id === id ? null : state.selectedSession,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete session',
        loading: false 
      });
      throw error;
    }
  },

  startSession: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedSession = await sessionService.startSession(id);
      set(state => ({
        sessions: state.sessions.map(s => s.id === id ? updatedSession : s),
        selectedSession: state.selectedSession?.id === id ? updatedSession : state.selectedSession,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start session',
        loading: false 
      });
      throw error;
    }
  },

  completeSession: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedSession = await sessionService.completeSession(id);
      set(state => ({
        sessions: state.sessions.map(s => s.id === id ? updatedSession : s),
        selectedSession: state.selectedSession?.id === id ? updatedSession : state.selectedSession,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to complete session',
        loading: false 
      });
      throw error;
    }
  },

  uploadPhoto: async (sessionId: string, file: File, caption?: string) => {
    set({ loading: true, error: null });
    try {
      const newPhoto = await sessionService.uploadPhoto(sessionId, file, caption);
      set(state => ({
        sessions: state.sessions.map(session => 
          session.id === sessionId 
            ? { 
                ...session, 
                photos: [...session.photos, newPhoto],
                photoCount: session.photoCount + 1
              }
            : session
        ),
        selectedSession: state.selectedSession?.id === sessionId 
          ? {
              ...state.selectedSession,
              photos: [...state.selectedSession.photos, newPhoto],
              photoCount: state.selectedSession.photoCount + 1
            }
          : state.selectedSession,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload photo',
        loading: false 
      });
      throw error;
    }
  },

  clearSessionFromPhotobooth: async (photoboothId: string) => {
    set({ loading: true, error: null });
    try {
      const clearedSession = await sessionService.clearSessionFromPhotobooth(photoboothId);
      set(state => ({
        sessions: state.sessions.map(s => s.id === clearedSession.id ? clearedSession : s),
        selectedSession: state.selectedSession?.id === clearedSession.id ? clearedSession : state.selectedSession,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear session from photobooth',
        loading: false 
      });
      throw error;
    }
  },

  startCapture: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      await sessionService.startCapture(sessionId);
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start capture',
        loading: false 
      });
      throw error;
    }
  },

  setFilters: (filters: Partial<SessionFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  setSelectedSession: (session: Session | null) => {
    set({ selectedSession: session });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

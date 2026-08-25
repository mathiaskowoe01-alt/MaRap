import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Task, Category, Reminder, SyncLog } from './types';
import { DEFAULT_CATEGORIES } from './defaults';

// --- SUPABASE CLIENT CONFIGURATION ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- APP STATE INTERFACE ---
export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface SyncHistoryItem {
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface AppState {
  tasks: Task[];
  categories: Category[];
  reminders: Reminder[];
  syncLogs: SyncLog[];
  networkStatus: 'online' | 'offline';
  syncing: boolean;
  currentUserId: string;
  currentTab: 'today' | 'tasks' | 'calendar' | 'reminders' | 'settings';
  dailyNote: string;
  toasts: ToastMessage[];
  syncHistory: SyncHistoryItem[];
}

// --- LOCAL STORAGE RECOVERY OR INITIAL STATE ---
const loadLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error loading localStorage key: ${key}`, e);
    return defaultValue;
  }
};

const initialUserId = 'user-default';
const initialCategories = loadLocalStorage<Category[]>('marap_categories', DEFAULT_CATEGORIES);
const initialTasks = loadLocalStorage<Task[]>('marap_tasks', []);
const initialReminders = loadLocalStorage<Reminder[]>('marap_reminders', []);
const initialSyncLogs = loadLocalStorage<SyncLog[]>('marap_sync_logs', []);
const initialDailyNote = localStorage.getItem('marap_daily_note') || "Prendre du temps pour planifier ses objectifs aujourd'hui.";
const initialSyncHistory = loadLocalStorage<SyncHistoryItem[]>('marap_sync_history', []);

let state: AppState = {
  tasks: initialTasks,
  categories: initialCategories,
  reminders: initialReminders,
  syncLogs: initialSyncLogs,
  networkStatus: 'online',
  syncing: false,
  currentUserId: initialUserId,
  currentTab: 'today',
  dailyNote: initialDailyNote,
  toasts: [],
  syncHistory: initialSyncHistory
};

// --- EMITTER SYSTEM FOR REACTIVITY ---
const listeners = new Set<() => void>();

const updateState = (updates: Partial<AppState>) => {
  state = { ...state, ...updates };
  
  // Persist key variables
  if (updates.tasks !== undefined) localStorage.setItem('marap_tasks', JSON.stringify(state.tasks));
  if (updates.categories !== undefined) localStorage.setItem('marap_categories', JSON.stringify(state.categories));
  if (updates.reminders !== undefined) localStorage.setItem('marap_reminders', JSON.stringify(state.reminders));
  if (updates.syncLogs !== undefined) localStorage.setItem('marap_sync_logs', JSON.stringify(state.syncLogs));
  if (updates.dailyNote !== undefined) localStorage.setItem('marap_daily_note', state.dailyNote);
  if (updates.syncHistory !== undefined) localStorage.setItem('marap_sync_history', JSON.stringify(state.syncHistory));

  listeners.forEach(listener => listener());
};

// --- SYNCHRONIZATION ALGORITHMS (OFFLINE-FIRST) ---
const pushSyncLog = (entityType: 'task' | 'category' | 'reminder', entityId: string, action: 'create' | 'update' | 'delete') => {
  const newLog: SyncLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    user_id: state.currentUserId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    client_timestamp: new Date().toISOString(),
    synced_at: null,
    device_id: 'browser-simulation'
  };
  updateState({ syncLogs: [newLog, ...state.syncLogs] });
  
  // Proactively attempt sync if online
  if (state.networkStatus === 'online') {
    triggerSync();
  }
};

export const triggerSync = async () => {
  if (state.syncing) return;
  if (state.networkStatus === 'offline') {
    addToast('Synchronisation impossible', 'L\'application est actuellement hors-ligne.', 'warning');
    return;
  }

  const unsyncedLogs = state.syncLogs.filter(log => log.synced_at === null);
  if (unsyncedLogs.length === 0) return;

  updateState({ syncing: true });

  const updatedLogs = [...state.syncLogs];
  const historyUpdates = [...state.syncHistory];
  let successCount = 0;
  let failed = false;
  let lastErrorMessage = '';

  // Process from oldest to newest
  const sortedLogs = [...unsyncedLogs].reverse();

  for (const log of sortedLogs) {
    try {
      if (log.entity_type === 'task') {
        if (log.action === 'create' || log.action === 'update') {
          const task = state.tasks.find(t => t.id === log.entity_id);
          if (task) {
            const { error } = await supabase.from('tasks').upsert({
              id: task.id,
              user_id: task.user_id,
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              due_date: task.due_date,
              due_time: task.due_time,
              category_id: task.category_id || null,
              is_all_day: task.is_all_day,
              recurrence_rule: task.recurrence_rule || null,
              created_at: task.created_at,
              updated_at: task.updated_at
            });
            if (error) throw error;
          }
        } else if (log.action === 'delete') {
          const { error } = await supabase.from('tasks').delete().eq('id', log.entity_id);
          if (error) throw error;
        }
      } else if (log.entity_type === 'category') {
        if (log.action === 'create' || log.action === 'update') {
          const category = state.categories.find(c => c.id === log.entity_id);
          if (category) {
            const { error } = await supabase.from('categories').upsert({
              id: category.id,
              user_id: category.user_id,
              name: category.name,
              color: category.color,
              icon: category.icon
            });
            if (error) throw error;
          }
        } else if (log.action === 'delete') {
          const { error } = await supabase.from('categories').delete().eq('id', log.entity_id);
          if (error) throw error;
        }
      } else if (log.entity_type === 'reminder') {
        if (log.action === 'create' || log.action === 'update') {
          const reminder = state.reminders.find(r => r.id === log.entity_id);
          if (reminder) {
            const { error } = await supabase.from('reminders').upsert({
              id: reminder.id,
              task_id: reminder.task_id,
              remind_at: reminder.remind_at,
              type: reminder.type,
              recurrence_rule: reminder.recurrence_rule || null,
              notification_id_local: reminder.notification_id_local,
              status: reminder.status
            });
            if (error) throw error;
          }
        } else if (log.action === 'delete') {
          const { error } = await supabase.from('reminders').delete().eq('id', log.entity_id);
          if (error) throw error;
        }
      }

      // Mark log as synced in our local state
      const logIdx = updatedLogs.findIndex(l => l.id === log.id);
      if (logIdx !== -1) {
        updatedLogs[logIdx] = { ...updatedLogs[logIdx], synced_at: new Date().toISOString() };
      }
      successCount++;
    } catch (err: any) {
      failed = true;
      lastErrorMessage = err.message || JSON.stringify(err);
      console.warn(`Sync failed for log ${log.id}:`, err);
      break; // Stop sync train on error
    }
  }

  // Update sync history logs
  const logTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (failed) {
    let readableMsg = lastErrorMessage;
    if (lastErrorMessage.includes('relation') && lastErrorMessage.includes('does not exist')) {
      readableMsg = "Tables manquantes sur Supabase (tasks, categories, reminders). Mode local-first actif.";
    }
    historyUpdates.unshift({
      timestamp: logTime,
      status: 'warning',
      message: `Sync partielle : ${successCount} éléments synchronisés. Erreur : ${readableMsg}`
    });
    addToast('Avertissement de synchronisation', 'Certains éléments restent en local (tables Supabase manquantes).', 'warning');
  } else if (successCount > 0) {
    historyUpdates.unshift({
      timestamp: logTime,
      status: 'success',
      message: `Synchronisation réussie de ${successCount} éléments vers Supabase.`
    });
    addToast('Synchronisation complétée', `${successCount} modifications synchronisées avec succès.`, 'success');
  }

  // Cap history at 15 items
  if (historyUpdates.length > 15) {
    historyUpdates.length = 15;
  }

  updateState({
    syncLogs: updatedLogs,
    syncing: false,
    syncHistory: historyUpdates
  });
};

// --- NOTIFICATION & TOAST TRIGGERS ---
export const addToast = (title: string, description: string, type: ToastMessage['type'] = 'info') => {
  const newToast: ToastMessage = {
    id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title,
    description,
    type
  };
  updateState({ toasts: [...state.toasts, newToast] });

  // Auto remove toast after 4.5 seconds
  setTimeout(() => {
    removeToast(newToast.id);
  }, 4500);

  // Trigger Native Web Notification if supported
  if (Notification.permission === 'granted' && type !== 'info') {
    try {
      new Notification(title, { body: description });
    } catch (e) {
      console.warn("Could not display native notification", e);
    }
  }
};

export const removeToast = (id: string) => {
  updateState({ toasts: state.toasts.filter(t => t.id !== id) });
};

// --- ACTIONS METIER ---
export const actions = {
  // Tasks CRUD
  addTask: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>, reminderTime?: string) => {
    const taskId = `task-${Date.now()}`;
    const nowStr = new Date().toISOString();
    
    const newTask: Task = {
      ...taskData,
      id: taskId,
      user_id: state.currentUserId,
      created_at: nowStr,
      updated_at: nowStr
    };

    updateState({ tasks: [newTask, ...state.tasks] });
    pushSyncLog('task', taskId, 'create');

    // Create associated reminder if provided
    if (reminderTime) {
      const remindDateTime = `${taskData.due_date}T${reminderTime}:00`;
      actions.addReminder(taskId, remindDateTime, taskData.recurrence_rule);
    }

    addToast('Tâche créée', `"${newTask.title}" a bien été planifiée.`, 'success');
    return taskId;
  },

  updateTask: (taskId: string, taskUpdates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>, reminderTime?: string) => {
    const updatedTasks = state.tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          ...taskUpdates,
          updated_at: new Date().toISOString()
        };
      }
      return t;
    });

    updateState({ tasks: updatedTasks });
    pushSyncLog('task', taskId, 'update');

    // Handle reminders updates
    if (reminderTime !== undefined) {
      // Find existing reminder for task
      const existingReminder = state.reminders.find(r => r.task_id === taskId);
      const targetDate = taskUpdates.due_date || state.tasks.find(t => t.id === taskId)?.due_date;
      
      if (reminderTime && targetDate) {
        const remindDateTime = `${targetDate}T${reminderTime}:00`;
        if (existingReminder) {
          actions.updateReminder(existingReminder.id, remindDateTime, taskUpdates.recurrence_rule);
        } else {
          actions.addReminder(taskId, remindDateTime, taskUpdates.recurrence_rule);
        }
      } else if (!reminderTime && existingReminder) {
        // Cancel reminder if removed
        actions.deleteReminder(existingReminder.id);
      }
    }

    addToast('Tâche modifiée', 'La tâche a été mise à jour.', 'info');
  },

  deleteTask: (taskId: string) => {
    const taskToDelete = state.tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    // Delete associated reminders first
    const associatedReminders = state.reminders.filter(r => r.task_id === taskId);
    associatedReminders.forEach(r => {
      actions.deleteReminder(r.id);
    });

    updateState({ tasks: state.tasks.filter(t => t.id !== taskId) });
    pushSyncLog('task', taskId, 'delete');
    
    addToast('Tâche supprimée', `"${taskToDelete.title}" a été retirée.`, 'info');
  },

  toggleTaskStatus: (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newStatus = task.status === 'termine' ? 'a_faire' : 'termine';
    actions.updateTask(taskId, { status: newStatus });

    if (newStatus === 'termine') {
      addToast('Tâche terminée ! 🎉', `Bien joué pour "${task.title}".`, 'success');
      // Trigger confetti micro-interaction if library is present
      try {
        if ((window as any).confetti) {
          (window as any).confetti({
            particleCount: 80,
            spread: 50,
            origin: { y: 0.8 }
          });
        }
      } catch (e) {
        console.log('Confetti failed to launch', e);
      }
    }
  },

  // Categories Actions
  addCategory: (name: string, color: string, icon: string) => {
    const catId = `cat-${Date.now()}`;
    const newCat: Category = {
      id: catId,
      user_id: state.currentUserId,
      name,
      color,
      icon
    };
    updateState({ categories: [...state.categories, newCat] });
    pushSyncLog('category', catId, 'create');
    addToast('Catégorie ajoutée', `Catégorie "${name}" créée.`, 'success');
  },

  deleteCategory: (catId: string) => {
    // Prevent deleting core system categories
    if (catId.startsWith('cat-work') || catId.startsWith('cat-personal')) {
      addToast('Action impossible', 'Les catégories système ne peuvent pas être supprimées.', 'error');
      return;
    }

    const cat = state.categories.find(c => c.id === catId);
    if (!cat) return;

    // Unset category on tasks that had it
    const updatedTasks = state.tasks.map(t => {
      if (t.category_id === catId) {
        return { ...t, category_id: undefined, updated_at: new Date().toISOString() };
      }
      return t;
    });

    updateState({
      categories: state.categories.filter(c => c.id !== catId),
      tasks: updatedTasks
    });
    
    pushSyncLog('category', catId, 'delete');
    addToast('Catégorie supprimée', `La catégorie "${cat.name}" a été supprimée.`, 'info');
  },

  // Reminders Actions
  addReminder: (taskId: string, remindAt: string, recurrenceRule?: string) => {
    const reminderId = `remind-${Date.now()}`;
    
    const newReminder: Reminder = {
      id: reminderId,
      task_id: taskId,
      remind_at: remindAt,
      type: recurrenceRule ? 'recurrent' : 'unique',
      recurrence_rule: recurrenceRule,
      notification_id_local: `timer-${Date.now()}`,
      status: 'programme'
    };

    updateState({ reminders: [...state.reminders, newReminder] });
    pushSyncLog('reminder', reminderId, 'create');
  },

  updateReminder: (reminderId: string, remindAt: string, recurrenceRule?: string) => {
    const updatedReminders = state.reminders.map(r => {
      if (r.id === reminderId) {
        return {
          ...r,
          remind_at: remindAt,
          type: recurrenceRule ? ('recurrent' as const) : ('unique' as const),
          recurrence_rule: recurrenceRule,
          status: 'programme' as const // Reset trigger status to programmed
        };
      }
      return r;
    });

    updateState({ reminders: updatedReminders });
    pushSyncLog('reminder', reminderId, 'update');
  },

  deleteReminder: (reminderId: string) => {
    updateState({ reminders: state.reminders.filter(r => r.id !== reminderId) });
    pushSyncLog('reminder', reminderId, 'delete');
  },

  // General App settings
  setNetworkStatus: (status: 'online' | 'offline') => {
    updateState({ networkStatus: status });
    addToast(
      status === 'online' ? 'Connexion rétablie' : 'Mode Hors-ligne activé',
      status === 'online' ? 'L\'application se synchronise à Supabase.' : 'Les modifications seront stockées en local.',
      status === 'online' ? 'success' : 'info'
    );
    if (status === 'online') {
      triggerSync();
    }
  },

  setCurrentTab: (tab: AppState['currentTab']) => {
    updateState({ currentTab: tab });
  },

  updateDailyNote: (note: string) => {
    updateState({ dailyNote: note });
  },

  clearDatabase: () => {
    localStorage.clear();
    updateState({
      tasks: [],
      categories: DEFAULT_CATEGORIES,
      reminders: [],
      syncLogs: [],
      dailyNote: "Prendre du temps pour planifier ses objectifs aujourd'hui.",
      syncHistory: [{
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        status: 'info',
        message: 'Base de données réinitialisée.'
      }]
    });
    addToast('Base réinitialisée', 'Toutes les données locales ont été nettoyées.', 'info');
  },

  removeToast: (id: string) => {
    removeToast(id);
  }
};

// --- REACTIVE HOOK STORE ---
export const useStore = (): [AppState, typeof actions] => {
  const [s, setS] = useState<AppState>(state);

  useEffect(() => {
    const l = () => setS({ ...state });
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return [s, actions];
};

// --- BACKGROUND DAEMON FOR MOCK PUSH REMINDERS ---
if (typeof window !== 'undefined') {
  // Request notifications permissions on startup
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Periodic checker (every 3 seconds)
  setInterval(() => {
    const now = new Date();
    let updatedReminders = [...state.reminders];
    let stateChanged = false;

    state.reminders.forEach((reminder, index) => {
      // If reminder is programmed and time has passed
      if (reminder.status === 'programme') {
        const remindTime = new Date(reminder.remind_at);
        if (remindTime <= now) {
          // Find associated task
          const task = state.tasks.find(t => t.id === reminder.task_id);
          
          if (task && task.status !== 'termine') {
            // Trigger visual alert
            addToast(
              `Rappel : ${task.title}`,
              task.description || 'Il est l\'heure de s\'en occuper !',
              task.priority === 'haute' ? 'error' : task.priority === 'normale' ? 'warning' : 'info'
            );
            
            // Mark reminder as triggered (envoye)
            updatedReminders[index] = { ...reminder, status: 'envoye' };
            stateChanged = true;
            pushSyncLog('reminder', reminder.id, 'update');
          } else {
            // Task is completed or deleted, silently complete the reminder
            updatedReminders[index] = { ...reminder, status: 'complete' };
            stateChanged = true;
          }
        }
      }
    });

    if (stateChanged) {
      updateState({ reminders: updatedReminders });
    }
  }, 3000);
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string; // CSS color string or hex code
  icon: string;  // Name of Lucide icon to render
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'a_faire' | 'en_cours' | 'termine';
  priority: 'basse' | 'normale' | 'haute';
  due_date: string;       // Format YYYY-MM-DD
  due_time: string;       // Format HH:MM or empty string
  category_id?: string;
  is_all_day: boolean;
  recurrence_rule?: string; // Format RRULE (e.g. FREQ=DAILY, etc.)
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  task_id: string;
  remind_at: string; // ISO date string (YYYY-MM-DDTHH:MM:SS.SSSZ)
  type: 'unique' | 'recurrent';
  recurrence_rule?: string;
  notification_id_local: string; // browser timeout ID or mock native push ID
  status: 'programme' | 'envoye' | 'annule' | 'complete';
}

export interface SyncLog {
  id: string;
  user_id: string;
  entity_type: 'task' | 'category' | 'reminder';
  entity_id: string;
  action: 'create' | 'update' | 'delete';
  client_timestamp: string;
  synced_at: string | null; // null if not synced
  device_id: string;
}

import React, { useState, useEffect } from 'react';
import { useStore } from '../../db/store';
import { X, Calendar, Clock, Bell, ChevronDown, Check } from 'lucide-react';
import type { Task } from '../../db/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const [store, storeActions] = useStore();

  // Form fields state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPriority, setFormPriority] = useState<'basse' | 'normale' | 'haute'>('normale');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [formRecurrence, setFormRecurrence] = useState<string>('none');
  
  // Custom dropdown open state
  const [isRecurrenceDropdownOpen, setIsRecurrenceDropdownOpen] = useState(false);

  // Recurrence options mapping
  const RECURRENCE_OPTIONS = [
    { value: 'none', label: 'Tâche unique (Aucune récurrence)' },
    { value: 'daily', label: 'Toutes les journées (Quotidien)' },
    { value: 'weekly', label: 'Toutes les semaines (Hebdomadaire)' },
    { value: 'monthly', label: 'Tous les mois (Mensuel)' }
  ];

  const getRecurrenceLabel = (val: string) => {
    return RECURRENCE_OPTIONS.find(opt => opt.value === val)?.label || 'Sélectionner...';
  };

  // Populate fields when editing or reset when creating
  useEffect(() => {
    if (isOpen) {
      setIsRecurrenceDropdownOpen(false); // Close dropdown initially
      if (taskToEdit) {
        setFormTitle(taskToEdit.title);
        setFormDesc(taskToEdit.description);
        setFormCategory(taskToEdit.category_id || '');
        setFormPriority(taskToEdit.priority);
        setFormDate(taskToEdit.due_date);
        setFormTime(taskToEdit.due_time);

        // Find existing reminder
        const reminder = store.reminders.find(r => r.task_id === taskToEdit.id);
        if (reminder) {
          setHasReminder(true);
          const remindTimeStr = new Date(reminder.remind_at).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }).replace('h', ':');
          setReminderTime(remindTimeStr);
        } else {
          setHasReminder(false);
          setReminderTime('');
        }

        // Parse recurrence
        if (taskToEdit.recurrence_rule === 'FREQ=DAILY') setFormRecurrence('daily');
        else if (taskToEdit.recurrence_rule === 'FREQ=WEEKLY') setFormRecurrence('weekly');
        else if (taskToEdit.recurrence_rule === 'FREQ=MONTHLY') setFormRecurrence('monthly');
        else setFormRecurrence('none');
      } else {
        // Reset to default creation state
        setFormTitle('');
        setFormDesc('');
        setFormCategory(store.categories[0]?.id || '');
        setFormPriority('normale');
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setFormDate(todayStr);
        setFormTime('');
        setHasReminder(false);
        setReminderTime('');
        setFormRecurrence('none');
      }
    }
  }, [isOpen, taskToEdit, store.categories]);

  // Form handle save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let rrule: string | undefined = undefined;
    if (formRecurrence === 'daily') rrule = 'FREQ=DAILY';
    else if (formRecurrence === 'weekly') rrule = 'FREQ=WEEKLY';
    else if (formRecurrence === 'monthly') rrule = 'FREQ=MONTHLY';

    const taskData = {
      title: formTitle,
      description: formDesc,
      status: taskToEdit ? taskToEdit.status : 'a_faire' as const,
      priority: formPriority,
      due_date: formDate,
      due_time: formTime,
      category_id: formCategory || undefined,
      is_all_day: !formTime,
      recurrence_rule: rrule
    };

    const finalReminderTime = hasReminder ? reminderTime : undefined;

    if (taskToEdit) {
      storeActions.updateTask(taskToEdit.id, taskData, finalReminderTime);
    } else {
      storeActions.addTask(taskData, finalReminderTime);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
            {taskToEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder=" "
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />
            <label className="input-label">Titre de la tâche</label>
          </div>

          <div className="input-group">
            <textarea
              className="input-field"
              placeholder=" "
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              style={{ height: '70px', resize: 'none' }}
            />
            <label className="input-label">Description (optionnelle)</label>
          </div>

          {/* Category Selector Grid */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Catégorie
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {store.categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormCategory(cat.id)}
                  style={{
                    padding: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: formCategory === cat.id ? cat.color : 'var(--border-color)',
                    backgroundColor: formCategory === cat.id ? `${cat.color}15` : 'transparent',
                    color: formCategory === cat.id ? cat.color : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span className="category-dot" style={{ backgroundColor: cat.color }}></span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Segmented Control */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Priorité
            </span>
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', padding: '2px', border: '1px solid var(--border-color)' }}>
              {(['basse', 'normale', 'haute'] as const).map(prio => (
                <button
                  key={prio}
                  type="button"
                  onClick={() => setFormPriority(prio)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    backgroundColor: formPriority === prio ? 'var(--bg-card)' : 'transparent',
                    color: formPriority === prio 
                      ? (prio === 'haute' ? 'var(--error)' : prio === 'normale' ? 'var(--warning)' : 'var(--text-secondary)')
                      : 'var(--text-secondary)',
                    boxShadow: formPriority === prio ? 'var(--shadow-sm)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Échéance
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Heure
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 32px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Clock size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              </div>
            </div>
          </div>

          {/* Reminder Card Switch */}
          <div className="card" style={{ padding: '12px 16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} style={{ color: hasReminder ? 'var(--accent)' : 'var(--text-secondary)' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Rappel de notification</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={hasReminder} 
                  onChange={(e) => {
                    setHasReminder(e.target.checked);
                    if (e.target.checked && !reminderTime) {
                      setReminderTime(formTime || '09:00');
                    }
                  }}
                />
                <span className="slider"></span>
              </label>
            </div>

            {hasReminder && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', animation: 'fadeIn var(--transition-fast)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>M'avertir à :</span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  required={hasReminder}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Custom Modern Dropdown Selector for Recurrence */}
          <div style={{ marginBottom: '28px', position: 'relative' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Récurrence de tâche
            </label>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsRecurrenceDropdownOpen(prev => !prev)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <span>{getRecurrenceLabel(formRecurrence)}</span>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    transform: isRecurrenceDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                    transition: 'transform var(--transition-fast)', 
                    color: 'var(--text-secondary)' 
                  }} 
                />
              </button>

              {isRecurrenceDropdownOpen && (
                <>
                  {/* Overlay click catcher to close dropdown */}
                  <div 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                    onClick={() => setIsRecurrenceDropdownOpen(false)}
                  />
                  {/* Custom Dropdown popover container */}
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    overflow: 'hidden',
                    padding: '4px',
                    animation: 'fadeIn var(--transition-fast) forwards'
                  }}>
                    {RECURRENCE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFormRecurrence(opt.value);
                          setIsRecurrenceDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          fontWeight: 500,
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: formRecurrence === opt.value ? 'var(--accent-light)' : 'transparent',
                          color: formRecurrence === opt.value ? 'var(--accent)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          if (formRecurrence !== opt.value) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          if (formRecurrence !== opt.value) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span>{opt.label}</span>
                        {formRecurrence === opt.value && <Check size={14} style={{ color: 'var(--accent)' }} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaskFormModal;

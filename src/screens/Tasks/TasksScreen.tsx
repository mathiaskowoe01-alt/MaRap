import React, { useState } from 'react';
import { useStore } from '../../db/store';
import { Plus, Search, Calendar, Clock, X, Edit3, Trash2, CheckSquare, Square, Bell } from 'lucide-react';
import type { Task } from '../../db/types';

export const TasksScreen: React.FC = () => {
  const [store, storeActions] = useStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPriority, setFormPriority] = useState<'basse' | 'normale' | 'haute'>('normale');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [formRecurrence, setFormRecurrence] = useState<string>('none');

  // Open modal for creation
  const openCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory(store.categories[0]?.id || '');
    setFormPriority('normale');
    
    // Default date is today
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setFormDate(todayStr);
    setFormTime('');
    
    setHasReminder(false);
    setReminderTime('');
    setFormRecurrence('none');
    
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling checkbox
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormCategory(task.category_id || '');
    setFormPriority(task.priority);
    setFormDate(task.due_date);
    setFormTime(task.due_time);
    
    // Check if task has reminder in store
    const reminder = store.reminders.find(r => r.task_id === task.id);
    if (reminder) {
      setHasReminder(true);
      // Extract time from remind_at timestamp (e.g. YYYY-MM-DDTHH:MM)
      const remindTimeStr = new Date(reminder.remind_at).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }).replace('h', ':');
      setReminderTime(remindTimeStr);
    } else {
      setHasReminder(false);
      setReminderTime('');
    }

    // Set recurrence form
    if (task.recurrence_rule === 'FREQ=DAILY') setFormRecurrence('daily');
    else if (task.recurrence_rule === 'FREQ=WEEKLY') setFormRecurrence('weekly');
    else if (task.recurrence_rule === 'FREQ=MONTHLY') setFormRecurrence('monthly');
    else setFormRecurrence('none');

    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Handle Form Submit
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
      status: editingTask ? editingTask.status : 'a_faire' as const,
      priority: formPriority,
      due_date: formDate,
      due_time: formTime,
      category_id: formCategory || undefined,
      is_all_day: !formTime,
      recurrence_rule: rrule
    };

    const finalReminderTime = hasReminder ? reminderTime : undefined;

    if (editingTask) {
      storeActions.updateTask(editingTask.id, taskData, finalReminderTime);
    } else {
      storeActions.addTask(taskData, finalReminderTime);
    }

    closeModal();
  };

  // Filter Tasks
  const filteredTasks = store.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || task.category_id === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="phone-content" style={{ animation: 'fadeIn var(--transition-normal)' }}>
      {/* Header */}
      <div>
        <h1 className="header-title">Mes Tâches</h1>
        <p className="header-subtitle">Consultez, filtrez et organisez vos objectifs.</p>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            fontSize: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            outline: 'none',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            transition: 'border-color var(--transition-fast)'
          }}
          className="search-input"
        />
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-secondary)',
            pointerEvents: 'none'
          }} 
        />
      </div>

      {/* Horizontal Category Pill Filter */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '99px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            backgroundColor: selectedCategory === 'all' ? 'var(--accent)' : 'var(--bg-card)',
            color: selectedCategory === 'all' ? 'white' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap'
          }}
        >
          Toutes
        </button>
        {store.categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              backgroundColor: selectedCategory === cat.id ? cat.color : 'var(--bg-card)',
              color: selectedCategory === cat.id ? 'white' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Priority Dropdown Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Filtrer par priorité
        </span>
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Toutes les priorités</option>
          <option value="haute">Haute</option>
          <option value="normale">Normale</option>
          <option value="basse">Basse</option>
        </select>
      </div>

      {/* Tasks List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredTasks.length === 0 ? (
          <div className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '48px 20px',
            textAlign: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--bg-hover)', 
              color: 'var(--text-secondary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Search size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Aucune tâche trouvée</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Ajustez vos filtres ou créez une nouvelle tâche.
              </p>
            </div>
          </div>
        ) : (
          filteredTasks.map(task => {
            const category = store.categories.find(c => c.id === task.category_id);
            const formattedDate = new Date(task.due_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            });

            return (
              <div
                key={task.id}
                className={`task-item ${task.status === 'termine' ? 'completed' : ''}`}
                onClick={() => storeActions.toggleTaskStatus(task.id)}
                style={{ 
                  borderLeft: `4px solid ${category ? category.color : 'var(--border-color)'}`,
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {task.status === 'termine' ? (
                    <CheckSquare size={20} style={{ color: 'var(--success)' }} />
                  ) : (
                    <Square size={20} style={{ color: 'var(--text-secondary)' }} />
                  )}
                </div>

                <div className="task-details">
                  <span className="task-title">{task.title}</span>
                  <div className="task-meta">
                    <span className="task-time-badge" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Calendar size={10} />
                      {formattedDate} {task.due_time}
                    </span>
                    {category && (
                      <span className="task-category-tag">
                        <span className="category-dot" style={{ backgroundColor: category.color }}></span>
                        {category.name}
                      </span>
                    )}
                    {task.priority !== 'normale' && (
                      <span className={`badge badge-${task.priority}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-item-actions">
                  <button
                    onClick={(e) => openEditModal(task, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      padding: '4px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    title="Modifier la tâche"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      storeActions.deleteTask(task.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      padding: '4px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    title="Supprimer la tâche"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="fab" onClick={openCreateModal} title="Créer une tâche">
        <Plus size={28} />
      </button>

      {/* Slide Up Sheet Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h3>
              <button 
                onClick={closeModal}
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

            {/* Modal Form */}
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

              {/* Category Grid Selection */}
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

              {/* Priority Segmented Selector */}
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

              {/* Date & Time Selectors */}
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

              {/* Reminders Activation Section */}
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
                          // Default reminder is task time or 09:00
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

              {/* Recurrence Rule Picker */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Récurrence de tâche
                </label>
                <select
                  value={formRecurrence}
                  onChange={(e) => setFormRecurrence(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="none">Tâche unique (Aucune récurrence)</option>
                  <option value="daily">Toutes les journées (Quotidien)</option>
                  <option value="weekly">Toutes les semaines (Hebdomadaire)</option>
                  <option value="monthly">Tous les mois (Mensuel)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
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
      )}
    </div>
  );
};
export default TasksScreen;

import React, { useState } from 'react';
import { useStore } from '../../db/store';
import { Plus, Search, Calendar, Edit3, Trash2, CheckSquare, Square } from 'lucide-react';
import type { Task } from '../../db/types';
import TaskFormModal from '../../components/Tasks/TaskFormModal';

export const TasksScreen: React.FC = () => {
  const [store, storeActions] = useStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handlers
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Filter logic
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

      {/* Category Pill Filter */}
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

      {/* Tasks List */}
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

      {/* Shared Reusable Modal Form */}
      <TaskFormModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        taskToEdit={editingTask} 
      />
    </div>
  );
};
export default TasksScreen;

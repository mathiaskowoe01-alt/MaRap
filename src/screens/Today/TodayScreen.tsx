import React from 'react';
import { useStore } from '../../db/store';
import { CalendarCheck, Trash2, AlertCircle, Sparkles, CheckSquare, Square, MessageSquare } from 'lucide-react';
import type { Task } from '../../db/types';

export const TodayScreen: React.FC = () => {
  const [store, storeActions] = useStore();

  // Helper: Get local today string in YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayStr();

  // Format date for Header (e.g., "Mardi 25 Août")
  const formatHeaderDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = new Date().toLocaleDateString('fr-FR', options);
    // Capitalize first letter
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  // Filter tasks
  const todayTasks = store.tasks.filter(t => t.due_date === todayStr);
  const overdueTasks = store.tasks.filter(t => t.due_date < todayStr && t.status !== 'termine');

  const totalTodayTasks = todayTasks.length;
  const completedTodayTasks = todayTasks.filter(t => t.status === 'termine').length;
  const progressPercent = totalTodayTasks > 0 ? Math.round((completedTodayTasks / totalTodayTasks) * 100) : 0;

  // Handle delete
  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation(); // Avoid triggering status toggle
    storeActions.deleteTask(taskId);
  };

  const renderTaskRow = (task: Task, isOverdue = false) => {
    const category = store.categories.find(c => c.id === task.category_id);
    
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
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          {task.status === 'termine' ? (
            <CheckSquare size={20} style={{ color: 'var(--success)' }} />
          ) : (
            <Square size={20} style={{ color: 'var(--text-secondary)' }} />
          )}
        </div>
        
        <div className="task-details">
          <span className="task-title">{task.title}</span>
          <div className="task-meta">
            {task.due_time && (
              <span className="task-time-badge">{task.due_time}</span>
            )}
            {category && (
              <span className="task-category-tag">
                <span className="category-dot" style={{ backgroundColor: category.color }}></span>
                {category.name}
              </span>
            )}
            {isOverdue && (
              <span className="badge badge-high" style={{ padding: '1px 4px', fontSize: '9px' }}>
                En retard
              </span>
            )}
            {!isOverdue && task.priority !== 'normale' && (
              <span className={`badge badge-${task.priority}`}>
                {task.priority === 'haute' ? 'Priorité Haute' : 'Priorité Basse'}
              </span>
            )}
          </div>
        </div>

        <div className="task-item-actions">
          <button 
            onClick={(e) => handleDeleteTask(e, task.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            title="Supprimer la tâche"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="phone-content" style={{ animation: 'fadeIn var(--transition-normal)' }}>
      {/* Date Header */}
      <div>
        <h1 className="header-title">{formatHeaderDate()}</h1>
        <p className="header-subtitle">Prêt pour planifier et réussir votre journée ?</p>
      </div>

      {/* Completion Progress Tracker */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 20px' }}>
        <div style={{ 
          position: 'relative', 
          width: '56px', 
          height: '56px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {/* SVG Circular Progress Bar */}
          <svg style={{ transform: 'rotate(-90deg)', width: '56px', height: '56px' }}>
            <circle 
              cx="28" 
              cy="28" 
              r="24" 
              stroke="var(--bg-hover)" 
              strokeWidth="4" 
              fill="transparent" 
            />
            <circle 
              cx="28" 
              cy="28" 
              r="24" 
              stroke="var(--accent)" 
              strokeWidth="4" 
              fill="transparent" 
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressPercent / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>
          <span style={{ 
            position: 'absolute', 
            fontSize: '11px', 
            fontWeight: 800, 
            fontFamily: 'var(--font-mono)' 
          }}>
            {progressPercent}%
          </span>
        </div>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Complétion du jour
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {totalTodayTasks > 0 
              ? `${completedTodayTasks} sur ${totalTodayTasks} tâches terminées` 
              : "Aucune tâche planifiée aujourd'hui"}
          </p>
        </div>
      </div>

      {/* Notes / DayPlan Simulator */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <MessageSquare size={16} />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Objectif de ma journée
          </span>
        </div>
        <textarea
          value={store.dailyNote}
          onChange={(e) => storeActions.updateDailyNote(e.target.value)}
          placeholder="Écrivez votre intention ou note de planification pour aujourd'hui..."
          style={{
            width: '100%',
            height: '60px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'transparent',
            padding: '4px 0'
          }}
        />
      </div>

      {/* Overdue Tasks Section */}
      {overdueTasks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tâches en retard ({overdueTasks.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {overdueTasks.map(task => renderTaskRow(task, true))}
          </div>
        </div>
      )}

      {/* Today Tasks Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <CalendarCheck size={16} />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tâches d'aujourd'hui ({totalTodayTasks})
          </span>
        </div>
        
        {totalTodayTasks === 0 ? (
          <div className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '32px 20px',
            textAlign: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent-light)', 
              color: 'var(--accent)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Journée libre !</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Aucune tâche programmée pour aujourd'hui. Profitez de ce temps ou créez-en une.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayTasks.map(task => renderTaskRow(task, false))}
          </div>
        )}
      </div>
    </div>
  );
};
export default TodayScreen;

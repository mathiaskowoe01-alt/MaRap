import React, { useState } from 'react';
import { useStore } from '../../db/store';
import { ChevronLeft, ChevronRight, Sparkles, CheckSquare, Square, Calendar } from 'lucide-react';
import type { Task } from '../../db/types';

export const CalendarScreen: React.FC = () => {
  const [store, storeActions] = useStore();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const MONTHS_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const DAYS_WEEK_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Calendar Calculation Helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay(); // Sunday is 0, Monday is 1...
    // Map to Monday = 0, Sunday = 6
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper: Format to YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Helper: Check if targetDate matches a task (including recurrence logic)
  const isTaskOnDate = (task: Task, targetDateStr: string) => {
    if (task.due_date === targetDateStr) return true;
    
    // Recurrence logic: must start on or after the task's initial due date
    if (task.due_date > targetDateStr) return false;

    const targetDate = new Date(targetDateStr);
    const taskDate = new Date(task.due_date);

    if (task.recurrence_rule === 'FREQ=DAILY') {
      return true;
    }
    
    if (task.recurrence_rule === 'FREQ=WEEKLY') {
      return targetDate.getDay() === taskDate.getDay();
    }

    if (task.recurrence_rule === 'FREQ=MONTHLY') {
      return targetDate.getDate() === taskDate.getDate();
    }

    return false;
  };

  // Get all tasks for a specific date
  const getTasksForDate = (targetDateStr: string) => {
    return store.tasks.filter(task => isTaskOnDate(task, targetDateStr));
  };

  // Render Calendar Grid Days
  const renderDays = () => {
    const dayCells = [];
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Blank cells for alignment
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(<div key={`empty-${i}`} style={{ height: '40px' }}></div>);
    }

    // Actual day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDateStr = formatDateString(currentYear, currentMonth, day);
      const isToday = cellDateStr === todayStr;
      const isSelected = cellDateStr === selectedDateStr;
      
      const dayTasks = getTasksForDate(cellDateStr);
      
      // Get unique category colors for dots (up to 3)
      const dotColors = Array.from(
        new Set(
          dayTasks
            .map(t => store.categories.find(c => c.id === t.category_id)?.color)
            .filter((c): c is string => !!c)
        )
      ).slice(0, 3);

      dayCells.push(
        <div
          key={`day-${day}`}
          onClick={() => setSelectedDateStr(cellDateStr)}
          style={{
            height: '42px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: isToday || isSelected ? 700 : 500,
            position: 'relative',
            backgroundColor: isSelected 
              ? 'var(--accent-light)' 
              : 'transparent',
            border: isToday ? '1px solid var(--accent)' : '1px solid transparent',
            color: isSelected 
              ? 'var(--accent)' 
              : isToday 
                ? 'var(--accent)' 
                : 'var(--text-primary)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span>{day}</span>
          
          {/* Category Dots Indicator */}
          <div style={{ display: 'flex', gap: '3px', position: 'absolute', bottom: '4px' }}>
            {dotColors.map((color, idx) => (
              <span
                key={idx}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: color
                }}
              ></span>
            ))}
          </div>
        </div>
      );
    }

    return dayCells;
  };

  const selectedDateFormatted = new Date(selectedDateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const selectedDayTasks = getTasksForDate(selectedDateStr);

  return (
    <div className="phone-content" style={{ animation: 'fadeIn var(--transition-normal)' }}>
      {/* Header */}
      <div>
        <h1 className="header-title">Calendrier</h1>
        <p className="header-subtitle">Visualisez et planifiez vos tâches dans le temps.</p>
      </div>

      {/* Monthly Navigation Header */}
      <div className="card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={prevMonth}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            <ChevronLeft size={18} />
          </button>
          
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {MONTHS_FR[currentMonth]} {currentYear}
          </span>

          <button 
            onClick={nextMonth}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Days Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', rowGap: '8px' }}>
          {DAYS_WEEK_FR.map(d => (
            <span key={d} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {d}
            </span>
          ))}
          
          {/* Days Grid Cells */}
          {renderDays()}
        </div>
      </div>

      {/* Selected Day Tasks Drawer Drawer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <Calendar size={16} />
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {selectedDateFormatted}
          </span>
        </div>

        {selectedDayTasks.length === 0 ? (
          <div className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '24px 20px',
            textAlign: 'center',
            gap: '8px'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--bg-hover)', 
              color: 'var(--text-tertiary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Aucune tâche</h5>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Aucune planification enregistrée pour ce jour.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedDayTasks.map(task => {
              const category = store.categories.find(c => c.id === task.category_id);
              return (
                <div
                  key={task.id}
                  className={`task-item ${task.status === 'termine' ? 'completed' : ''}`}
                  onClick={() => storeActions.toggleTaskStatus(task.id)}
                  style={{ 
                    borderLeft: `4px solid ${category ? category.color : 'var(--border-color)'}`,
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {task.status === 'termine' ? (
                      <CheckSquare size={18} style={{ color: 'var(--success)' }} />
                    ) : (
                      <Square size={18} style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </div>

                  <div className="task-details">
                    <span className="task-title" style={{ fontSize: '13px' }}>{task.title}</span>
                    <div className="task-meta">
                      {task.due_time && (
                        <span className="task-time-badge">{task.due_time}</span>
                      )}
                      {task.recurrence_rule && (
                        <span className="badge badge-low" style={{ fontSize: '9px', textTransform: 'lowercase', padding: '1px 4px' }}>
                          récurrente
                        </span>
                      )}
                      {category && (
                        <span className="task-category-tag">
                          <span className="category-dot" style={{ backgroundColor: category.color }}></span>
                          {category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default CalendarScreen;

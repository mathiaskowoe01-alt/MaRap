import React from 'react';
import { useStore } from '../../db/store';
import { Sparkles, Calendar, ListTodo, Bell, Settings } from 'lucide-react';

export const TabNavigation: React.FC = () => {
  const [store, storeActions] = useStore();

  const navItems = [
    { id: 'today', label: "Aujourd'hui", icon: Sparkles },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'tasks', label: 'Tâches', icon: ListTodo },
    { id: 'reminders', label: 'Rappels', icon: Bell },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ] as const;

  return (
    <nav className="tab-bar">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = store.currentTab === item.id;

        return (
          <button
            key={item.id}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => storeActions.setCurrentTab(item.id)}
            title={item.label}
          >
            <Icon className="tab-item-icon" />
            <span className="tab-item-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
export default TabNavigation;

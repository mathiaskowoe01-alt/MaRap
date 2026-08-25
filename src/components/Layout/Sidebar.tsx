import React from 'react';
import { useStore } from '../../db/store';
import { Sparkles, Calendar, ListTodo, Bell, Settings, LogOut, CheckSquare, X, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [store, storeActions] = useStore();

  const navItems = [
    { id: 'today' as const, label: "Ma journée", icon: Sparkles },
    { id: 'calendar' as const, label: 'Calendrier', icon: Calendar },
    { id: 'tasks' as const, label: 'Tâches', icon: ListTodo },
    { id: 'reminders' as const, label: 'Rappels & Catégories', icon: Bell },
    { id: 'settings' as const, label: 'Paramètres', icon: Settings }
  ];

  const isAdmin = store.userEmail?.toLowerCase().includes('admin');
  
  const visibleNavItems = isAdmin 
    ? [...navItems, { id: 'admin' as const, label: 'Administration', icon: ShieldAlert }]
    : navItems;

  const handleNavClick = (tabId: typeof store.currentTab) => {
    storeActions.setCurrentTab(tabId);
    onClose(); // Close sidebar on mobile after clicking
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <CheckSquare size={22} className="logo-icon" />
            <span className="logo-text">MaRap</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="sidebar-nav">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = store.currentTab === item.id;

            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} className="nav-item-icon" />
                <span className="nav-item-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {store.userEmail ? store.userEmail.slice(0, 2).toUpperCase() : 'MK'}
            </div>
            <div className="user-info">
              <span className="user-name" style={{ textTransform: 'capitalize' }}>
                {store.userEmail ? store.userEmail.split('@')[0] : 'Mathias Kowoe'}
              </span>
              <span className="user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px', whiteSpace: 'nowrap' }}>
                {store.userEmail || 'mathiaskowoe@demo.com'}
              </span>
            </div>
          </div>
          <button 
            className="logout-btn" 
            onClick={() => storeActions.signOut()}
            title="Se déconnecter"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

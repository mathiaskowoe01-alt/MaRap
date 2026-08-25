import React, { useState, useEffect } from 'react';
import { useStore } from './db/store';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import TodayScreen from './screens/Today/TodayScreen';
import CalendarScreen from './screens/Calendar/CalendarScreen';
import TasksScreen from './screens/Tasks/TasksScreen';
import RemindersScreen from './screens/Reminders/RemindersScreen';
import SettingsScreen from './screens/Settings/SettingsScreen';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [store, storeActions] = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load Canvas Confetti script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const renderActiveScreen = () => {
    switch (store.currentTab) {
      case 'today':
        return <TodayScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'reminders':
        return <RemindersScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <TodayScreen />;
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
      case 'warning':
        return <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />;
      case 'error':
        return <AlertCircle size={16} style={{ color: 'var(--error)' }} />;
      default:
        return <Info size={16} style={{ color: 'var(--accent)' }} />;
    }
  };

  return (
    <div className="app-container">
      {/* Left Sidebar Menu */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Panel */}
      <div className="main-layout">
        {/* Top Navbar */}
        <Header onMenuToggle={() => setIsSidebarOpen(prev => !prev)} />

        {/* Global Toast Alert Notifications */}
        <div className="toast-container">
          {store.toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
                <div style={{ marginTop: '2px' }}>{getToastIcon(toast.type)}</div>
                <div className="toast-content">
                  <div className="toast-title">{toast.title}</div>
                  <div className="toast-desc">{toast.description}</div>
                </div>
                <button 
                  onClick={() => storeActions.removeToast(toast.id)}
                  className="toast-close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Content viewport */}
        <main className="content-area">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;

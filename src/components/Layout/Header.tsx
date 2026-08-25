import React from 'react';
import { useStore } from '../../db/store';
import { Menu, WifiOff, Cloud, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [store, storeActions] = useStore();

  const getPageTitle = () => {
    switch (store.currentTab) {
      case 'today':
        return "Ma journée";
      case 'calendar':
        return 'Calendrier & Planning';
      case 'tasks':
        return 'Mes Tâches';
      case 'reminders':
        return 'Catégories & Rappels';
      case 'settings':
        return 'Paramètres système';
      default:
        return "Ma journée";
    }
  };

  const handleNetworkClick = () => {
    const nextStatus = store.networkStatus === 'online' ? 'offline' : 'online';
    storeActions.setNetworkStatus(nextStatus);
  };

  const unsyncedCount = store.syncLogs.filter(log => log.synced_at === null).length;

  return (
    <header className="app-header">
      {/* Left section */}
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onMenuToggle} title="Ouvrir le menu">
          <Menu size={20} />
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-parent">Tableau de bord</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{getPageTitle()}</span>
        </div>
      </div>

      {/* Right section */}
      <div className="header-right">
        {/* Supabase Sync status shortcut */}
        <button 
          className={`sync-status-badge ${store.networkStatus === 'online' ? 'online' : 'offline'}`}
          onClick={handleNetworkClick}
          title={store.networkStatus === 'online' ? "Passer hors-ligne" : "Passer en ligne"}
        >
          {store.networkStatus === 'online' ? (
            <>
              {store.syncing ? (
                <RefreshCw size={14} className="sync-spinner" style={{ animation: 'shimmerAnim 1.5s infinite linear' }} />
              ) : (
                <Cloud size={14} style={{ color: 'var(--accent)' }} />
              )}
              <span className="status-label">
                {unsyncedCount > 0 ? `${unsyncedCount} en attente` : 'Supabase Synchrone'}
              </span>
              <span className="status-dot success"></span>
            </>
          ) : (
            <>
              <WifiOff size={14} style={{ color: 'var(--error)' }} />
              <span className="status-label">Simulation Hors-ligne</span>
              <span className="status-dot offline"></span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

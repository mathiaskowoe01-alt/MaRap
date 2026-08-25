import React from 'react';
import { useStore } from '../../db/store';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [store] = useStore();

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

      {/* Right section (Empty as requested) */}
      <div className="header-right">
      </div>
    </header>
  );
};

export default Header;

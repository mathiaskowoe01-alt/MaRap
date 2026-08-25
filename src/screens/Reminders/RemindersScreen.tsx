import React, { useState } from 'react';
import { useStore } from '../../db/store';
import { Bell, Tag, Plus, Trash2, Shield, Briefcase, User, Heart, ShoppingCart, DollarSign, BookOpen, Compass } from 'lucide-react';
import * as Icons from 'lucide-react';

export const RemindersScreen: React.FC = () => {
  const [store, storeActions] = useStore();

  // Category creation form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#2563EB');
  const [newCatIcon, setNewCatIcon] = useState('Tag');

  // Lists of icon/color templates
  const COLOR_PALETTE = [
    '#2563EB', // Blue
    '#EA580C', // Orange
    '#059669', // Green
    '#7C3AED', // Purple
    '#D97706', // Gold
    '#EC4899', // Pink
    '#14B8A6'  // Teal
  ];

  const ICON_TEMPLATES = [
    { name: 'Tag', icon: Tag },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'User', icon: User },
    { name: 'Heart', icon: Heart },
    { name: 'ShoppingCart', icon: ShoppingCart },
    { name: 'DollarSign', icon: DollarSign },
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Compass', icon: Compass }
  ];

  // Helper to render dynamic icon
  const renderIcon = (iconName: string, size = 16, color?: string) => {
    // Lookup icon dynamically in Lucide
    const IconComp = (Icons as any)[iconName] || Tag;
    return <IconComp size={size} style={{ color }} />;
  };

  // Form handle
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    storeActions.addCategory(newCatName, newCatColor, newCatIcon);
    setNewCatName('');
  };

  return (
    <div className="phone-content" style={{ animation: 'fadeIn var(--transition-normal)' }}>
      {/* Header */}
      <div>
        <h1 className="header-title">Catégories & Rappels</h1>
        <p className="header-subtitle">Personnalisez vos étiquettes et gérez les alarmes.</p>
      </div>

      {/* Categories section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Tag size={16} />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mes Catégories ({store.categories.length})
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {store.categories.map(cat => {
            const isSystem = cat.id.startsWith('cat-work') || cat.id.startsWith('cat-personal') || cat.id.startsWith('cat-health') || cat.id.startsWith('cat-shopping') || cat.id.startsWith('cat-finance');
            return (
              <div 
                key={cat.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      backgroundColor: `${cat.color}15`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    {renderIcon(cat.icon, 16, cat.color)}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{cat.name}</span>
                </div>

                <div>
                  {isSystem ? (
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        color: 'var(--text-tertiary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        fontWeight: 600
                      }}
                      title="Catégorie système protégée"
                    >
                      <Shield size={10} /> Système
                    </span>
                  ) : (
                    <button
                      onClick={() => storeActions.deleteCategory(cat.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-tertiary)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                      title="Supprimer la catégorie"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Creation Card */}
      <div className="card" style={{ padding: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>
          Créer une catégorie personnalisée
        </h4>
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <input
              type="text"
              placeholder="Nom de la catégorie (ex: Loisirs)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Color list selection */}
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Sélectionnez une couleur
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCatColor(color)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: newCatColor === color ? '2px solid var(--text-primary)' : '2px solid transparent',
                    cursor: 'pointer',
                    transform: newCatColor === color ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all var(--transition-fast)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Icon list selection */}
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Sélectionnez une icône
            </span>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {ICON_TEMPLATES.map(item => {
                const ItemIcon = item.icon;
                const isSelected = newCatIcon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setNewCatIcon(item.name)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--accent-light)' : 'transparent',
                      color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <ItemIcon size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '8px', fontSize: '12px' }}>
            <Plus size={16} />
            Ajouter la catégorie
          </button>
        </form>
      </div>

      {/* Active reminders section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Bell size={16} />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Rappels Programmés ({store.reminders.length})
          </span>
        </div>

        {store.reminders.length === 0 ? (
          <div className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '24px 20px',
            textAlign: 'center',
            gap: '8px'
          }}>
            <Bell size={20} style={{ color: 'var(--text-tertiary)' }} />
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Aucune alarme</h5>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Activez des rappels lors de la création de vos tâches.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {store.reminders.map(rem => {
              const task = store.tasks.find(t => t.id === rem.task_id);
              const triggerDate = new Date(rem.remind_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={rem.id} 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px 16px' 
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, marginRight: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {task ? task.title : 'Tâche supprimée'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{triggerDate}</span>
                      {rem.type === 'recurrent' && (
                        <span className="badge badge-low" style={{ fontSize: '9px', textTransform: 'lowercase', padding: '1px 4px' }}>
                          récurrent
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span 
                      className={`badge badge-${rem.status === 'programme' ? 'medium' : 'low'}`} 
                      style={{ fontSize: '9px', padding: '2px 6px' }}
                    >
                      {rem.status === 'programme' ? 'actif' : 'envoyé'}
                    </span>
                    
                    <button
                      onClick={() => storeActions.deleteReminder(rem.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-tertiary)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                      title="Annuler le rappel"
                    >
                      <Trash2 size={14} />
                    </button>
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
export default RemindersScreen;

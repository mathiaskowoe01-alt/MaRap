import React, { useState } from 'react';
import { useStore, triggerSync } from '../../db/store';
import { Cloud, RefreshCw, Database, FileText, Trash2, ShieldAlert, Bell } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [store, storeActions] = useStore();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const unsyncedCount = store.syncLogs.filter(log => log.synced_at === null).length;

  const handleNetworkToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const status = e.target.checked ? 'online' : 'offline';
    storeActions.setNetworkStatus(status);
  };

  const handleReset = () => {
    storeActions.clearDatabase();
    setShowConfirmReset(false);
  };

  return (
    <div className="phone-content" style={{ animation: 'fadeIn var(--transition-normal)' }}>
      {/* Header */}
      <div>
        <h1 className="header-title">Paramètres</h1>
        <p className="header-subtitle font-sans">Gérez votre connexion, les logs de sync et l'application.</p>
      </div>

      {/* User Profile Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
        <div 
          style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent) 0%, #4F46E5 100%)', 
            color: 'white',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 800
          }}
        >
          MK
        </div>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Mathias Kowoe</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Compte Démo local & Cloud</p>
        </div>
      </div>

      {/* Supabase Sync Controls Panel */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          <Cloud size={18} />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Synchronisation Supabase Cloud
          </span>
        </div>

        {/* Network Toggle Switch */}
        <div className="switch-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Simulation de Connexion</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Activer/Désactiver le réseau simulé</span>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={store.networkStatus === 'online'} 
              onChange={handleNetworkToggle}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Sync Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {store.networkStatus === 'online' ? (
              <>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 8px var(--success)', display: 'inline-block' }}></span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Connecté au serveur</span>
              </>
            ) : (
              <>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-tertiary)', display: 'inline-block' }}></span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Mode Hors-ligne (local-first)</span>
              </>
            )}
          </div>

          {unsyncedCount > 0 && (
            <span className="badge badge-medium" style={{ fontSize: '9px', padding: '2px 6px' }}>
              {unsyncedCount} modification{unsyncedCount > 1 ? 's' : ''} en attente
            </span>
          )}
        </div>

        {/* Manual Sync Button */}
        <button
          onClick={triggerSync}
          disabled={store.networkStatus === 'offline' || store.syncing}
          className="btn btn-primary"
          style={{ width: '100%', padding: '10px' }}
        >
          <RefreshCw size={14} className={store.syncing ? 'shimmer' : ''} style={{ animation: store.syncing ? 'shimmerAnim 1.5s infinite linear' : 'none' }} />
          {store.syncing ? 'Synchronisation...' : 'Synchroniser maintenant'}
        </button>
      </div>

      {/* Notifications system push setup */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          <Bell size={16} />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Notifications en arrière-plan
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Pour recevoir des rappels même lorsque l'application PWA est fermée sur votre téléphone en production.
        </p>
        <button
          onClick={async () => {
            if ('Notification' in window) {
              const permission = await Notification.requestPermission();
              if (permission === 'granted') {
                storeActions.subscribeToPush();
              } else {
                alert("Permission de notification refusée. Activez-la dans les paramètres de votre appareil.");
              }
            } else {
              alert("Votre navigateur ne supporte pas les notifications système.");
            }
          }}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '10px', fontSize: '13px' }}
        >
          Activer les notifications système
        </button>
      </div>

      {/* Sync Activity Logs History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <FileText size={16} />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Historique d'activité de sync
          </span>
        </div>

        {store.syncHistory.length === 0 ? (
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Aucun événement de synchronisation enregistré.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', backgroundColor: 'var(--bg-card)' }}>
            {store.syncHistory.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '2px', 
                  borderBottom: index === store.syncHistory.length - 1 ? 'none' : '1px solid var(--bg-primary)', 
                  paddingBottom: '6px',
                  paddingTop: index === 0 ? '0' : '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.timestamp}</span>
                  <span 
                    style={{ 
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: item.status === 'success' ? 'var(--success)' : item.status === 'warning' ? 'var(--warning)' : 'var(--error)' 
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: '1.4', wordBreak: 'break-word' }}>
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Admin Panel / Reset */}
      <div className="card" style={{ border: '1px solid var(--error-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)' }}>
          <Database size={16} />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Maintenance & Options
          </span>
        </div>
        
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Pour nettoyer le cache `localStorage` et restaurer les valeurs par défaut (catégories systèmes, etc.).
        </p>

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="btn btn-secondary"
            style={{ borderColor: 'var(--error)', color: 'var(--error)', backgroundColor: 'transparent', width: '100%', padding: '8px 12px', fontSize: '12px' }}
          >
            <Trash2 size={13} />
            Réinitialiser la base de données
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--error-light)', padding: '10px', borderRadius: '8px', animation: 'fadeIn var(--transition-fast)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)' }}>
              <ShieldAlert size={14} />
              <span style={{ fontSize: '11px', fontWeight: 700 }}>Êtes-vous absolument sûr ?</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setShowConfirmReset(false)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '4px', fontSize: '11px' }}
              >
                Annuler
              </button>
              <button 
                onClick={handleReset}
                className="btn btn-primary"
                style={{ flex: 1, padding: '4px', fontSize: '11px', backgroundColor: 'var(--error)' }}
              >
                Confirmer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset Details Info (Branding details) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '11px', marginTop: '4px' }}>
        <span>MaRap v1.0.0</span>
        <span>•</span>
        <span>Preset B (Lumière Épurée)</span>
      </div>
    </div>
  );
};
export default SettingsScreen;

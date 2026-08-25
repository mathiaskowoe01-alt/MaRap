import React, { useState, useEffect } from 'react';
import { useStore } from '../../db/store';
import { Wifi, WifiOff, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [store, storeActions] = useStore();
  const [time, setTime] = useState('');

  // Update clock every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWifiClick = () => {
    const nextStatus = store.networkStatus === 'online' ? 'offline' : 'online';
    storeActions.setNetworkStatus(nextStatus);
  };

  const unsyncedCount = store.syncLogs.filter(log => log.synced_at === null).length;

  return (
    <div className="phone-frame">
      <div className="phone-screen">
        {/* Top Notch / Dynamic Island Simulator */}
        <div className="phone-notch">
          <div className="notch-content">
            <span style={{ fontSize: '10px', color: '#9CA3AF' }}>MaRap Sync Engine</span>
            <span style={{ 
              color: unsyncedCount > 0 ? '#FACC15' : '#4ADE80', 
              fontSize: '11px',
              fontFamily: 'var(--font-mono)' 
            }}>
              {store.networkStatus === 'offline' 
                ? 'Hors-ligne' 
                : store.syncing 
                  ? 'Sync en cours...' 
                  : unsyncedCount > 0 
                    ? `${unsyncedCount} en attente` 
                    : 'Synchrone (Supabase)'
              }
            </span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="phone-status-bar">
          <div className="status-time">{time}</div>
          <div className="status-bar-icons">
            <Signal size={13} style={{ strokeWidth: 3 }} />
            <button 
              onClick={handleWifiClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center'
              }}
              title={store.networkStatus === 'online' ? "Passer hors-ligne" : "Passer en ligne"}
            >
              {store.networkStatus === 'online' ? (
                <Wifi size={13} style={{ strokeWidth: 3, color: 'var(--accent)' }} />
              ) : (
                <WifiOff size={13} style={{ strokeWidth: 3, color: 'var(--error)' }} />
              )}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>100%</span>
              <Battery size={15} style={{ strokeWidth: 2 }} />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        {children}

        {/* Home Indicator */}
        <div className="phone-home-indicator">
          <div className="home-bar"></div>
        </div>
      </div>
    </div>
  );
};
export default PhoneFrame;

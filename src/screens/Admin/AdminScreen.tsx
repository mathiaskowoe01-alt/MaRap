import React, { useEffect, useState } from 'react';
import { useStore } from '../../db/store';
import { Users, CheckSquare, BarChart2, ShieldAlert, RefreshCw, Mail, Calendar } from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const [store, storeActions] = useStore();
  const [loading, setLoading] = useState(false);

  // Load admin stats on mount
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      await storeActions.fetchAdminData();
      setLoading(false);
    };
    loadStats();
  }, []);

  // Compute overall totals
  const totalUsers = store.adminUsers.length;
  const totalTasks = store.adminUsers.reduce((sum, user) => sum + user.total_tasks, 0);
  const totalCompleted = store.adminUsers.reduce((sum, user) => sum + user.completed_tasks, 0);
  const globalCompletionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Format date utility
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Determine progress bar color based on completion percentage
  const getProgressColor = (rate: number) => {
    if (rate >= 70) return 'var(--success)';
    if (rate >= 30) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="phone-content" style={{ animation: 'fadeIn var(--transition-normal)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Administration
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Accès Admin
            </span>
          </h1>
          <p className="header-subtitle">Statistiques globales et audit des utilisateurs inscrits.</p>
        </div>

        <button
          onClick={async () => {
            setLoading(true);
            await storeActions.fetchAdminData();
            setLoading(false);
          }}
          disabled={loading}
          className="btn btn-secondary"
          style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={12} className={loading ? 'shimmer' : ''} style={{ animation: loading ? 'shimmerAnim 1.5s infinite linear' : 'none' }} />
          Actualiser
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* Card 1: Users */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Utilisateurs</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{totalUsers}</h2>
          </div>
        </div>

        {/* Card 2: Tasks */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Tâches système</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{totalTasks}</h2>
          </div>
        </div>

        {/* Card 3: Completion */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BarChart2 size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Taux de complétion</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{globalCompletionRate}%</h2>
          </div>
        </div>
      </div>

      {/* Users Audit Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Audit des comptes enregistrés
        </h3>

        {totalUsers === 0 ? (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--error-light)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={24} />
            </div>
            <div style={{ maxWidth: '360px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Données d'administration indisponibles</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                La table publique <code>profiles</code> n'a renvoyé aucun enregistrement. Si ce n'est pas déjà fait, assurez-vous d'avoir exécuté la section 5 et 6 du script SQL Supabase pour activer les profils automatiques lors de l'inscription de nouveaux utilisateurs.
              </p>
            </div>
            <div style={{ width: '100%', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'left', fontSize: '10px', fontFamily: 'var(--font-mono)', overflowX: 'auto' }}>
              -- SQL pour corriger les utilisateurs déjà inscrits :<br/>
              INSERT INTO public.profiles (id, email)<br/>
              SELECT id, email FROM auth.users ON CONFLICT DO NOTHING;
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Utilisateur</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Date d'inscription</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'center' }}>Tâches</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>Complétion</th>
                </tr>
              </thead>
              <tbody>
                {store.adminUsers.map((user) => {
                  const rate = user.total_tasks > 0 ? Math.round((user.completed_tasks / user.total_tasks) * 100) : 0;
                  
                  return (
                    <tr 
                      key={user.id} 
                      style={{ 
                        borderBottom: '1px solid var(--bg-primary)', 
                        transition: 'background-color var(--transition-fast)'
                      }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={14} style={{ color: 'var(--text-tertiary)' }} />
                          {user.email}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {user.completed_tasks} / {user.total_tasks}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-hover)', borderRadius: '99px', overflow: 'hidden', minWidth: '80px' }}>
                            <div 
                              style={{ 
                                width: `${rate}%`, 
                                height: '100%', 
                                backgroundColor: getProgressColor(rate),
                                borderRadius: '99px',
                                transition: 'width 0.4s ease-out'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminScreen;

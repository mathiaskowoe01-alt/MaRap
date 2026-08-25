import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', padding: '48px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '32px',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--text-tertiary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <ChevronLeft size={16} />
          <span>Retour</span>
        </button>

        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: 'var(--text-primary)' }}>Politique de Confidentialité</h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>1. Collecte des données</h2>
          <p>Nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse email, et les données relatives à vos tâches et plannings dans MaRap.</p>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>2. Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour vous fournir le service MaRap, synchroniser vos appareils, et vous envoyer les notifications demandées. Nous ne vendons en aucun cas vos données à des tiers.</p>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>3. Sécurité</h2>
          <p>Nous mettons en œuvre des mesures de sécurité pour protéger vos informations. Vos données sont stockées de manière sécurisée via nos partenaires d'infrastructure (Supabase).</p>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>4. Vos droits</h2>
          <p>Vous avez le droit d'accéder, de rectifier, ou de supprimer vos données personnelles à tout moment en nous contactant via support@marap.co.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyScreen;

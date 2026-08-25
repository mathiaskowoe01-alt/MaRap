import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

export const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ onBack }) => {
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

        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: 'var(--text-primary)' }}>Conditions d'utilisation</h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>1. Acceptation des conditions</h2>
          <p>En accédant à MaRap et en l'utilisant, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser notre service.</p>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>2. Description du service</h2>
          <p>MaRap est un outil de productivité et de gestion de tâches. Nous nous réservons le droit de modifier, de suspendre ou d'interrompre le service à tout moment.</p>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>3. Comptes utilisateurs</h2>
          <p>Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe, ainsi que de toutes les activités qui se produisent sous votre compte.</p>
          
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>4. Limitation de responsabilité</h2>
          <p>MaRap ne peut être tenu responsable des dommages directs, indirects, accidentels ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceScreen;

import React from 'react';
import { Sparkles, Zap, ArrowRight, Mail, Globe } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <div 
      style={{ 
        fontFamily: 'var(--font-sans)', 
        backgroundColor: '#FFFFFF', 
        color: '#1E293B',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Decorative Grid Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '600px',
          backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Navbar */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <Sparkles size={18} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            MaRap
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onStart}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Se connecter
          </button>
          <button 
            onClick={onStart}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
          >
            Essayer gratuitement
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section 
        style={{
          padding: '80px 24px 60px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          zIndex: 1,
          position: 'relative'
        }}
      >
        {/* Glow behind hero */}
        <div 
          style={{
            position: 'absolute',
            top: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />

        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '99px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.02em'
          }}
        >
          <Zap size={12} />
          <span>VOTRE COMPAGNON DE PRODUCTIVITÉ EN PRODUCTION</span>
        </div>

        <h1 
          style={{ 
            fontSize: 'clamp(32px, 5vw, 56px)', 
            fontWeight: 900, 
            letterSpacing: '-0.04em', 
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            maxWidth: '800px'
          }}
        >
          Maîtrisez votre temps, <br/>
          <span style={{ color: 'var(--accent)' }}>libérez votre esprit.</span>
        </h1>

        <p 
          style={{ 
            fontSize: 'clamp(15px, 2vw, 18px)', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.6, 
            maxWidth: '640px',
            margin: '0 auto'
          }}
        >
          MaRap combine la simplicité d'un agenda, l'intelligence des rappels système en temps réel et la robustesse du cloud Supabase pour propulser votre productivité au niveau supérieur.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={onStart}
            className="btn btn-primary"
            style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Démarrer gratuitement</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Dashboard Mockup Showcase */}
        <div 
          style={{
            marginTop: '48px',
            width: '100%',
            maxWidth: '800px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            backgroundColor: '#F8FAFC',
            padding: '8px'
          }}
        >
          <div 
            style={{ 
              borderRadius: '10px', 
              overflow: 'hidden', 
              border: '1px solid var(--border-color)',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Mock Dashboard Topbar */}
            <div style={{ height: '38px', backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
              <div style={{ margin: '0 auto', fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>marap.co/app</div>
            </div>
            {/* Mock Layout Body */}
            <div style={{ display: 'flex', height: '320px', textAlign: 'left' }}>
              {/* Mock Sidebar */}
              <div style={{ width: '120px', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ width: '60px', height: '14px', backgroundColor: 'var(--accent-light)', borderRadius: '4px' }}></div>
                <div style={{ width: '80px', height: '12px', backgroundColor: 'var(--bg-hover)', borderRadius: '4px' }}></div>
                <div style={{ width: '70px', height: '12px', backgroundColor: 'var(--bg-hover)', borderRadius: '4px' }}></div>
              </div>
              {/* Mock Content */}
              <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '120px', height: '20px', backgroundColor: 'var(--text-primary)', opacity: 0.1, borderRadius: '4px' }}></div>
                  <div style={{ width: '40px', height: '12px', backgroundColor: 'var(--success)', opacity: 0.15, borderRadius: '4px' }}></div>
                </div>
                <div style={{ height: '70px', border: '1px dashed var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                  Statistiques & Complétion
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ height: '32px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <div style={{ width: '12px', height: '12px', border: '1px solid var(--border-color)', borderRadius: '3px', marginRight: '8px' }}></div>
                    <div style={{ width: '160px', height: '10px', backgroundColor: 'var(--text-primary)', opacity: 0.1, borderRadius: '2px' }}></div>
                  </div>
                  <div style={{ height: '32px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <div style={{ width: '12px', height: '12px', border: '1px solid var(--border-color)', borderRadius: '3px', marginRight: '8px' }}></div>
                    <div style={{ width: '110px', height: '10px', backgroundColor: 'var(--text-primary)', opacity: 0.1, borderRadius: '2px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 STEPS) */}
      <section 
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          padding: '80px 24px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>Comment ça marche ?</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '48px' }}>
            Planifiez, organisez et suivez votre journée en toute simplicité en 3 étapes clefs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-light)', 
                  color: 'var(--accent)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Planifiez votre journée</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Utilisez l'onglet d'accueil pour inscrire vos objectifs du jour. Fixez des priorités et déterminez les créneaux horaires de vos tâches.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-light)', 
                  color: 'var(--accent)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Configurez des rappels</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Activez les alarmes et notifications Web Push. Vous serez alerté même lorsque l'application PWA est fermée ou en veille.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-light)', 
                  color: 'var(--accent)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Synchronisation Cloud</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Vos tâches sont synchronisées en temps réel sur Supabase. L'application reste pleinement fonctionnelle en mode hors-ligne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (3 REVIEWS) */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>Ils adorent MaRap</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '48px' }}>
            Découvrez les retours d'expérience de nos utilisateurs quotidiens.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Review 1 */}
            <div className="card" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "MaRap a totalement changé ma façon de planifier mes journées. L'interface est épurée, rapide, et la synchro hors-ligne est magique."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                  SM
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Sophie Martin</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Directrice Marketing</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="card" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "Les rappels système PWA me permettent de rester concentré sans avoir à installer une application lourde. Un pur bonheur."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                  TD
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Thomas Dubois</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Développeur Freelance</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="card" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "Le design scandinave épuré est magnifique et très apaisant. Planifier mes tâches sur mobile ou sur PC est devenu un plaisir quotidien."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                  AD
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Amina Diop</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Créatrice de Contenu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer 
        style={{
          marginTop: 'auto',
          backgroundColor: '#0F172A',
          color: '#94A3B8',
          borderTop: '1px solid #1E293B',
          padding: '48px 24px 32px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '24px' }}>
            {/* Footer Logo info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '12px' }}>
                <Sparkles size={18} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em' }}>MaRap</span>
              </div>
              <p style={{ fontSize: '12px', maxWidth: '280px', lineHeight: '1.6' }}>
                Simplifiez vos planifications quotidiennes, suivez vos objectifs et synchronisez vos rappels en toute sérénité.
              </p>
            </div>

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Contact & Assistance</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <Mail size={14} />
                <span>support@marap.co</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <Globe size={14} />
                <span>www.marap.co</span>
              </div>
            </div>

            {/* Social Media mockup */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Réseaux sociaux</h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#twitter" style={{ color: '#94A3B8', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Twitter</a>
                <a href="#linkedin" style={{ color: '#94A3B8', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>LinkedIn</a>
                <a href="#github" style={{ color: '#94A3B8', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>GitHub</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1E293B', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '11px' }}>
            <span>&copy; 2026 MaRap. Tous droits réservés.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Confidentialité</a>
              <a href="#terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingScreen;

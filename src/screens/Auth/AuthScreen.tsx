import React, { useState } from 'react';
import { useStore } from '../../db/store';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle, ChevronLeft } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const [store, storeActions] = useStore();
  
  // Auth states
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Visual states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  
  // Forgot Password / Recovery states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (store.authAction === 'recovery') {
      if (password !== passwordConfirm) {
        setErrorMsg('Les mots de passe ne correspondent pas.');
        return;
      }
      if (!password.trim()) return;
    } else if (isForgotPassword) {
      if (!email.trim()) return;
    } else {
      if (!email.trim() || !password.trim()) return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (store.authAction === 'recovery') {
        await storeActions.updatePassword(password);
      } else if (isForgotPassword) {
        await storeActions.resetPasswordForEmail(email);
        setIsForgotPassword(false);
      } else if (isSignUp) {
        await storeActions.signUp(email, password);
        setEmailVerificationSent(true);
      } else {
        await storeActions.signIn(email, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (emailVerificationSent || store.authAction === 'email_verified') {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: 'var(--bg-primary)',
          padding: '24px',
          animation: 'fadeIn var(--transition-normal)'
        }}
      >
        <div 
          className="card" 
          style={{ 
            maxWidth: '440px', 
            width: '100%', 
            padding: '40px 32px', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--success-light)', 
              color: 'var(--success)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <CheckCircle size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {store.authAction === 'email_verified' ? 'Email vérifié !' : 'Vérifiez votre boîte e-mail'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>
              {store.authAction === 'email_verified' 
                ? "Votre adresse e-mail a été validée avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités."
                : `Un lien de confirmation a été envoyé à ${email}. Veuillez cliquer sur ce lien pour activer votre compte.`}
            </p>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              if (store.authAction === 'email_verified') {
                storeActions.setAuthAction(null);
              } else {
                setEmailVerificationSent(false);
                setIsSignUp(false);
                setEmail('');
                setPassword('');
              }
            }}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {store.authAction === 'email_verified' ? "Continuer vers l'application" : "Retour à la connexion"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'var(--bg-primary)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative gradient blur background nodes */}
      <div 
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      <div 
        className="card" 
        style={{ 
          maxWidth: '440px', 
          width: '100%', 
          padding: '40px 32px', 
          zIndex: 1, 
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn var(--transition-normal)'
        }}
      >
        {/* App Logo & Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
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
            <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              MaRap
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            {store.authAction === 'recovery'
              ? 'Veuillez saisir votre nouveau mot de passe'
              : isForgotPassword
                ? 'Entrez votre e-mail pour recevoir un lien de réinitialisation'
                : isSignUp 
                  ? 'Créez votre compte de productivité' 
                  : 'Connectez-vous à votre espace personnel'}
          </p>
        </div>

        {/* Display Errors if any */}
        {errorMsg && (
          <div 
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--error-light)',
              color: 'var(--error)',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '20px',
              lineHeight: '1.5',
              border: '1px solid var(--error-border)'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Email input (hidden during recovery) */}
          {store.authAction !== 'recovery' && (
            <div className="input-group">
              <input
                type="email"
                className="input-field"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <label className="input-label" style={{ left: '38px' }}>Adresse e-mail</label>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          )}

          {/* Password input (hidden during forgot password email entry) */}
          {!isForgotPassword && (
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
              />
              <label className="input-label" style={{ left: '38px' }}>
                {store.authAction === 'recovery' ? 'Nouveau mot de passe' : 'Mot de passe'}
              </label>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}

          {/* Password confirm (only during recovery) */}
          {store.authAction === 'recovery' && (
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder=" "
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
              />
              <label className="input-label" style={{ left: '38px' }}>Confirmer le mot de passe</label>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          )}

          {/* Forgot Password Link (only on login view) */}
          {!isSignUp && !isForgotPassword && store.authAction !== 'recovery' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--accent)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '8px', gap: '8px' }}
          >
            <span>
              {loading 
                ? (store.authAction === 'recovery' ? 'Mise à jour...' : isForgotPassword ? 'Envoi...' : isSignUp ? 'Création...' : 'Connexion...') 
                : (store.authAction === 'recovery' ? 'Réinitialiser' : isForgotPassword ? 'Envoyer le lien' : isSignUp ? 'Créer un compte' : 'Se connecter')}
            </span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* OAuth and View Toggle (hidden during recovery/forgot password) */}
        {store.authAction !== 'recovery' && !isForgotPassword && (
          <>
            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ou</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                setErrorMsg(null);
                try {
                  await storeActions.signInWithGoogle();
                } catch (err: any) {
                  setErrorMsg(err.message || 'Échec de la connexion Google.');
                  setLoading(false);
                }
              }}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continuer avec Google</span>
            </button>
          </>
        )}

        {/* View Toggle Link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          {isForgotPassword || store.authAction === 'recovery' ? (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                if (store.authAction === 'recovery') {
                  storeActions.setAuthAction(null);
                }
                setErrorMsg(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                margin: '0 auto'
              }}
            >
              <ChevronLeft size={16} />
              Retour à la connexion
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSignUp(prev => !prev);
                setErrorMsg(null);
                setEmail('');
                setPassword('');
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--accent)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              {isSignUp 
                ? 'Déjà inscrit ? Connectez-vous' 
                : 'Nouveau ? Créez un compte gratuitement'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthScreen;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(firstName, lastName, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      <div
        style={{
          maxWidth: '28rem',
          margin: '0 auto',
          padding: '4rem 1rem',
        }}
      >
        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-2px',
              color: '#fff',
              margin: '0 0 0.5rem 0',
              fontSize: '2.5rem',
            }}
          >
            {mode === 'login' ? 'Bon retour' : 'Bienvenue'}
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
            }}
          >
            {mode === 'login'
              ? 'Connectez-vous pour accéder à votre compte'
              : 'Créez votre compte pour réserver votre séjour'}
          </p>
        </motion.div>

        {/* Mode toggle */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            display: 'flex',
            marginBottom: '2rem',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
          className="liquid-glass"
        >
          <button
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: mode === 'login' ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: mode === 'login' ? '#fff' : 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: '9999px',
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: mode === 'register' ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: mode === 'register' ? '#fff' : 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: '9999px',
            }}
          >
            Inscription
          </button>
        </motion.div>

        {/* Form */}
        <motion.form
          {...fadeUp(0.2)}
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {mode === 'register' && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="auth-input"
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />

          {error && (
            <p
              style={{
                color: '#ff6b6b',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'transform 0.2s, opacity 0.2s',
              marginTop: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading
              ? '...'
              : mode === 'login'
              ? 'Se connecter'
              : "S'inscrire"}
          </button>
        </motion.form>

        {/* Divider */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '2rem 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </motion.div>

        <motion.div {...fadeUp(0.35)} style={{ textAlign: 'center' }}>
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            {mode === 'login' ? "Créer un compte" : 'Se connecter'}
          </button>
        </motion.div>
      </div>

      <style>{`
        .auth-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .auth-input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .auth-input:focus {
          border-color: rgba(255,255,255,0.3);
        }
      `}</style>
      <Footer />
    </div>
  );
}

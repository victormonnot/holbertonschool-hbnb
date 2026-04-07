import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookies-accepted', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: 0,
            right: 0,
            margin: '0 auto',
            zIndex: 9999,
            width: '92%',
            maxWidth: '32rem',
          }}
        >
          <div
            style={{
              background: 'rgba(10, 12, 25, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={decline}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            >
              <X size={16} />
            </button>

            {/* Icon + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cookie size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  color: '#fff',
                }}
              >
                Cookies spatiaux
              </span>
            </div>

            {/* Text */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              Nous utilisons des cookies pour améliorer votre expérience de navigation interstellaire.
              En savoir plus dans notre{' '}
              <Link
                to="/legal/cookies"
                onClick={accept}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                politique de cookies
              </Link>.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={accept}
                style={{
                  flex: 1,
                  padding: '0.625rem 1rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.90)',
                  color: '#000',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.90)')}
              >
                Accepter
              </button>
              <button
                onClick={decline}
                style={{
                  flex: 1,
                  padding: '0.625rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                }}
              >
                Refuser
              </button>
            </div>
          </div>
        </motion.div>
  );
}

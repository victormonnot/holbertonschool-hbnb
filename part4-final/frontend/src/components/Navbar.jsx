import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Destinations', to: '/places' },
  { label: 'Expériences', to: '#' },
  { label: 'Hôtes', to: '#' },
  { label: 'Contact', to: '#' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          maxWidth: '80rem',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '1.875rem',
            letterSpacing: '-0.02em',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          HolByNB<sup style={{ fontSize: '0.75rem' }}>&reg;</sup>
        </Link>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) =>
                (e.target.style.color = 'rgba(255,255,255,0.6)')
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <Link
                to="/places/new"
                className="liquid-glass nav-add-place"
                style={{
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')
                }
              >
                + Proposer
              </Link>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.6)',
                }}
                className="nav-user-name"
              >
                {user.first_name}
              </span>
              <button
                onClick={handleLogout}
                className="liquid-glass"
                style={{
                  borderRadius: '9999px',
                  padding: '0.625rem 1.5rem',
                  fontSize: '0.875rem',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  background: 'none',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.03)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="liquid-glass"
              style={{
                borderRadius: '9999px',
                padding: '0.625rem 1.5rem',
                fontSize: '0.875rem',
                color: '#fff',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.target.style.transform = 'scale(1.03)')
              }
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Connexion
            </Link>
          )}
        </div>
      </nav>

      <style>{`
        .nav-links {
          display: none;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }
        .nav-user-name,
        .nav-add-place {
          display: none;
        }
        @media (min-width: 768px) {
          .nav-user-name,
          .nav-add-place {
            display: inline;
          }
        }
      `}</style>
    </>
  );
}

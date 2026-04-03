import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Globe, AtSign, ExternalLink } from 'lucide-react';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

// Keywords to match places by title
const DEST_KEYWORDS = [
  { label: 'Mars', keyword: 'mars' },
  { label: 'Lune', keyword: 'lunaire' },
  { label: 'Europa', keyword: 'europa' },
  { label: 'Titan', keyword: 'titan' },
  { label: 'Orbite', keyword: 'orbitale' },
  { label: 'V\u00e9nus', keyword: 'v\u00e9nus' },
];

const STATIC_COLS = [
  {
    title: 'Voyageurs',
    links: [
      { label: 'Comment \u00e7a marche', to: '/info/comment-ca-marche' },
      { label: 'S\u00e9jours populaires', to: '/info/sejours-populaires' },
      { label: 'FAQ', to: '/info/faq' },
      { label: 'Support voyageurs', to: '/info/support-voyageurs' },
    ],
  },
  {
    title: 'H\u00f4tes',
    links: [
      { label: 'Devenir h\u00f4te', to: '/info/devenir-hote' },
      { label: 'Ressources', to: '/info/ressources' },
      { label: 'Tableau de bord', to: '/info/tableau-de-bord' },
      { label: 'Communaut\u00e9', to: '/info/communaute' },
    ],
  },
  {
    title: 'HolByNB',
    links: [
      { label: '\u00c0 propos', to: '/info/a-propos' },
      { label: 'Carri\u00e8res', to: '/info/carrieres' },
      { label: 'Presse', to: '/info/presse' },
      { label: 'Contact', to: '/info/contact' },
    ],
  },
];

export default function Footer() {
  const [destLinks, setDestLinks] = useState(
    DEST_KEYWORDS.map((d) => ({ label: d.label }))
  );

  useEffect(() => {
    fetch('/api/v1/places')
      .then((r) => r.json())
      .then((places) => {
        if (!Array.isArray(places)) return;
        setDestLinks(
          DEST_KEYWORDS.map((d) => {
            const match = places.find((p) =>
              p.title.toLowerCase().includes(d.keyword)
            );
            return { label: d.label, to: match ? `/places/${match.id}` : '/places' };
          }).concat([{ label: 'Toutes les destinations', to: '/places' }])
        );
      })
      .catch(() => { });
  }, []);

  const linkCols = [
    { title: 'Destinations', links: destLinks },
    ...STATIC_COLS,
  ];

  return (
    <footer
      style={{
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="footer-root"
    >
      {/* Horizon line glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(255,255,255,0.10)',
          boxShadow:
            '0 0 15px rgba(30,70,160,0.2), 0 0 60px rgba(30,70,160,0.1), 0 0 120px rgba(30,70,160,0.04)',
          zIndex: 5,
        }}
      />

      {/* Ghost watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%) translateY(30%)',
          fontFamily: 'var(--font-heading)',
          color: 'rgba(255,255,255,0.02)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          lineHeight: 1,
        }}
        className="footer-watermark"
      >
        HolByNB
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '80rem',
          margin: '0 auto',
          width: '100%',
        }}
        className="footer-container"
      >
        {/* Zone 1 — Branding + Newsletter */}
        <div className="footer-zone1">
          {/* Left — branding */}
          <motion.div {...fadeUp(0.1)}>
            <div
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '1.5rem',
                color: '#fff',
                letterSpacing: '-0.5px',
              }}
            >
              HolByNB<sup style={{ fontSize: '8px', verticalAlign: 'super' }}>&reg;</sup>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.30)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                marginTop: '0.5rem',
              }}
            >
              L'h&eacute;bergement spatial, r&eacute;invent&eacute;.
            </p>
          </motion.div>

          {/* Right — newsletter */}
          <motion.div {...fadeUp(0.2)} style={{ maxWidth: '24rem', width: '100%' }}>
            <div
              className="liquid-glass"
              style={{
                borderRadius: '9999px',
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              <input
                type="email"
                placeholder="Votre email"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  color: '#fff',
                  minWidth: 0,
                }}
              />
              <button
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: 'none',
                  borderRadius: '0 9999px 9999px 0',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  color: 'rgba(255,255,255,0.60)',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')
                }
              >
                S'inscrire
              </button>
            </div>
          </motion.div>
        </div>

        {/* Zone 2 — Link columns */}
        <div className="footer-links-grid">
          {linkCols.map((col, ci) => (
            <motion.div key={col.title} {...fadeUp(0.15 + ci * 0.05)}>
              <p
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.50)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  marginBottom: '1rem',
                }}
              >
                {col.title}
              </p>
              {col.links.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.30)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      textDecoration: 'none',
                      padding: '0.375rem 0',
                      transition: 'color 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')
                    }
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href="#"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.30)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      textDecoration: 'none',
                      padding: '0.375rem 0',
                      transition: 'color 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')
                    }
                  >
                    {link.label}
                  </a>
                )
              )}
            </motion.div>
          ))}
        </div>

        {/* Zone 3 — Legal bar */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
          className="footer-legal"
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.25)',
              fontFamily: 'var(--font-body)',
            }}
          >
            &copy; 2026 HolByNB. Tous droits r&eacute;serv&eacute;s.
          </span>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { label: 'Confidentialit\u00e9', to: '/legal/confidentialite' },
              { label: 'Conditions', to: '/legal/conditions' },
              { label: 'Cookies', to: '/legal/cookies' },
            ].map((t) => (
              <Link
                key={t.label}
                to={t.to}
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.25)',
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')
                }
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[Globe, AtSign, ExternalLink].map((Icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
                }
              >
                <Icon
                  size={14}
                  style={{ color: 'rgba(255,255,255,0.30)' }}
                />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .footer-root {
          padding: 5rem 1rem 0;
        }
        @media (min-width: 768px) {
          .footer-root { padding: 5rem 2rem 0; }
        }
        @media (min-width: 1024px) {
          .footer-root { padding: 5rem 4rem 0; }
        }

        .footer-watermark {
          font-size: 8rem;
        }
        @media (min-width: 768px) {
          .footer-watermark { font-size: 12rem; }
        }
        @media (min-width: 1024px) {
          .footer-watermark { font-size: 16rem; }
        }

        .footer-zone1 {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          margin-bottom: 4rem;
        }
        @media (min-width: 768px) {
          .footer-zone1 {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            gap: 4rem;
          }
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-bottom: 4rem;
        }
        @media (min-width: 768px) {
          .footer-links-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 3rem;
          }
        }

        .footer-legal {
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }
        @media (min-width: 768px) {
          .footer-legal {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }
        }
      `}</style>
    </footer>
  );
}

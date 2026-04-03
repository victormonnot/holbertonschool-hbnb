import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const CARD_GRADIENTS = [
  'linear-gradient(135deg, rgba(180,60,60,0.14) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(40,80,180,0.14) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(180,160,100,0.12) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(40,180,160,0.13) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(120,60,180,0.14) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(60,160,80,0.13) 0%, rgba(0,0,0,0.9) 100%)',
];

const BG_STARS = `
  6vw 50px 1px 0px rgba(255,255,255,0.5),
  18vw 130px 0px 0px rgba(255,255,255,0.3),
  32vw 30px 1px 0px rgba(255,255,255,0.6),
  47vw 100px 0px 0px rgba(100,140,255,0.6),
  61vw 60px 1px 0px rgba(255,255,255,0.4),
  78vw 140px 0px 0px rgba(255,255,255,0.5),
  91vw 80px 1px 0px rgba(255,255,255,0.3),
  12vw 220px 0px 0px rgba(255,255,255,0.4),
  40vw 250px 1px 0px rgba(100,140,255,0.5),
  70vw 200px 0px 0px rgba(255,255,255,0.6),
  88vw 240px 1px 0px rgba(255,255,255,0.3)
`;

export default function Places() {
  const [searchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [reviews, setReviews] = useState({});
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetch('/api/v1/places')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setPlaces(list);
        list.forEach((place) => {
          fetch(`/api/v1/places/${place.id}/reviews`)
            .then((r) => r.json())
            .then((revs) => {
              if (Array.isArray(revs))
                setReviews((prev) => ({ ...prev, [place.id]: revs }));
            })
            .catch(() => {});
        });
      })
      .catch(() => {});
  }, []);

  const getRating = (placeId) => {
    const revs = reviews[placeId];
    if (!revs || revs.length === 0) return { avg: 0, count: 0 };
    const avg = revs.reduce((s, r) => s + r.rating, 0) / revs.length;
    return { avg: Math.round(avg * 10) / 10, count: revs.length };
  };

  // Filter
  const filtered = places.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') {
      return getRating(b.id).avg - getRating(a.id).avg;
    }
    return 0;
  });

  return (
    <div
      style={{
        background: '#040710',
        minHeight: '100vh',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 50% at 60% 20%, rgba(255,255,255,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="plp-stars" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            width: '100%',
          }}
          className="plp-container"
        >
          {/* Header */}
          <motion.div {...fadeUp(0)}>
            <p className="plp-section-label">TOUS LES SÉJOURS</p>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-2px',
                color: '#fff',
                margin: 0,
              }}
              className="plp-heading"
            >
              Explorez le système{' '}
              <span
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontStyle: 'italic',
                }}
              >
                solaire
              </span>
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                maxWidth: '36rem',
                marginTop: '1rem',
              }}
              className="plp-subtitle"
            >
              {places.length} destination{places.length > 1 ? 's' : ''}{' '}
              disponible{places.length > 1 ? 's' : ''} à travers l'espace.
            </p>
          </motion.div>

          {/* Search + Sort bar */}
          <motion.div
            {...fadeUp(0.1)}
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Search */}
            <div
              className="liquid-glass"
              style={{
                flex: 1,
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderRadius: '9999px',
                padding: '0.625rem 1.25rem',
              }}
            >
              <Search
                size={16}
                style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}
              />
              <input
                type="text"
                placeholder="Rechercher une destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="liquid-glass"
              style={{
                borderRadius: '9999px',
                padding: '0.625rem 1.25rem',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                appearance: 'none',
                paddingRight: '2rem',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="default" style={{ background: '#111' }}>
                Trier par
              </option>
              <option value="price-asc" style={{ background: '#111' }}>
                Prix croissant
              </option>
              <option value="price-desc" style={{ background: '#111' }}>
                Prix décroissant
              </option>
              <option value="rating" style={{ background: '#111' }}>
                Meilleures notes
              </option>
            </select>
          </motion.div>

          {/* Results count */}
          {search && (
            <p
              style={{
                marginTop: '1rem',
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {sorted.length} résultat{sorted.length !== 1 ? 's' : ''} pour "
              {search}"
            </p>
          )}

          {/* Grid */}
          <div className="plp-grid">
            {sorted.map((place, i) => {
              const { avg, count } = getRating(place.id);
              return (
                <motion.div
                  key={place.id}
                  {...fadeUp(0.15 + i * 0.05)}
                  className="plp-card"
                  style={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: '280px',
                  }}
                >
                  <Link
                    to={`/places/${place.id}`}
                    style={{
                      display: 'block',
                      position: 'absolute',
                      inset: 0,
                      textDecoration: 'none',
                      color: 'inherit',
                      zIndex: 25,
                    }}
                  >
                    {/* Background */}
                    <div
                      className="plp-card-bg"
                      style={{
                        background: place.image_url
                          ? `url(${place.image_url}) center/cover no-repeat`
                          : CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                      }}
                    />

                    {/* Bottom overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '66%',
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, transparent 100%)',
                        zIndex: 10,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Content */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1.25rem',
                        zIndex: 20,
                        textShadow: '0 1px 4px rgba(0,0,0,0.7), 0 2px 12px rgba(0,0,0,0.5)',
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontWeight: 600,
                          color: '#fff',
                          margin: '0 0 0.25rem 0',
                          fontSize: '1.125rem',
                        }}
                      >
                        {place.title}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            color: '#fff',
                            fontSize: '0.9375rem',
                          }}
                        >
                          {place.price}₿{' '}
                          <span
                            style={{ color: 'rgba(255,255,255,0.4)' }}
                          >
                            / nuit
                          </span>
                        </span>
                        {count > 0 && (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Star
                              size={14}
                              fill="#fff"
                              style={{ color: '#fff' }}
                            />
                            <span
                              style={{
                                fontSize: '0.875rem',
                                color: '#fff',
                                fontFamily: 'var(--font-body)',
                              }}
                            >
                              {avg}
                            </span>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'rgba(255,255,255,0.4)',
                                fontFamily: 'var(--font-body)',
                              }}
                            >
                              ({count})
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {sorted.length === 0 && (
            <motion.p
              {...fadeUp(0.2)}
              style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                marginTop: '4rem',
                fontSize: '1.125rem',
              }}
            >
              Aucun séjour trouvé.
            </motion.p>
          )}
        </div>
      </div>

      <style>{`
        .plp-container {
          padding: 2rem 1rem 4rem;
        }
        @media (min-width: 768px) {
          .plp-container { padding: 2rem 2rem 4rem; }
        }
        @media (min-width: 1024px) {
          .plp-container { padding: 2rem 4rem 4rem; }
        }

        .plp-section-label {
          font-size: 0.75rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          font-family: var(--font-body);
          font-weight: 400;
          margin-bottom: 1.5rem;
        }

        .plp-heading { font-size: 2.25rem; }
        @media (min-width: 768px) { .plp-heading { font-size: 3rem; } }
        @media (min-width: 1024px) { .plp-heading { font-size: 3.75rem; } }

        .plp-subtitle { font-size: 1rem; }
        @media (min-width: 768px) { .plp-subtitle { font-size: 1.125rem; } }

        .plp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-top: 2rem;
        }
        @media (min-width: 640px) {
          .plp-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .plp-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .plp-card-bg {
          position: absolute;
          inset: 0;
          transition: transform 0.7s ease-out;
        }
        .plp-card:hover .plp-card-bg {
          transform: scale(1.05);
        }

        .plp-stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS};
          animation: plp-twinkle 8s ease-in-out infinite;
        }
        @keyframes plp-twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </div>
  );
}

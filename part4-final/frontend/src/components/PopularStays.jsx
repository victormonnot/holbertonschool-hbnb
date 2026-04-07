import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

// Gradient fallbacks per card index (no images in DB)
const CARD_GRADIENTS = [
  'linear-gradient(135deg, rgba(180,60,60,0.14) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(40,80,180,0.14) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(180,160,100,0.12) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(40,180,160,0.13) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(120,60,180,0.14) 0%, rgba(0,0,0,0.9) 100%)',
  'linear-gradient(135deg, rgba(60,160,80,0.13) 0%, rgba(0,0,0,0.9) 100%)',
];

// Grid placement per card index (desktop)
const GRID_PLACEMENT = [
  { gridColumn: 'span 2', gridRow: 'span 2' },
  { gridColumn: 'span 2', gridRow: 'span 1' },
  { gridColumn: 'span 1', gridRow: 'span 1' },
  { gridColumn: 'span 1', gridRow: 'span 1' },
  { gridColumn: 'span 2', gridRow: 'span 1' },
  { gridColumn: 'span 2', gridRow: 'span 1' },
];

// Stars — medium brightness, good density
const BG_STARS_STATIC = `
  1vw 30px 2px 0px rgba(255,255,255,0.55),
  4vw 150px 1px 0px rgba(255,255,255,0.45),
  7vw 280px 2px 0px rgba(255,255,255,0.40),
  10vw 80px 1px 0px rgba(255,255,255,0.60),
  14vw 200px 2px 0px rgba(255,255,255,0.45),
  17vw 350px 1px 0px rgba(255,255,255,0.40),
  20vw 50px 2px 0px rgba(255,255,255,0.55),
  24vw 170px 1px 0px rgba(255,255,255,0.45),
  27vw 300px 2px 0px rgba(255,255,255,0.40),
  31vw 100px 1px 0px rgba(255,255,255,0.60),
  34vw 230px 2px 0px rgba(255,255,255,0.45),
  37vw 380px 1px 0px rgba(255,255,255,0.40),
  41vw 60px 2px 0px rgba(255,255,255,0.55),
  44vw 190px 1px 0px rgba(255,255,255,0.45),
  47vw 320px 2px 0px rgba(255,255,255,0.40),
  51vw 120px 1px 0px rgba(255,255,255,0.60),
  54vw 250px 2px 0px rgba(255,255,255,0.45),
  57vw 400px 1px 0px rgba(255,255,255,0.40),
  61vw 40px 2px 0px rgba(255,255,255,0.55),
  64vw 180px 1px 0px rgba(255,255,255,0.45),
  67vw 310px 2px 0px rgba(255,255,255,0.40),
  71vw 90px 1px 0px rgba(255,255,255,0.60),
  74vw 210px 2px 0px rgba(255,255,255,0.45),
  77vw 360px 1px 0px rgba(255,255,255,0.40),
  81vw 70px 2px 0px rgba(255,255,255,0.55),
  84vw 240px 1px 0px rgba(255,255,255,0.45),
  87vw 140px 2px 0px rgba(255,255,255,0.40),
  91vw 330px 1px 0px rgba(255,255,255,0.60),
  94vw 50px 2px 0px rgba(255,255,255,0.45),
  97vw 200px 1px 0px rgba(255,255,255,0.40),
  3vw 430px 2px 0px rgba(255,255,255,0.45),
  12vw 470px 1px 0px rgba(255,255,255,0.55),
  22vw 450px 2px 0px rgba(255,255,255,0.40),
  32vw 500px 1px 0px rgba(255,255,255,0.45),
  42vw 480px 2px 0px rgba(255,255,255,0.55),
  52vw 520px 1px 0px rgba(255,255,255,0.40),
  62vw 460px 2px 0px rgba(255,255,255,0.45),
  72vw 510px 1px 0px rgba(255,255,255,0.55),
  82vw 490px 2px 0px rgba(255,255,255,0.40),
  92vw 440px 1px 0px rgba(255,255,255,0.45),
  8vw 570px 2px 0px rgba(255,255,255,0.45),
  26vw 600px 1px 0px rgba(255,255,255,0.40),
  48vw 580px 2px 0px rgba(255,255,255,0.55),
  68vw 560px 1px 0px rgba(255,255,255,0.45),
  86vw 590px 2px 0px rgba(255,255,255,0.40)
`;

const BG_STARS_PULSE1 = `
  6vw 110px 1px 1px rgba(255,255,255,0.8),
  16vw 260px 1px 1px rgba(255,255,255,0.9),
  25vw 45px 1px 1px rgba(255,255,255,0.7),
  36vw 340px 1px 1px rgba(255,255,255,0.8),
  45vw 130px 1px 1px rgba(255,255,255,0.9),
  55vw 290px 1px 1px rgba(255,255,255,0.7),
  65vw 70px 1px 1px rgba(255,255,255,0.8),
  75vw 370px 1px 1px rgba(255,255,255,0.9),
  85vw 160px 1px 1px rgba(255,255,255,0.7),
  95vw 270px 1px 1px rgba(255,255,255,0.8),
  11vw 480px 1px 1px rgba(255,255,255,0.7),
  38vw 530px 1px 1px rgba(255,255,255,0.8),
  58vw 500px 1px 1px rgba(255,255,255,0.9)
`;

const BG_STARS_PULSE2 = `
  10vw 95px 1px 1px rgba(255,255,255,0.9),
  28vw 210px 1px 1px rgba(255,255,255,0.7),
  43vw 160px 1px 1px rgba(255,255,255,0.8),
  61vw 320px 1px 1px rgba(255,255,255,0.9),
  79vw 50px 1px 1px rgba(255,255,255,0.7),
  3vw 450px 1px 1px rgba(255,255,255,0.8),
  22vw 570px 1px 1px rgba(255,255,255,0.9),
  50vw 400px 1px 1px rgba(255,255,255,0.7),
  72vw 540px 1px 1px rgba(255,255,255,0.8),
  89vw 480px 1px 1px rgba(255,255,255,0.9)
`;

const BG_STARS_FAST = `
  15vw 190px 1px 1px rgba(255,255,255,0.9),
  47vw 430px 1px 1px rgba(255,255,255,0.8),
  76vw 280px 1px 1px rgba(255,255,255,0.9),
  33vw 550px 1px 1px rgba(255,255,255,0.8),
  63vw 120px 1px 1px rgba(255,255,255,0.9)
`;

const BG_STARS_BLUE = `
  9vw 140px 1px 1px rgba(100,140,255,0.9),
  23vw 310px 1px 1px rgba(100,140,255,0.8),
  35vw 70px 1px 1px rgba(100,140,255,0.9),
  48vw 240px 1px 1px rgba(100,140,255,0.8),
  60vw 380px 1px 1px rgba(100,140,255,0.9),
  73vw 120px 1px 1px rgba(100,140,255,0.8),
  86vw 280px 1px 1px rgba(100,140,255,0.9),
  18vw 450px 1px 1px rgba(100,140,255,0.7),
  43vw 510px 1px 1px rgba(100,140,255,0.9),
  66vw 470px 1px 1px rgba(100,140,255,0.8),
  90vw 540px 1px 1px rgba(100,140,255,0.7),
  5vw 580px 1px 1px rgba(100,140,255,0.9),
  52vw 560px 1px 1px rgba(100,140,255,0.8),
  81vw 490px 1px 1px rgba(100,140,255,0.7)
`;

export default function PopularStays() {
  const [places, setPlaces] = useState([]);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    fetch('/api/v1/places')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setPlaces(list.slice(0, 6));

        // Fetch reviews for each place
        list.slice(0, 6).forEach((place) => {
          fetch(`/api/v1/places/${place.id}/reviews`)
            .then((res) => res.json())
            .then((revs) => {
              if (Array.isArray(revs)) {
                setReviews((prev) => ({ ...prev, [place.id]: revs }));
              }
            })
            .catch(() => { });
        });
      })
      .catch(() => { });
  }, []);

  const getrating = (placeId) => {
    const revs = reviews[placeId];
    if (!revs || revs.length === 0) return { avg: 0, count: 0 };
    const avg = revs.reduce((sum, r) => sum + r.rating, 0) / revs.length;
    return { avg: Math.round(avg * 10) / 10, count: revs.length };
  };

  if (places.length === 0) return null;

  return (
    <section
      style={{
        background: '#040710',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric background — colored nebula glows */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Top fade — dissolves from pure bg into atmosphere */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to bottom, #040710 0%, transparent 100%)',
            zIndex: 2,
          }}
        />
        {/* Primary glow — center top (matching section 2) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 90% 60% at 50% 30%, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Secondary glow — bottom right asymmetry (matching section 2) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 50% at 80% 75%, rgba(255,255,255,0.04) 0%, transparent 50%)',
          }}
        />
        {/* Star layers — 5 layers matching section 2 */}
        <div className="ps-stars-static" />
        <div className="ps-stars-pulse1" />
        <div className="ps-stars-pulse2" />
        <div className="ps-stars-fast" />
        <div className="ps-stars-blue" />
        {/* Noise texture */}
        <div className="ps-noise" />
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
        className="ps-container"
      >
        {/* Header — left aligned */}
        <div>
          <motion.p
            {...fadeUp(0)}
            style={{
              fontSize: '0.75rem',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              marginBottom: '1.5rem',
            }}
          >
            SÉJOURS POPULAIRES
          </motion.p>

          <motion.h2
            {...fadeUp(0.1)}
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-2px',
              color: '#fff',
              margin: 0,
            }}
            className="ps-heading"
          >
            Nos hébergements les plus demandés à travers le{' '}
            <span
              style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
              }}
            >
              système solaire.
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              maxWidth: '36rem',
              marginTop: '1rem',
            }}
            className="ps-subtitle"
          >
            Explorez les séjours qui font rêver les voyageurs interstellaires.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="ps-grid">
          {places.map((place, i) => {
            const { avg, count } = getrating(place.id);
            const isLarge = i === 0;
            return (
              <motion.div
                key={place.id}
                {...fadeUp(0.1 + i * 0.1)}
                className="ps-card"
                style={{
                  ...GRID_PLACEMENT[i],
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: isLarge ? '460px' : '220px',
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
                    className="ps-card-bg"
                    style={{
                      background: place.image_url
                        ? `url(${place.image_url}) center/cover no-repeat`
                        : CARD_GRADIENTS[i] || CARD_GRADIENTS[0],
                    }}
                  />

                  {/* Bottom gradient overlay */}
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
                      zIndex: 20,
                    }}
                    className="ps-card-content"
                  >
                    {/* Badge for first place */}
                    {i === 0 && (
                      <span
                        className="liquid-glass"
                        style={{
                          display: 'inline-block',
                          borderRadius: '9999px',
                          padding: '0.25rem 0.75rem',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                          color: 'rgba(255,255,255,0.7)',
                          fontFamily: 'var(--font-body)',
                          marginBottom: '0.75rem',
                        }}
                      >
                        Populaire
                      </span>
                    )}

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        color: '#fff',
                        margin: '0 0 0.25rem 0',
                        fontSize: isLarge ? '1.5rem' : undefined,
                      }}
                      className={isLarge ? '' : 'ps-card-title'}
                    >
                      {place.title}
                    </h3>

                    {/* Bottom row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      {/* Price */}
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: '#fff',
                        }}
                        className="ps-card-price"
                      >
                        {place.price}₿{' '}
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                          / nuit
                        </span>
                      </span>

                      {/* Rating */}
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

                    {/* Hover button */}
                    <div className="ps-card-hover-btn">
                      <a
                        href="#"
                        className="liquid-glass-strong"
                        style={{
                          display: 'inline-block',
                          borderRadius: '9999px',
                          padding: '0.5rem 1.25rem',
                          fontSize: '0.875rem',
                          fontFamily: 'var(--font-body)',
                          color: '#fff',
                          textDecoration: 'none',
                          marginTop: '0.75rem',
                        }}
                      >
                        Réserver
                      </a>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          {...fadeUp(0.7)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '3rem',
          }}
        >
          <Link
            to="/places"
            className="ps-cta-link"
            style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#fff')}
            onMouseLeave={(e) =>
              (e.target.style.color = 'rgba(255,255,255,0.5)')
            }
          >
            Voir tous les séjours →
          </Link>
        </motion.div>
      </div>

      <style>{`
        .ps-container {
          padding: 8rem 1rem;
        }
        @media (min-width: 768px) {
          .ps-container {
            padding: 11rem 2rem;
          }
        }
        @media (min-width: 1024px) {
          .ps-container {
            padding: 11rem 4rem;
          }
        }

        .ps-heading {
          font-size: 2.25rem;
        }
        @media (min-width: 768px) {
          .ps-heading {
            font-size: 3rem;
          }
        }
        @media (min-width: 1024px) {
          .ps-heading {
            font-size: 3.75rem;
          }
        }

        .ps-subtitle {
          font-size: 1rem;
        }
        @media (min-width: 768px) {
          .ps-subtitle {
            font-size: 1.125rem;
          }
        }

        .ps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 4rem;
        }
        @media (min-width: 768px) {
          .ps-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
          }
        }

        /* On mobile, remove grid placement spans */
        @media (max-width: 767px) {
          .ps-card {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            min-height: 260px !important;
          }
        }

        .ps-card-bg {
          position: absolute;
          inset: 0;
          transition: transform 0.7s ease-out;
        }

        .ps-card:hover .ps-card-bg {
          transform: scale(1.05);
        }

        .ps-card-content {
          padding: 1.25rem;
          text-shadow: 0 1px 4px rgba(0,0,0,0.7), 0 2px 12px rgba(0,0,0,0.5);
        }
        @media (min-width: 768px) {
          .ps-card-content {
            padding: 1.5rem;
          }
        }

        .ps-card-title {
          font-size: 1.125rem;
        }
        @media (min-width: 768px) {
          .ps-card-title {
            font-size: 1.25rem;
          }
        }

        .ps-card-location {
          font-size: 0.75rem;
        }
        @media (min-width: 768px) {
          .ps-card-location {
            font-size: 0.875rem;
          }
        }

        .ps-card-price {
          font-size: 0.875rem;
        }
        @media (min-width: 768px) {
          .ps-card-price {
            font-size: 1rem;
          }
        }

        .ps-card-hover-btn {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s, transform 0.3s;
        }

        .ps-card:hover .ps-card-hover-btn {
          opacity: 1;
          transform: translateY(0);
        }


        /* Stars — static layer */
        .ps-stars-static {
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS_STATIC};
        }
        /* Stars — pulse layer 1 */
        .ps-stars-pulse1 {
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS_PULSE1};
          animation: ps-pulse 8s ease-in-out infinite;
        }
        /* Stars — pulse layer 2 (offset rhythm) */
        .ps-stars-pulse2 {
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS_PULSE2};
          animation: ps-pulse 10s ease-in-out infinite;
        }
        /* Stars — fast pulse (few) */
        .ps-stars-fast {
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS_FAST};
          animation: ps-pulse 4s ease-in-out infinite;
        }
        /* Stars — blue accent */
        .ps-stars-blue {
          position: absolute;
          top: 0; left: 0;
          width: 1px; height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS_BLUE};
          animation: ps-pulse 12s ease-in-out infinite;
        }
        /* Noise texture */
        .ps-noise {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
        }

        @keyframes ps-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

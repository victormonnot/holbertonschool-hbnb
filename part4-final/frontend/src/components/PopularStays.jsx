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

const BG_STARS_PULSE = `
  6vw 110px 2px 0px rgba(255,255,255,0.55),
  16vw 260px 1px 0px rgba(255,255,255,0.45),
  25vw 45px 2px 0px rgba(255,255,255,0.60),
  36vw 340px 1px 0px rgba(255,255,255,0.45),
  45vw 130px 2px 0px rgba(255,255,255,0.55),
  55vw 290px 1px 0px rgba(255,255,255,0.45),
  65vw 70px 2px 0px rgba(255,255,255,0.60),
  75vw 370px 1px 0px rgba(255,255,255,0.45),
  85vw 160px 2px 0px rgba(255,255,255,0.55),
  95vw 270px 1px 0px rgba(255,255,255,0.45),
  11vw 480px 2px 0px rgba(255,255,255,0.45),
  38vw 530px 1px 0px rgba(255,255,255,0.55),
  58vw 500px 2px 0px rgba(255,255,255,0.45),
  79vw 550px 1px 0px rgba(255,255,255,0.55)
`;

const BG_STARS_BLUE = `
  9vw 140px 2px 0px rgba(80,130,220,0.55),
  23vw 310px 2px 0px rgba(60,160,120,0.45),
  35vw 70px 2px 0px rgba(80,130,220,0.50),
  48vw 240px 2px 0px rgba(60,160,120,0.40),
  60vw 380px 2px 0px rgba(80,130,220,0.50),
  73vw 120px 2px 0px rgba(60,160,120,0.45),
  86vw 280px 2px 0px rgba(80,130,220,0.55),
  18vw 450px 2px 0px rgba(60,160,120,0.40),
  43vw 510px 2px 0px rgba(80,130,220,0.50),
  66vw 470px 2px 0px rgba(60,160,120,0.45),
  90vw 540px 2px 0px rgba(80,130,220,0.40)
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
            .catch(() => {});
        });
      })
      .catch(() => {});
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
        {/* Primary glow — cold blue, top-left */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 90% 70% at 20% 25%, rgba(30,70,160,0.22) 0%, transparent 60%)',
          }}
        />
        {/* Secondary glow — green, bottom-right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 80% 75%, rgba(30,160,80,0.16) 0%, transparent 55%)',
          }}
        />
        {/* Tertiary — blue-green blend, center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 55% 50%, rgba(25,120,130,0.10) 0%, transparent 45%)',
          }}
        />
        {/* Edge glow behind Card 1 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 25% 50%, rgba(40,90,170,0.14) 0%, transparent 40%)',
          }}
        />
        {/* Star layers */}
        <div className="ps-stars-static" />
        <div className="ps-stars-pulse" />
        <div className="ps-stars-blue" />
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
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS_STATIC};
        }

        /* Stars — slow pulse layer */
        .ps-stars-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS_PULSE};
          animation: ps-twinkle 10s ease-in-out infinite;
        }

        /* Stars — colored accent layer */
        .ps-stars-blue {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${BG_STARS_BLUE};
          animation: ps-twinkle-slow 12s ease-in-out infinite;
        }

        @keyframes ps-twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes ps-twinkle-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}

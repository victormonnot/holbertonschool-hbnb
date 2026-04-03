import { motion } from 'motion/react';
import { MapPin, Rocket, Sparkles } from 'lucide-react';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const STEPS = [
  {
    number: '01',
    icon: MapPin,
    title: 'Choisissez votre destination',
    description:
      'Mars, la Lune, stations orbitales ou les lunes de Jupiter — parcourez notre catalogue et trouvez le séjour qui vous correspond.',
    delay: 0.1,
  },
  {
    number: '02',
    icon: Rocket,
    title: 'Préparez votre embarquement',
    description:
      'Vérification médicale, briefing de vol et configuration de votre capsule — notre équipe vous accompagne à chaque étape.',
    delay: 0.25,
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Décollage & séjour',
    description:
      'Embarquez en toute sérénité et profitez d\u2019une expérience inoubliable. Support 24/7, même à 225 millions de km.',
    delay: 0.4,
  },
];

// CSS-only star field: ~45 stars scattered via box-shadow
// Layer 1 — static stars (always visible)
const STARS_STATIC = `
  3vw 60px 1px 0px rgba(255,255,255,0.6),
  12vw 180px 0px 0px rgba(255,255,255,0.4),
  22vw 40px 1px 0px rgba(255,255,255,0.7),
  31vw 250px 0px 0px rgba(255,255,255,0.3),
  42vw 110px 1px 0px rgba(255,255,255,0.5),
  55vw 200px 0px 0px rgba(255,255,255,0.4),
  63vw 55px 1px 0px rgba(255,255,255,0.6),
  74vw 170px 0px 0px rgba(255,255,255,0.3),
  85vw 90px 1px 0px rgba(255,255,255,0.5),
  93vw 230px 0px 0px rgba(255,255,255,0.4),
  7vw 350px 0px 0px rgba(255,255,255,0.5),
  18vw 430px 1px 0px rgba(255,255,255,0.4),
  28vw 380px 0px 0px rgba(255,255,255,0.3),
  38vw 480px 1px 0px rgba(255,255,255,0.6),
  48vw 340px 0px 0px rgba(255,255,255,0.4),
  58vw 450px 1px 0px rgba(255,255,255,0.5),
  68vw 370px 0px 0px rgba(255,255,255,0.3),
  78vw 500px 1px 0px rgba(255,255,255,0.6),
  88vw 410px 0px 0px rgba(255,255,255,0.4),
  96vw 360px 0px 0px rgba(255,255,255,0.5),
  5vw 600px 1px 0px rgba(255,255,255,0.4),
  15vw 700px 0px 0px rgba(255,255,255,0.5),
  25vw 650px 1px 0px rgba(255,255,255,0.3),
  35vw 750px 0px 0px rgba(255,255,255,0.6),
  45vw 580px 0px 0px rgba(255,255,255,0.4),
  56vw 720px 1px 0px rgba(255,255,255,0.5),
  66vw 630px 0px 0px rgba(255,255,255,0.3),
  76vw 780px 1px 0px rgba(255,255,255,0.4),
  86vw 670px 0px 0px rgba(255,255,255,0.6),
  94vw 740px 1px 0px rgba(255,255,255,0.4),
  10vw 880px 0px 0px rgba(255,255,255,0.5),
  20vw 950px 1px 0px rgba(255,255,255,0.3),
  33vw 830px 0px 0px rgba(255,255,255,0.4),
  50vw 910px 1px 0px rgba(255,255,255,0.6),
  70vw 860px 0px 0px rgba(255,255,255,0.5),
  82vw 940px 1px 0px rgba(255,255,255,0.3),
  91vw 800px 0px 0px rgba(255,255,255,0.4)
`;

// Layer 2 — pulsing stars (slow twinkle)
const STARS_PULSE1 = `
  8vw 120px 1px 1px rgba(255,255,255,0.8),
  26vw 300px 1px 1px rgba(255,255,255,0.9),
  44vw 70px 1px 1px rgba(255,255,255,0.7),
  62vw 280px 1px 1px rgba(255,255,255,0.8),
  80vw 150px 1px 1px rgba(255,255,255,0.9),
  16vw 520px 1px 1px rgba(255,255,255,0.7),
  40vw 620px 1px 1px rgba(255,255,255,0.8),
  60vw 490px 1px 1px rgba(255,255,255,0.9),
  84vw 560px 1px 1px rgba(255,255,255,0.7),
  30vw 820px 1px 1px rgba(255,255,255,0.8),
  52vw 770px 1px 1px rgba(255,255,255,0.9),
  72vw 900px 1px 1px rgba(255,255,255,0.7),
  92vw 850px 1px 1px rgba(255,255,255,0.8)
`;

// Layer 3 — pulsing stars offset (different rhythm)
const STARS_PULSE2 = `
  17vw 95px 1px 1px rgba(255,255,255,0.9),
  36vw 210px 1px 1px rgba(255,255,255,0.7),
  53vw 160px 1px 1px rgba(255,255,255,0.8),
  71vw 320px 1px 1px rgba(255,255,255,0.9),
  90vw 50px 1px 1px rgba(255,255,255,0.7),
  4vw 450px 1px 1px rgba(255,255,255,0.8),
  24vw 570px 1px 1px rgba(255,255,255,0.9),
  47vw 400px 1px 1px rgba(255,255,255,0.7),
  75vw 680px 1px 1px rgba(255,255,255,0.8),
  13vw 750px 1px 1px rgba(255,255,255,0.9),
  43vw 870px 1px 1px rgba(255,255,255,0.7),
  64vw 810px 1px 1px rgba(255,255,255,0.8),
  87vw 730px 1px 1px rgba(255,255,255,0.9)
`;

// Layer 4 — fast pulsing stars (few)
const STARS_FAST = `
  19vw 190px 1px 1px rgba(255,255,255,0.9),
  57vw 430px 1px 1px rgba(255,255,255,0.8),
  81vw 680px 1px 1px rgba(255,255,255,0.9),
  38vw 850px 1px 1px rgba(255,255,255,0.8),
  69vw 120px 1px 1px rgba(255,255,255,0.9)
`;

// Layer 5 — blue accent stars (matching separator glow)
const STARS_BLUE = `
  14vw 310px 1px 1px rgba(100,140,255,0.9),
  46vw 140px 1px 1px rgba(100,140,255,0.8),
  73vw 530px 1px 1px rgba(100,140,255,0.9),
  29vw 720px 1px 1px rgba(100,140,255,0.8),
  88vw 380px 1px 1px rgba(100,140,255,0.9),
  55vw 890px 1px 1px rgba(100,140,255,0.8),
  8vw 470px 1px 1px rgba(100,140,255,0.7),
  37vw 60px 1px 1px rgba(100,140,255,0.9),
  62vw 750px 1px 1px rgba(100,140,255,0.8),
  83vw 200px 1px 1px rgba(100,140,255,0.7),
  21vw 580px 1px 1px rgba(100,140,255,0.9),
  95vw 650px 1px 1px rgba(100,140,255,0.8),
  50vw 420px 1px 1px rgba(100,140,255,0.7),
  3vw 830px 1px 1px rgba(100,140,255,0.9)
`;

export default function HowItWorks() {
  return (
    <section
      style={{
        background: '#040710',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sci-fi separator line at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 5,
        }}
      >
        <div className="separator-glow" />
      </div>

      {/* Atmospheric background layers */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Primary glow — center top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 90% 60% at 50% 30%, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Secondary glow — bottom right asymmetry */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 50% at 80% 75%, rgba(255,255,255,0.04) 0%, transparent 50%)',
          }}
        />
        {/* Star field — 5 layers */}
        <div className="hiw-stars-static" />
        <div className="hiw-stars-pulse1" />
        <div className="hiw-stars-pulse2" />
        <div className="hiw-stars-fast" />
        <div className="hiw-stars-blue" />
        {/* Noise texture */}
        <div className="hiw-noise" />
        {/* Bottom fade — dissolves atmosphere into pure bg */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to bottom, transparent 0%, #040710 100%)',
            zIndex: 2,
          }}
        />
      </div>

      {/* Content — above background */}
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
        className="hiw-container"
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <motion.p
            {...fadeUp(0)}
            style={{
              fontSize: '0.75rem',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              marginBottom: '1.5rem',
            }}
          >
            COMMENT ÇA MARCHE
          </motion.p>

          <motion.h2
            {...fadeUp(0.1)}
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-2px',
              color: '#fff',
              textAlign: 'center',
              margin: 0,
            }}
            className="hiw-heading"
          >
            Trois étapes vers les{' '}
            <span
              style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
              }}
            >
              étoiles
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              maxWidth: '36rem',
              margin: '1rem auto 0',
              textAlign: 'center',
            }}
            className="hiw-subtitle"
          >
            De la réservation au décollage, chaque détail est pensé pour vous.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            position: 'relative',
            marginTop: '5rem',
          }}
        >
          {/* Connecting dashed line — desktop only */}
          <div className="hiw-connecting-line" />

          <div className="hiw-grid">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  {...fadeUp(step.delay)}
                  className="liquid-glass hiw-card"
                  style={{
                    borderRadius: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 10,
                    transition: 'transform 0.3s',
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Ghost number */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1.5rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      color: 'rgba(255, 255, 255, 0.03)',
                      lineHeight: 1,
                      pointerEvents: 'none',
                    }}
                    className="hiw-ghost-number"
                  >
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div
                    className="liquid-glass"
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      color: '#fff',
                      marginBottom: '0.75rem',
                    }}
                    className="hiw-card-title"
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      lineHeight: 1.7,
                    }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom pill */}
        <motion.div
          {...fadeUp(0.6)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '4rem',
          }}
        >
          <span
            className="liquid-glass"
            style={{
              borderRadius: '9999px',
              padding: '0.625rem 1.5rem',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Temps moyen de réservation : 4 minutes
          </span>
        </motion.div>
      </div>

      <style>{`
        .hiw-container {
          padding: 8rem 1rem;
        }
        @media (min-width: 768px) {
          .hiw-container {
            padding: 11rem 2rem;
          }
        }
        @media (min-width: 1024px) {
          .hiw-container {
            padding: 11rem 4rem;
          }
        }

        .hiw-heading {
          font-size: 2.25rem;
        }
        @media (min-width: 768px) {
          .hiw-heading {
            font-size: 3rem;
          }
        }
        @media (min-width: 1024px) {
          .hiw-heading {
            font-size: 3.75rem;
          }
        }

        .hiw-subtitle {
          font-size: 1rem;
        }
        @media (min-width: 768px) {
          .hiw-subtitle {
            font-size: 1.125rem;
          }
        }

        .hiw-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 768px) {
          .hiw-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        .hiw-card {
          padding: 2rem;
        }
        @media (min-width: 768px) {
          .hiw-card {
            padding: 2.5rem;
          }
        }

        .hiw-ghost-number {
          font-size: 3.75rem;
        }
        @media (min-width: 768px) {
          .hiw-ghost-number {
            font-size: 4.375rem;
          }
        }

        .hiw-card-title {
          font-size: 1.125rem;
          margin: 0;
        }
        @media (min-width: 768px) {
          .hiw-card-title {
            font-size: 1.25rem;
          }
        }

        .hiw-connecting-line {
          display: none;
        }
        @media (min-width: 768px) {
          .hiw-connecting-line {
            display: block;
            position: absolute;
            top: 50%;
            left: 5%;
            right: 5%;
            height: 0;
            border-top: 1px dashed rgba(255, 255, 255, 0.1);
            z-index: 0;
            transform: translateY(-50%);
            pointer-events: none;
          }
        }

        /* Star layers */
        .hiw-stars-static,
        .hiw-stars-pulse1,
        .hiw-stars-pulse2,
        .hiw-stars-fast,
        .hiw-stars-blue {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
        }

        .hiw-stars-static {
          box-shadow: ${STARS_STATIC};
        }

        .hiw-stars-pulse1 {
          box-shadow: ${STARS_PULSE1};
          animation: hiw-twinkle1 6s ease-in-out infinite;
        }

        .hiw-stars-pulse2 {
          box-shadow: ${STARS_PULSE2};
          animation: hiw-twinkle2 8s ease-in-out infinite;
        }

        @keyframes hiw-twinkle1 {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes hiw-twinkle2 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .hiw-stars-fast {
          box-shadow: ${STARS_FAST};
          animation: hiw-twinkle-fast 2.5s ease-in-out infinite;
        }

        .hiw-stars-blue {
          box-shadow: ${STARS_BLUE};
          animation: hiw-twinkle-blue 5s ease-in-out infinite;
        }

        @keyframes hiw-twinkle-fast {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        @keyframes hiw-twinkle-blue {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* Separator glow */
        .separator-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40%;
          height: 1px;
          background: radial-gradient(ellipse at center, rgba(100,140,255,0.7) 0%, transparent 70%);
          box-shadow: 0 0 15px 2px rgba(100,140,255,0.25), 0 0 40px 5px rgba(100,140,255,0.12);
          animation: separator-pulse 4s ease-in-out infinite;
        }

        @keyframes separator-pulse {
          0%, 100% { opacity: 0.5; box-shadow: 0 0 15px 2px rgba(100,140,255,0.25), 0 0 40px 5px rgba(100,140,255,0.12); }
          50% { opacity: 1; box-shadow: 0 0 20px 4px rgba(100,140,255,0.4), 0 0 60px 8px rgba(100,140,255,0.18); }
        }

        /* Noise texture via SVG data URI */
        .hiw-noise {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}

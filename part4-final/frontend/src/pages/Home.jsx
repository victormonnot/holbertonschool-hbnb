import { motion } from 'motion/react';
import { ArrowUpRight, Play } from 'lucide-react';
import BlurText from '../components/BlurText';
import Navbar from '../components/Navbar';
import HowItWorks from '../components/HowItWorks';
import PopularStays from '../components/PopularStays';
import Footer from '../components/Footer';

const PARTNERS = ['Airbus', 'Holberton', 'HugoVps', 'SosoCorp', 'SpaceX'];

export default function Home() {
  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'right bottom',
            zIndex: 0,
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
            type="video/mp4"
          />
        </video>

        {/* Black Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.05)',
            zIndex: 1,
          }}
        />

        {/* Content Layer */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Navbar />

          {/* Hero Content */}
          <main
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '6rem 2rem 0',
              maxWidth: '80rem',
              width: '100%',
              margin: '0 auto',
            }}
            className="hero-main"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="liquid-glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '9999px',
                padding: '0.375rem 1rem',
                width: 'fit-content',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  background: '#fff',
                  color: '#000',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Nouveau
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                }}
              >
                Premiers séjours habités sur Mars dès 2026
              </span>
            </motion.div>

            {/* Headline */}
            <div style={{ marginBottom: '1.5rem' }}>
              <BlurText
                text="Séjournez Au-Delà"
                className="hero-heading"
                delay={0.1}
                animateBy="words"
                direction="bottom"
              />
              <BlurText
                text="Des Étoiles"
                className="hero-heading"
                delay={0.5}
                animateBy="words"
                direction="bottom"
              />
            </div>

            {/* Subheading */}
            <motion.p
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                maxWidth: '36rem',
                color: '#fff',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
              className="hero-sub"
            >
              Découvrez des hébergements uniques à travers le système solaire.
              Nos habitats pressurisés et notre ingénierie de pointe rendent le
              séjour spatial accessible — sûr et extraordinaire.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginTop: '1rem',
              }}
              className="hero-cta"
            >
              <a
                href="#sejours"
                className="liquid-glass-strong"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '9999px',
                  padding: '0.75rem 1.75rem',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.03)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                Explorer les séjours
                <ArrowUpRight size={18} />
              </a>

              <a
                href="https://www.nasa.gov/mission/artemis-ii/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = '0.8')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = '1')
                }
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <Play size={12} fill="#fff" />
                </span>
                Voir le décollage
              </a>
            </motion.div>
          </main>

          {/* Partners Bar */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              paddingBottom: '2rem',
            }}
          >
            <span
              className="liquid-glass"
              style={{
                borderRadius: '9999px',
                padding: '0.375rem 1rem',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-body)',
              }}
            >
              En partenariat avec les pionniers de l'aérospatiale
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {PARTNERS.map((name) => (
                <span
                  key={name}
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                    color: '#fff',
                  }}
                  className="partner-name"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.footer>
        </div>

        <style>{`
          .hero-heading {
            font-family: var(--font-heading);
            letter-spacing: -4px;
            line-height: 0.8;
            color: #fff;
            font-size: 3.75rem;
          }
          @media (min-width: 768px) {
            .hero-heading { font-size: 4.375rem; }
          }
          @media (min-width: 1024px) {
            .hero-heading { font-size: 5.5rem; }
          }
          .hero-sub { font-size: 0.875rem; }
          @media (min-width: 768px) {
            .hero-sub { font-size: 1rem; }
          }
          .hero-main { padding-left: 1rem; padding-right: 1rem; }
          @media (min-width: 768px) {
            .hero-main { padding-left: 2rem; padding-right: 2rem; }
          }
          @media (min-width: 1024px) {
            .hero-main { padding-left: 4rem; padding-right: 4rem; }
          }
          .hero-cta { flex-direction: column; }
          @media (min-width: 640px) {
            .hero-cta { flex-direction: row; }
          }
          .partner-name { font-size: 1.5rem; }
          @media (min-width: 768px) {
            .partner-name { font-size: 1.875rem; }
          }
        `}</style>
      </div>

      <HowItWorks />
      <div id="sejours">
        <PopularStays />
      </div>
      <Footer />
    </>
  );
}

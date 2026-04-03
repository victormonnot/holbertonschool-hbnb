import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const PAGES = {
  confidentialite: {
    title: 'Confidentialit\u00e9',
    subtitle: 'Politique de protection des donn\u00e9es personnelles',
    sections: [
      {
        heading: 'Collecte des donn\u00e9es',
        text: "HolByNB collecte uniquement les donn\u00e9es n\u00e9cessaires au bon fonctionnement de la plateforme : nom, pr\u00e9nom, adresse email et informations de r\u00e9servation. Aucune donn\u00e9e n'est collect\u00e9e \u00e0 votre insu.",
      },
      {
        heading: 'Utilisation des donn\u00e9es',
        text: "Vos donn\u00e9es sont utilis\u00e9es exclusivement pour g\u00e9rer votre compte, traiter vos r\u00e9servations et am\u00e9liorer votre exp\u00e9rience sur la plateforme. Nous ne vendons ni ne partageons vos informations personnelles avec des tiers \u00e0 des fins commerciales.",
      },
      {
        heading: 'Stockage et s\u00e9curit\u00e9',
        text: "Vos donn\u00e9es sont stock\u00e9es sur des serveurs s\u00e9curis\u00e9s et chiffr\u00e9es en transit et au repos. Les mots de passe sont hach\u00e9s et ne sont jamais stock\u00e9s en clair. Nous appliquons les meilleures pratiques en mati\u00e8re de cybers\u00e9curit\u00e9.",
      },
      {
        heading: 'Vos droits',
        text: "Conform\u00e9ment au RGPD, vous disposez d'un droit d'acc\u00e8s, de rectification, de suppression et de portabilit\u00e9 de vos donn\u00e9es. Pour exercer ces droits, contactez-nous \u00e0 privacy@holbynb.space.",
      },
    ],
  },
  conditions: {
    title: 'Conditions g\u00e9n\u00e9rales',
    subtitle: "Conditions d'utilisation de la plateforme HolByNB",
    sections: [
      {
        heading: 'Acceptation des conditions',
        text: "En acc\u00e9dant \u00e0 la plateforme HolByNB, vous acceptez les pr\u00e9sentes conditions g\u00e9n\u00e9rales d'utilisation dans leur int\u00e9gralit\u00e9. Si vous n'\u00eates pas d'accord, veuillez ne pas utiliser nos services.",
      },
      {
        heading: 'Inscription et compte',
        text: "L'utilisateur s'engage \u00e0 fournir des informations exactes lors de son inscription. Chaque compte est personnel et ne peut \u00eatre c\u00e9d\u00e9 \u00e0 un tiers. L'utilisateur est responsable de la confidentialit\u00e9 de ses identifiants.",
      },
      {
        heading: 'R\u00e9servations',
        text: "Toute r\u00e9servation effectu\u00e9e sur HolByNB constitue un accord entre le voyageur et l'h\u00f4te. HolByNB agit en tant qu'interm\u00e9diaire et ne peut \u00eatre tenu responsable des conditions d'h\u00e9bergement. Les annulations sont soumises \u00e0 la politique de chaque h\u00f4te.",
      },
      {
        heading: 'Responsabilit\u00e9',
        text: "HolByNB d\u00e9cline toute responsabilit\u00e9 en cas de dysfonctionnement li\u00e9 aux conditions spatiales (temp\u00eates solaires, micro-m\u00e9t\u00e9orites, anomalies gravitationnelles). Les voyageurs sont tenus de souscrire une assurance voyage intersid\u00e9rale.",
      },
      {
        heading: 'Propri\u00e9t\u00e9 intellectuelle',
        text: "L'ensemble du contenu de la plateforme (textes, images, logos, design) est la propri\u00e9t\u00e9 exclusive de HolByNB. Toute reproduction sans autorisation pr\u00e9alable est interdite.",
      },
    ],
  },
  cookies: {
    title: 'Cookies',
    subtitle: 'Politique relative aux cookies et traceurs',
    sections: [
      {
        heading: "Qu'est-ce qu'un cookie ?",
        text: "Un cookie est un petit fichier texte stock\u00e9 sur votre appareil lors de votre visite sur notre plateforme. Il permet de m\u00e9moriser vos pr\u00e9f\u00e9rences et d'am\u00e9liorer votre navigation.",
      },
      {
        heading: 'Cookies essentiels',
        text: "Ces cookies sont n\u00e9cessaires au fonctionnement de la plateforme : authentification, s\u00e9curit\u00e9, pr\u00e9f\u00e9rences de session. Ils ne peuvent pas \u00eatre d\u00e9sactiv\u00e9s.",
      },
      {
        heading: 'Cookies analytiques',
        text: "Nous utilisons des cookies analytiques pour comprendre comment les visiteurs interagissent avec la plateforme. Ces donn\u00e9es sont anonymis\u00e9es et nous aident \u00e0 am\u00e9liorer nos services.",
      },
      {
        heading: 'G\u00e9rer vos pr\u00e9f\u00e9rences',
        text: "Vous pouvez \u00e0 tout moment modifier vos pr\u00e9f\u00e9rences en mati\u00e8re de cookies via les param\u00e8tres de votre navigateur. La d\u00e9sactivation de certains cookies peut affecter votre exp\u00e9rience de navigation.",
      },
    ],
  },
};

export default function Legal() {
  const { page } = useParams();
  const data = PAGES[page];

  if (!data) {
    return (
      <div style={{ background: '#040710', minHeight: '100vh', color: '#fff' }}>
        <Navbar />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Page introuvable.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: '#040710', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          width: '100%',
        }}
        className="legal-container"
      >
        <motion.div {...fadeUp(0)}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
              marginBottom: '2rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')
            }
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
        </motion.div>

        <motion.div {...fadeUp(0.05)} style={{ marginBottom: '3rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-2px',
              color: '#fff',
              margin: 0,
              fontSize: '2.5rem',
            }}
          >
            {data.title}
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              marginTop: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            {data.subtitle}
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.25)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              marginTop: '0.25rem',
              fontSize: '0.75rem',
            }}
          >
            Derni\u00e8re mise \u00e0 jour : 1er avril 2026
          </p>
        </motion.div>

        {data.sections.map((section, i) => (
          <motion.div
            key={i}
            {...fadeUp(0.1 + i * 0.05)}
            style={{
              marginBottom: '2.5rem',
              borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              paddingTop: i > 0 ? '2.5rem' : 0,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                color: '#fff',
                fontSize: '1.125rem',
                marginBottom: '0.75rem',
              }}
            >
              {section.heading}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                lineHeight: 1.7,
                fontSize: '0.875rem',
              }}
            >
              {section.text}
            </p>
          </motion.div>
        ))}
      </div>

      <Footer />

      <style>{`
        .legal-container {
          padding: 0 1rem 4rem;
        }
        @media (min-width: 768px) {
          .legal-container { padding: 0 2rem 4rem; }
        }
      `}</style>
    </div>
  );
}

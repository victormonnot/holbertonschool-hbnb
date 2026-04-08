import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Star, Check, User, ArrowLeft, Send, Trash2,
  Orbit, Eye, Wind, Wifi, Sparkles, ChefHat,
} from 'lucide-react';

const AMENITY_ICONS = {
  'gravité artificielle': Orbit,
  'vue panoramique': Eye,
  'oxygène premium': Wind,
  'wi-fi quantique': Wifi,
  'spa zéro-g': Sparkles,
  'cuisine moléculaire': ChefHat,
};

const getAmenityIcon = (name) => {
  const Icon = AMENITY_ICONS[name.toLowerCase()] || Check;
  return <Icon size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />;
};

const HOST_AVATARS = {
  'elon@spacestays.io': '/images/avatar-elon.jpg',
  'aria@spacestays.io': '/images/avatar-aria.jpg',
};

// ============================================================
// 📸 GALLERY CONFIG — Add your images here!
// Put your files in: part4-final/frontend/public/images/
// Then reference them as '/images/your-file.jpg'
// ============================================================
const PLACE_GALLERY = {
  // Use the place title as the key (case-insensitive match)
  'dôme olympus — panorama sur mars': [
    '/images/mars.jpg',
    '/images/mars2.jpg',
    '/images/mars3.jpg',
    '/images/mars4.jpg',
    // Add more: '/images/mars-interior.jpg', '/images/mars-view.jpg',
  ],
  'station orbitale sérénité': [
    '/images/orbital.jpg',
    '/images/orbital2.jpg',
    '/images/orbital3.jpg',
    '/images/orbital4.jpg',
    '/images/orbital5.jpg',
    '/images/orbital6.jpg',
  ],
  'capsule lunaire tranquility': [
    '/images/moon.jpg',
    '/images/moon2.jpg',
    '/images/moon3.jpg',
  ],
  'habitat europa — sous la glace': [
    '/images/europa.jpg',
    '/images/europa2.jpg',
    '/images/europa3.jpg',
    '/images/europa4.jpg',
    '/images/europa5.jpg',
  ],
  'nébuleuse lounge titan': [
    '/images/titan.jpg',
    '/images/titan2.jpg',
    '/images/titan3.jpg',
    '/images/titan4.jpg',
  ],
  'avant-poste vénus cloud9': [
    '/images/venus.jpg',
    '/images/venus2.jpg',
    '/images/venus3.jpg',
  ],
};

// ============================================================
// 🎬 VIDEO CONFIG — Add your videos here!
// Supports .mp4 and .gif  |  Put files in public/images/
// ============================================================
const PLACE_VIDEOS = {
  // 'dôme olympus — panorama sur mars': '/images/mars-tour.mp4',
  // 'station orbitale sérénité': '/images/orbital-tour.gif',
  'station orbitale sérénité': '/images/orbital.mp4',
  'capsule lunaire tranquility': '/images/moon.mp4',
  'habitat europa — sous la glace': '/images/europa.mp4',
  'nébuleuse lounge titan': '/images/titan.mp4',
  'avant-poste vénus cloud9': '/images/venus.mp4',
  'dôme olympus — panorama sur mars': '/images/mars.mp4',
};

function getPlaceGallery(title, fallbackImage) {
  const key = (title || '').toLowerCase();
  const gallery = PLACE_GALLERY[key];
  if (gallery && gallery.length > 0) return gallery;
  return fallbackImage ? [fallbackImage] : [];
}

function getPlaceVideo(title) {
  const key = (title || '').toLowerCase();
  return PLACE_VIDEOS[key] || null;
}
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

// Gradient fallbacks based on place index or description keywords
const GRADIENT_MAP = [
  'linear-gradient(135deg, rgba(180,60,60,0.15) 0%, #000 100%)',
  'linear-gradient(135deg, rgba(40,80,180,0.15) 0%, #000 100%)',
  'linear-gradient(135deg, rgba(180,160,100,0.13) 0%, #000 100%)',
  'linear-gradient(135deg, rgba(40,180,160,0.14) 0%, #000 100%)',
  'linear-gradient(135deg, rgba(120,60,180,0.15) 0%, #000 100%)',
  'linear-gradient(135deg, rgba(60,160,80,0.14) 0%, #000 100%)',
];

function getGradient(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('mars') || t.includes('olympus')) return GRADIENT_MAP[0];
  if (t.includes('orbit') || t.includes('station')) return GRADIENT_MAP[1];
  if (t.includes('lun') || t.includes('tranquil')) return GRADIENT_MAP[2];
  if (t.includes('europa') || t.includes('glace')) return GRADIENT_MAP[3];
  if (t.includes('titan') || t.includes('nébu')) return GRADIENT_MAP[4];
  if (t.includes('vénus') || t.includes('cloud')) return GRADIENT_MAP[5];
  // Fallback: hash the title
  let hash = 0;
  for (let i = 0; i < (title || '').length; i++)
    hash = (title.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  return GRADIENT_MAP[Math.abs(hash) % GRADIENT_MAP.length];
}

// Star field for the hero visual (used inside the hero image block when no image)
const HERO_STARS = `
  8vw 30px 1px 0px rgba(255,255,255,0.5),
  22vw 80px 0px 0px rgba(255,255,255,0.3),
  38vw 20px 1px 0px rgba(255,255,255,0.6),
  52vw 70px 0px 0px rgba(100,140,255,0.7),
  68vw 40px 1px 0px rgba(255,255,255,0.4),
  82vw 90px 0px 0px rgba(255,255,255,0.5),
  15vw 130px 1px 0px rgba(255,255,255,0.3),
  45vw 150px 0px 0px rgba(255,255,255,0.6),
  75vw 120px 1px 0px rgba(100,140,255,0.6),
  90vw 160px 0px 0px rgba(255,255,255,0.4),
  5vw 200px 0px 0px rgba(255,255,255,0.5),
  30vw 220px 1px 0px rgba(255,255,255,0.3),
  60vw 190px 0px 0px rgba(255,255,255,0.6),
  85vw 230px 1px 0px rgba(255,255,255,0.4)
`;

// Page-level background stars — denser in top half, sparser bottom
const PAGE_STARS_STATIC = `
  2vw 4vh 2px 0px rgba(255,255,255,0.58),
  7vw 8vh 2px 0px rgba(255,255,255,0.48),
  12vw 3vh 2px 0px rgba(255,255,255,0.62),
  18vw 12vh 2px 0px rgba(255,255,255,0.44),
  23vw 6vh 2px 0px rgba(255,255,255,0.58),
  29vw 15vh 2px 0px rgba(255,255,255,0.42),
  34vw 2vh 2px 0px rgba(255,255,255,0.54),
  40vw 10vh 2px 0px rgba(255,255,255,0.48),
  45vw 5vh 2px 0px rgba(255,255,255,0.62),
  51vw 14vh 2px 0px rgba(255,255,255,0.44),
  56vw 7vh 2px 0px rgba(255,255,255,0.58),
  62vw 11vh 2px 0px rgba(255,255,255,0.48),
  67vw 3vh 2px 0px rgba(255,255,255,0.62),
  73vw 9vh 2px 0px rgba(255,255,255,0.48),
  78vw 13vh 2px 0px rgba(255,255,255,0.42),
  84vw 6vh 2px 0px rgba(255,255,255,0.58),
  89vw 2vh 2px 0px rgba(255,255,255,0.54),
  95vw 10vh 2px 0px rgba(255,255,255,0.44),
  4vw 20vh 2px 0px rgba(255,255,255,0.48),
  10vw 25vh 2px 0px rgba(255,255,255,0.42),
  17vw 22vh 2px 0px rgba(255,255,255,0.52),
  25vw 28vh 2px 0px rgba(255,255,255,0.38),
  33vw 18vh 2px 0px rgba(255,255,255,0.54),
  41vw 30vh 2px 0px rgba(255,255,255,0.36),
  48vw 24vh 2px 0px rgba(255,255,255,0.48),
  55vw 32vh 2px 0px rgba(255,255,255,0.38),
  63vw 19vh 2px 0px rgba(255,255,255,0.52),
  70vw 27vh 2px 0px rgba(255,255,255,0.36),
  77vw 35vh 2px 0px rgba(255,255,255,0.44),
  85vw 21vh 2px 0px rgba(255,255,255,0.38),
  92vw 29vh 2px 0px rgba(255,255,255,0.48),
  6vw 40vh 2px 0px rgba(255,255,255,0.38),
  15vw 45vh 2px 0px rgba(255,255,255,0.32),
  28vw 38vh 2px 0px rgba(255,255,255,0.42),
  42vw 48vh 2px 0px rgba(255,255,255,0.32),
  58vw 42vh 2px 0px rgba(255,255,255,0.38),
  72vw 50vh 2px 0px rgba(255,255,255,0.28),
  86vw 44vh 2px 0px rgba(255,255,255,0.34),
  20vw 55vh 2px 0px rgba(255,255,255,0.32),
  38vw 60vh 2px 0px rgba(255,255,255,0.28),
  55vw 58vh 2px 0px rgba(255,255,255,0.34),
  75vw 62vh 2px 0px rgba(255,255,255,0.26),
  90vw 56vh 2px 0px rgba(255,255,255,0.32),
  10vw 68vh 2px 0px rgba(255,255,255,0.28),
  32vw 72vh 2px 0px rgba(255,255,255,0.26),
  50vw 70vh 2px 0px rgba(255,255,255,0.32),
  68vw 75vh 2px 0px rgba(255,255,255,0.26),
  85vw 68vh 2px 0px rgba(255,255,255,0.32),
  15vw 80vh 2px 0px rgba(255,255,255,0.26),
  45vw 85vh 2px 0px rgba(255,255,255,0.26),
  65vw 82vh 2px 0px rgba(255,255,255,0.32),
  80vw 88vh 2px 0px rgba(255,255,255,0.26),
  30vw 92vh 2px 0px rgba(255,255,255,0.26),
  60vw 95vh 2px 0px rgba(255,255,255,0.26)
`;

const PAGE_STARS_PULSE = `
  5vw 5vh 2px 0px rgba(255,255,255,0.52),
  20vw 9vh 2px 0px rgba(255,255,255,0.44),
  36vw 4vh 2px 0px rgba(255,255,255,0.58),
  52vw 12vh 2px 0px rgba(255,255,255,0.44),
  68vw 7vh 2px 0px rgba(255,255,255,0.52),
  83vw 11vh 2px 0px rgba(255,255,255,0.44),
  14vw 26vh 2px 0px rgba(255,255,255,0.38),
  44vw 33vh 2px 0px rgba(255,255,255,0.34),
  74vw 22vh 2px 0px rgba(255,255,255,0.42),
  30vw 46vh 2px 0px rgba(255,255,255,0.32),
  60vw 52vh 2px 0px rgba(255,255,255,0.28),
  88vw 40vh 2px 0px rgba(255,255,255,0.32),
  22vw 65vh 2px 0px rgba(255,255,255,0.28),
  50vw 78vh 2px 0px rgba(255,255,255,0.26),
  78vw 72vh 2px 0px rgba(255,255,255,0.28)
`;

const PAGE_STARS_BLUE = `
  9vw 6vh 2px 0px rgba(80,130,220,0.52),
  32vw 10vh 2px 0px rgba(60,160,120,0.44),
  58vw 3vh 2px 0px rgba(80,130,220,0.48),
  80vw 8vh 2px 0px rgba(60,160,120,0.42),
  22vw 20vh 2px 0px rgba(80,130,220,0.38),
  65vw 28vh 2px 0px rgba(60,160,120,0.32),
  45vw 45vh 2px 0px rgba(80,130,220,0.28),
  82vw 55vh 2px 0px rgba(60,160,120,0.26)
`;

export default function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [contactModal, setContactModal] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const [recommendations, setRecommendations] = useState([]);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleBooking = () => {
    setBookingModal(true);
    setBookingConfirmed(false);
  };

  const confirmBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingModal(false);
      setBookingConfirmed(false);
    }, 3000);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);

    try {
      const res = await fetch('/api/v1/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: reviewText,
          rating: reviewRating,
          place_id: id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      // Add the new review to the list
      setReviews((prev) => [...prev, data]);
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const deletePlace = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce séjour ?")) return;
    try {
      const res = await fetch(`/api/v1/places/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete place');
      navigate('/places');
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Supprimer cet avis ?")) return;
    try {
      const res = await fetch(`/api/v1/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`/api/v1/places/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPlace(data);
        setLoading(false);

        // Fetch owner
        if (data.owner_id) {
          fetch(`/api/v1/users/${data.owner_id}`)
            .then((r) => r.json())
            .then(setOwner)
            .catch(() => { });
        }
      })
      .catch(() => setLoading(false));

    // Fetch recommendations (3 random other places)
    fetch('/api/v1/places')
      .then((r) => r.json())
      .then((places) => {
        if (!Array.isArray(places)) return;
        const others = places.filter((p) => p.id !== id);
        const shuffled = others.sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 3));
      })
      .catch(() => { });

    // Fetch reviews
    fetch(`/api/v1/places/${id}/reviews`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch(() => { });
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: '#040710', minHeight: '100vh' }}>
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
          Chargement...
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div style={{ background: '#040710', minHeight: '100vh' }}>
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
          Séjour introuvable.
        </div>
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? Math.round(
        (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10
      ) / 10
      : 0;

  const gradient = getGradient(place.title);

  return (
    <div style={{ background: '#040710', minHeight: '100vh', color: '#fff' }}>
      {/* Fixed atmospheric glows */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Vertical atmosphere envelope */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(30,60,140,0.05) 0%, transparent 25%, transparent 70%, rgba(25,100,100,0.03) 100%)',
          }}
        />
        {/* Primary — cold blue, top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 100% 60% at 50% 10%, rgba(30,70,160,0.10) 0%, transparent 55%)',
          }}
        />
        {/* Secondary — muted teal, mid-left */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 15% 45%, rgba(25,120,130,0.06) 0%, transparent 45%)',
          }}
        />
        {/* Tertiary — faint green, bottom-right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 75% 85%, rgba(30,150,80,0.05) 0%, transparent 40%)',
          }}
        />
      </div>

      {/* Fixed star field */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <div className="pd-page-stars-static" />
        <div className="pd-page-stars-pulse" />
        <div className="pd-page-stars-blue" />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />

        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            width: '100%',
          }}
          className="pd-container"
        >
          {/* Back link */}
          <motion.div {...fadeUp(0)}>
            <Link
              to="/places"
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
              Retour aux séjours
            </Link>
          </motion.div>

          {/* Visual Hero — Gallery */}
          {(() => {
            const gallery = getPlaceGallery(place.title, place.image_url);
            const currentImg = gallery[selectedPhoto] || gallery[0];
            return (
              <>
                <motion.div
                  {...fadeUp(0.1)}
                  className="pd-hero-visual"
                  style={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: currentImg
                        ? `url(${currentImg}) center/cover no-repeat`
                        : gradient,
                      position: 'relative',
                      transition: 'background 0.4s ease',
                    }}
                  >
                    {!currentImg && <div className="pd-hero-stars" />}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '40%',
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
                      }}
                    />
                    {/* Photo counter */}
                    {gallery.length > 1 && (
                      <div
                        className="liquid-glass"
                        style={{
                          position: 'absolute',
                          bottom: '1rem',
                          right: '1rem',
                          borderRadius: '9999px',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.8)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {selectedPhoto + 1} / {gallery.length}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Thumbnails */}
                {gallery.length > 1 && (
                  <motion.div
                    {...fadeUp(0.15)}
                    className="pd-gallery-thumbs"
                  >
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedPhoto(i)}
                        className={`pd-thumb ${i === selectedPhoto ? 'pd-thumb-active' : ''}`}
                        style={{
                          background: `url(${img}) center/cover no-repeat`,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </>
            );
          })()}

          {/* Header */}
          <motion.div
            {...fadeUp(0.2)}
            className="pd-header"
            style={{ marginTop: '2rem' }}
          >
            <div style={{ flex: 1 }}>
              {/* Tags */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="liquid-glass"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Nouveau
                </span>
                {avgRating >= 4.5 && (
                  <span
                    className="liquid-glass"
                    style={{
                      borderRadius: '9999px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Coup de coeur
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-2px',
                    color: '#fff',
                    margin: 0,
                  }}
                  className="pd-title"
                >
                  {place.title}
                </h1>
                {user && (user.is_admin || user.id === place.owner_id) && (
                  <button
                    onClick={deletePlace}
                    className="liquid-glass"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      color: '#ff4444',
                      background: 'rgba(255, 68, 68, 0.1)',
                      border: '1px solid rgba(255, 68, 68, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                    }}
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                )}
              </div>

              {/* Meta */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  marginTop: '0.75rem',
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-body)',
                  flexWrap: 'wrap',
                }}
              >
                {reviews.length > 0 && (
                  <>
                    <Star
                      size={14}
                      fill="#fff"
                      style={{ color: '#fff', marginRight: '0.25rem' }}
                    />
                    <span style={{ color: '#fff' }}>{avgRating}</span>
                    <span>&nbsp;·&nbsp;{reviews.length} avis</span>
                  </>
                )}
                {place.amenities && (
                  <span>
                    &nbsp;·&nbsp;{place.amenities.length} équipement
                    {place.amenities.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Price card */}
            <div
              className="liquid-glass pd-price-card"
              style={{
                borderRadius: '1rem',
                padding: '1.5rem',
                textAlign: 'center',
                minWidth: '200px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {place.price}₿
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                / nuit
              </div>
              <button
                onClick={handleBooking}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.03)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                Réserver
              </button>
            </div>

            {/* Booking Modal */}
            {bookingModal && (
              <div
                className="booking-overlay"
                onClick={() => { if (!bookingConfirmed) { setBookingModal(false); } }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="liquid-glass booking-modal"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    borderRadius: '1.25rem',
                    padding: '2.5rem 2rem',
                    maxWidth: '28rem',
                    width: '90%',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  {!bookingConfirmed ? (
                    <>
                      <div style={{
                        fontSize: '2rem',
                        marginBottom: '1rem',
                      }}>🚀</div>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem',
                        color: '#fff',
                        margin: '0 0 0.5rem',
                        letterSpacing: '-1px',
                      }}>
                        Confirmer votre réservation
                      </h3>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: 300,
                        lineHeight: 1.6,
                        margin: '0 0 1.5rem',
                      }}>
                        {place.title}<br />
                        <span style={{ color: '#fff', fontWeight: 600 }}>{place.price}₿</span> / nuit
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setBookingModal(false)}
                          className="liquid-glass"
                          style={{
                            borderRadius: '9999px',
                            padding: '0.75rem 1.5rem',
                            fontSize: '0.875rem',
                            color: 'rgba(255,255,255,0.6)',
                            fontFamily: 'var(--font-body)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            background: 'none',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                        >
                          Annuler
                        </button>
                        <button
                          onClick={confirmBooking}
                          style={{
                            borderRadius: '9999px',
                            padding: '0.75rem 2rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)',
                            border: 'none',
                            cursor: 'pointer',
                            background: '#fff',
                            color: '#000',
                            transition: 'transform 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                          Confirmer la réservation
                        </button>
                      </div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="booking-success-check">
                        <Check size={32} style={{ color: '#fff' }} />
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem',
                        color: '#4ade80',
                        margin: '1rem 0 0.5rem',
                        letterSpacing: '-1px',
                      }}>
                        Réservation confirmée !
                      </h3>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 300,
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        Merci pour votre réservation.<br />
                        L'hôte a été notifié et vous recontactera très prochainement.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            {...fadeUp(0.3)}
            style={{
              marginTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '2.5rem',
            }}
          >
            <p className="pd-section-label">À PROPOS</p>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                lineHeight: 1.7,
                maxWidth: '48rem',
                fontSize: '1rem',
              }}
            >
              {place.description ||
                'Ce séjour extraordinaire vous offre une expérience unique dans le système solaire. Profitez d\'un habitat pressurisé de dernière génération avec vue panoramique sur l\'espace. Chaque détail a été pensé pour votre confort et votre sécurité.'}
            </p>
          </motion.div>

          {/* Video section */}
          {(() => {
            const videoUrl = getPlaceVideo(place.title);
            if (!videoUrl) return null;
            const isGif = videoUrl.toLowerCase().endsWith('.gif');
            return (
              <motion.div
                {...fadeUp(0.32)}
                style={{
                  marginTop: '2rem',
                }}
              >
                <p className="pd-section-label">VISITE VIDÉO</p>
                <div
                  className="liquid-glass"
                  style={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    padding: '0.25rem',
                  }}
                >
                  {isGif ? (
                    <img
                      src={videoUrl}
                      alt="Visite vidéo"
                      style={{
                        width: '100%',
                        borderRadius: '0.75rem',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{
                        width: '100%',
                        borderRadius: '0.75rem',
                        display: 'block',
                        background: '#000',
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })()}

          {/* Amenities */}
          {place.amenities && place.amenities.length > 0 && (
            <motion.div
              {...fadeUp(0.35)}
              style={{
                marginTop: '3rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '2.5rem',
              }}
            >
              <p className="pd-section-label">ÉQUIPEMENTS</p>
              <div className="pd-amenities-grid">
                {place.amenities.map((amenity, i) => (
                  <motion.div
                    key={amenity.id}
                    {...fadeUp(0.35 + i * 0.05)}
                    className="liquid-glass"
                    style={{
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      className="liquid-glass"
                      style={{
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {getAmenityIcon(amenity.name)}
                    </div>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {amenity.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Host */}
          <motion.div
            {...fadeUp(0.4)}
            style={{
              marginTop: '3rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '2.5rem',
            }}
          >
            <p className="pd-section-label">VOTRE HÔTE</p>
            <div
              className="liquid-glass pd-host-card"
              style={{
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
              }}
            >
              {owner && HOST_AVATARS[owner.email] ? (
                <img
                  src={HOST_AVATARS[owner.email]}
                  alt={`${owner.first_name} ${owner.last_name}`}
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '9999px',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User
                    size={28}
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  />
                </div>
              )}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#fff',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {owner
                      ? `${owner.first_name} ${owner.last_name}`
                      : 'Hôte HolByNB'}
                  </span>
                  <span
                    className="liquid-glass"
                    style={{
                      borderRadius: '9999px',
                      padding: '0.125rem 0.5rem',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Superhost
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'var(--font-body)',
                    marginTop: '0.25rem',
                  }}
                >
                  Hôte vérifié · Répond en moins d'une heure
                </p>
                <button
                  onClick={() => { setContactModal(true); setContactSent(false); setContactMessage(''); }}
                  className="liquid-glass"
                  style={{
                    marginTop: '1rem',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    background: 'none',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = '#fff')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')
                  }
                >
                  Contacter l'hôte
                </button>
              </div>
            </div>

            {/* Contact Host Modal */}
            {contactModal && (
              <div
                className="booking-overlay"
                onClick={() => { if (!contactSent) setContactModal(false); }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="liquid-glass booking-modal"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    borderRadius: '1.25rem',
                    padding: '2.5rem 2rem',
                    maxWidth: '28rem',
                    width: '90%',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  {!contactSent ? (
                    <>
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✉️</div>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem',
                        color: '#fff',
                        margin: '0 0 0.25rem',
                        letterSpacing: '-1px',
                      }}>
                        Contacter {owner ? owner.first_name : 'l\'hôte'}
                      </h3>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        color: 'rgba(255,255,255,0.4)',
                        fontWeight: 300,
                        margin: '0 0 1.25rem',
                      }}>
                        Répond généralement en moins d'une heure
                      </p>
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Bonjour, je suis intéressé(e) par votre séjour..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.75rem',
                          color: '#fff',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.875rem',
                          resize: 'vertical',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                          marginBottom: '1.25rem',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
                        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setContactModal(false)}
                          className="liquid-glass"
                          style={{
                            borderRadius: '9999px',
                            padding: '0.75rem 1.5rem',
                            fontSize: '0.875rem',
                            color: 'rgba(255,255,255,0.6)',
                            fontFamily: 'var(--font-body)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            background: 'none',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => { if (contactMessage.trim()) setContactSent(true); setTimeout(() => setContactModal(false), 3000); }}
                          disabled={!contactMessage.trim()}
                          style={{
                            borderRadius: '9999px',
                            padding: '0.75rem 2rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)',
                            border: 'none',
                            cursor: contactMessage.trim() ? 'pointer' : 'not-allowed',
                            background: '#fff',
                            color: '#000',
                            transition: 'transform 0.2s',
                            opacity: contactMessage.trim() ? 1 : 0.4,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                          onMouseEnter={(e) => { if (contactMessage.trim()) e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                          <Send size={14} />
                          Envoyer
                        </button>
                      </div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="booking-success-check">
                        <Send size={28} style={{ color: '#fff' }} />
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem',
                        color: '#4ade80',
                        margin: '1rem 0 0.5rem',
                        letterSpacing: '-1px',
                      }}>
                        Message envoyé !
                      </h3>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 300,
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        Merci, votre message a été transmis à<br />
                        {owner ? `${owner.first_name} ${owner.last_name}` : 'l\'hôte'}.
                        <br />Vous recevrez une réponse très prochainement.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Reviews */}
          <motion.div
            {...fadeUp(0.45)}
            style={{
              marginTop: '3rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '2.5rem',
            }}
          >
            <p className="pd-section-label">AVIS</p>
            {reviews.length > 0 ? (
              <>
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    color: '#fff',
                    fontSize: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  <Star
                    size={18}
                    fill="#fff"
                    style={{
                      color: '#fff',
                      verticalAlign: 'middle',
                      marginRight: '0.5rem',
                    }}
                  />
                  {avgRating} · {reviews.length} avis
                </h3>
                <div className="pd-reviews-grid">
                  {reviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      {...fadeUp(0.45 + i * 0.08)}
                      className="liquid-glass"
                      style={{
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '9999px',
                            background: 'rgba(255,255,255,0.1)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <User
                            size={14}
                            style={{ color: 'rgba(255,255,255,0.4)' }}
                          />
                        </div>
                        <div>
                          <span
                            style={{
                              fontSize: '0.875rem',
                              color: '#fff',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            Voyageur Vérifié
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'rgba(255,255,255,0.4)',
                              fontFamily: 'var(--font-body)',
                              marginLeft: '0.5rem',
                            }}
                          >
                            {new Date(review.created_at).toLocaleDateString(
                              'fr-FR',
                              { month: 'long', year: 'numeric' }
                            )}
                          </span>
                        </div>
                      </div>
                      {user && (user.is_admin || user.id === review.user_id) && (
                        <button
                          onClick={() => deleteReview(review.id)}
                          style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.25rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255, 68, 68, 0.6)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '0.25rem',
                            transition: 'color 0.2s, background 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ff4444';
                            e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255, 68, 68, 0.6)';
                            e.currentTarget.style.background = 'transparent';
                          }}
                          title="Supprimer l'avis"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255,255,255,0.5)',
                          fontFamily: 'var(--font-body)',
                          fontWeight: 300,
                          marginTop: '0.75rem',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {review.text}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.125rem',
                          marginTop: '0.75rem',
                        }}
                      >
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            size={12}
                            fill={j < review.rating ? '#fff' : 'transparent'}
                            style={{
                              color:
                                j < review.rating
                                  ? '#fff'
                                  : 'rgba(255,255,255,0.2)',
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <p
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                }}
              >
                Aucun avis pour le moment.
              </p>
            )}

            {/* Review form — only if logged in */}
            {user && (
              <motion.form
                {...fadeUp(0.55)}
                onSubmit={submitReview}
                className="liquid-glass"
                style={{
                  marginTop: '2rem',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    color: '#fff',
                    fontSize: '1rem',
                    margin: 0,
                  }}
                >
                  Laisser un avis
                </p>

                {/* Star rating selector */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      fill={
                        star <= (reviewHover || reviewRating)
                          ? '#fff'
                          : 'transparent'
                      }
                      style={{
                        color:
                          star <= (reviewHover || reviewRating)
                            ? '#fff'
                            : 'rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        transition: 'color 0.15s',
                      }}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                    />
                  ))}
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: 'var(--font-body)',
                      alignSelf: 'center',
                    }}
                  >
                    {reviewRating}/5
                  </span>
                </div>

                {/* Text input */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Partagez votre expérience..."
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,0.3)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,0.1)')
                  }
                />

                {reviewError && (
                  <p
                    style={{
                      color: '#ff6b6b',
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-body)',
                      margin: 0,
                    }}
                  >
                    {reviewError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.625rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    cursor: reviewSubmitting ? 'not-allowed' : 'pointer',
                    opacity: reviewSubmitting ? 0.6 : 1,
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!reviewSubmitting)
                      e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Send size={14} />
                  {reviewSubmitting ? 'Envoi...' : 'Publier'}
                </button>
              </motion.form>
            )}

            {!user && (
              <motion.div {...fadeUp(0.55)} style={{ marginTop: '1.5rem' }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'var(--font-body)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')
                  }
                >
                  Connectez-vous pour laisser un avis
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            {...fadeUp(0.5)}
            style={{
              marginTop: '4rem',
              marginBottom: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '2.5rem',
              paddingBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#fff',
                margin: 0,
              }}
              className="pd-bottom-heading"
            >
              Prêt pour le{' '}
              <span
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontStyle: 'italic',
                }}
              >
                décollage
              </span>{' '}
              ?
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleBooking}
                style={{
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.75rem 2rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.03)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                Réserver ce séjour
              </button>
              <Link
                to="/"
                className="liquid-glass"
                style={{
                  borderRadius: '9999px',
                  padding: '0.75rem 2rem',
                  fontSize: '0.875rem',
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
                Voir d'autres séjours
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            {...fadeUp(0.2)}
            style={{
              maxWidth: '80rem',
              margin: '0 auto',
              padding: '4rem 0 5rem',
            }}
            className="pd-container"
          >
            <p className="pd-section-label">Destinations similaires</p>
            <div className="pd-reco-grid">
              {recommendations.map((rec, i) => {
                const bg = rec.image_url
                  ? `url(${rec.image_url}) center/cover no-repeat`
                  : getGradient(rec.title);
                return (
                  <motion.div key={rec.id} {...fadeUp(0.1 + i * 0.1)}>
                    <Link
                      to={`/places/${rec.id}`}
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div
                        className="pd-reco-card"
                        style={{
                          position: 'relative',
                          borderRadius: '1.25rem',
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.06)',
                          transition: 'transform 0.3s, border-color 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        }}
                      >
                        {/* Image */}
                        <div
                          style={{
                            aspectRatio: '16/10',
                            background: bg,
                            position: 'relative',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background:
                                'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '1.25rem',
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1.125rem',
                              color: '#fff',
                              letterSpacing: '-0.5px',
                              marginBottom: '0.5rem',
                              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                            }}
                          >
                            {rec.title}
                          </h3>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.875rem',
                                color: 'rgba(255,255,255,0.5)',
                                fontWeight: 300,
                              }}
                            >
                              {rec.price}€ / nuit
                            </span>
                            <span
                              className="liquid-glass"
                              style={{
                                borderRadius: '9999px',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.75rem',
                                fontFamily: 'var(--font-body)',
                                color: 'rgba(255,255,255,0.7)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              <Star
                                size={12}
                                fill="rgba(255,255,255,0.7)"
                                stroke="none"
                              />
                              Explorer
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <Footer />
      </div>

      <style>{`
        .pd-container {
          padding: 0 1rem 2rem;
        }
        @media (min-width: 768px) {
          .pd-container { padding: 0 2rem 2rem; }
        }

        .pd-hero-visual {
          width: 100%;
          aspect-ratio: 4/3;
        }
        @media (min-width: 768px) {
          .pd-hero-visual { aspect-ratio: 21/9; }
        }

        .pd-hero-stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${HERO_STARS};
          animation: pd-twinkle 8s ease-in-out infinite;
        }
        @keyframes pd-twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .pd-header {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .pd-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        .pd-title {
          font-size: 1.875rem;
        }
        @media (min-width: 768px) {
          .pd-title { font-size: 2.25rem; }
        }
        @media (min-width: 1024px) {
          .pd-title { font-size: 3rem; }
        }

        .pd-location {
          font-size: 1rem;
        }
        @media (min-width: 768px) {
          .pd-location { font-size: 1.125rem; }
        }

        .pd-price-card {
          order: -1;
        }
        @media (min-width: 768px) {
          .pd-price-card { order: 0; }
        }

        .pd-section-label {
          font-size: 0.75rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          font-family: var(--font-body);
          font-weight: 400;
          margin-bottom: 1.5rem;
        }

        .pd-gallery-thumbs {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }
        .pd-gallery-thumbs::-webkit-scrollbar {
          height: 4px;
        }
        .pd-gallery-thumbs::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
        }
        .pd-thumb {
          width: 5rem;
          height: 3.5rem;
          border-radius: 0.5rem;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.2s, opacity 0.2s, transform 0.2s;
          opacity: 0.5;
          padding: 0;
        }
        .pd-thumb:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }
        .pd-thumb-active {
          border-color: rgba(255,255,255,0.6);
          opacity: 1;
        }
        @media (min-width: 768px) {
          .pd-thumb {
            width: 7rem;
            height: 4.5rem;
          }
        }

        .pd-amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .pd-amenities-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .pd-amenities-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .pd-host-card {
          padding: 1.5rem;
        }
        @media (min-width: 768px) {
          .pd-host-card { padding: 2rem; }
        }

        .pd-reviews-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .pd-reviews-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .pd-bottom-heading {
          font-size: 1.5rem;
        }
        @media (min-width: 768px) {
          .pd-bottom-heading { font-size: 1.875rem; }
        }

        /* Page-level background stars */
        .pd-page-stars-static {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${PAGE_STARS_STATIC};
        }

        .pd-page-stars-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${PAGE_STARS_PULSE};
          animation: pd-page-pulse 10s ease-in-out infinite;
        }

        .pd-page-stars-blue {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${PAGE_STARS_BLUE};
          animation: pd-page-pulse 12s ease-in-out infinite;
        }

        @keyframes pd-page-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .booking-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: booking-fade-in 0.3s ease-out;
        }

        @keyframes booking-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .booking-modal {
          box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(100,140,255,0.06);
        }

        .booking-success-check {
          width: 4rem;
          height: 4rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, #22c55e, #4ade80);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          animation: booking-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes booking-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }

        .pd-reco-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .pd-reco-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .pd-reco-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}

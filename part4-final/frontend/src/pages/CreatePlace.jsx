import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Check, Orbit, Eye, Wind, Wifi, Sparkles, ChefHat,
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
  return Icon;
};
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

export default function CreatePlace() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetch('/api/v1/amenities')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAmenities(data);
      })
      .catch(() => { });
  }, [user, navigate]);

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/v1/places/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          image_url: imageUrl || undefined,
          amenities: selectedAmenities,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création');
      navigate(`/places/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      <div
        style={{ maxWidth: '40rem', margin: '0 auto', width: '100%' }}
        className="cp-container"
      >
        {/* Back */}
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

        {/* Header */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-2px',
              color: '#fff',
              margin: 0,
              fontSize: '2.5rem',
            }}
          >
            Proposer un{' '}
            <span
              style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
              }}
            >
              séjour
            </span>
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              marginTop: '0.5rem',
            }}
          >
            Ajoutez votre habitat au catalogue HolByNB.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          {...fadeUp(0.1)}
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          {/* Title */}
          <div>
            <label className="cp-label">Nom du séjour</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Dôme Olympus — Panorama sur Mars"
              required
              maxLength={100}
              className="cp-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="cp-label">Description / Localisation</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Au pied d'Olympus Mons, Mars"
              rows={3}
              className="cp-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Price */}
          <div>
            <label className="cp-label">Prix par nuit (₿)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 1250"
              required
              min="0.01"
              step="0.01"
              className="cp-input"
            />
          </div>

          {/* Coordinates */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className="cp-label">Latitude</label>
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-90 à 90"
                required
                min="-90"
                max="90"
                step="any"
                className="cp-input"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="cp-label">Longitude</label>
              <input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-180 à 180"
                required
                min="-180"
                max="180"
                step="any"
                className="cp-input"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="cp-label">Image (chemin ou URL)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Ex: /images/mars.jpg"
              className="cp-input"
            />
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <label className="cp-label">Équipements</label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                {amenities.map((a) => {
                  const selected = selectedAmenities.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAmenity(a.id)}
                      style={{
                        borderRadius: '9999px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-body)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: selected
                          ? 'rgba(255,255,255,0.3)'
                          : 'rgba(255,255,255,0.1)',
                        background: selected
                          ? 'rgba(255,255,255,0.15)'
                          : 'rgba(255,255,255,0.05)',
                        color: selected ? '#fff' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {(() => { const Icon = getAmenityIcon(a.name); return <Icon size={14} style={{ marginRight: '0.375rem', opacity: 0.8 }} />; })()}
                      {a.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <p
              style={{
                color: '#ff6b6b',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-body)',
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              transition: 'transform 0.2s',
              marginTop: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {submitting ? 'Création...' : 'Publier le séjour'}
          </button>
        </motion.form>
      </div>

      <style>{`
        .cp-container {
          padding: 0 1rem 4rem;
        }
        @media (min-width: 768px) {
          .cp-container { padding: 0 2rem 4rem; }
        }

        .cp-label {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          font-family: var(--font-body);
          font-weight: 400;
          margin-bottom: 0.5rem;
        }

        .cp-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .cp-input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .cp-input:focus {
          border-color: rgba(255,255,255,0.3);
        }
      `}</style>
      <Footer />
    </div>
  );
}

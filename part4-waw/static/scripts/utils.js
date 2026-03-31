/* ============================================
   Shared Utilities - HBnB Horizon
   ============================================ */

/* ---------- Toast Notifications ---------- */
function getOrCreateToastContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = 'success') {
  const container = getOrCreateToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success'
        ? '<path d="M20 6L9 17l-5-5"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
      }
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast--exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ---------- Scroll Reveal ---------- */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ---------- Navbar Scroll Effect ---------- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Place Card Gradient Generator ---------- */
const GRADIENTS = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b3d 0%, #1a1a2e 50%, #162447 100%)',
  'linear-gradient(135deg, #1b2838 0%, #1a3a4a 50%, #0d2137 100%)',
  'linear-gradient(135deg, #2a1f3d 0%, #1f2a48 50%, #162447 100%)',
  'linear-gradient(135deg, #1a2a1a 0%, #1a2e2e 50%, #0f2a3e 100%)',
  'linear-gradient(135deg, #2e1a1a 0%, #2e1a2e 50%, #1a162e 100%)',
  'linear-gradient(135deg, #1a2e3e 0%, #1a1a3e 50%, #2e1a3e 100%)',
  'linear-gradient(135deg, #3e2e1a 0%, #2e1a1a 50%, #1a1a2e 100%)',
];

function getGradient(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

/* ---------- Star SVG Generator ---------- */
function starSVG(filled = true, size = 14) {
  const color = filled ? 'var(--accent)' : 'var(--text-tertiary)';
  const opacity = filled ? '1' : '0.3';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? color : 'none'}"
    stroke="${color}" stroke-width="2" style="opacity:${opacity}">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`;
}

function starsHTML(rating, size = 14) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += starSVG(i <= rating, size);
  }
  return html;
}

/* ---------- Avatar Colors ---------- */
const AVATAR_COLORS = [
  'var(--accent)', 'var(--coral)', 'var(--sage)',
  'var(--lavender)', 'var(--sky)', '#e88a45',
];

function getAvatarColor(id) {
  let hash = 0;
  for (let i = 0; i < (id || '').length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ---------- Date Formatting ---------- */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ---------- Coordinate to City Name (approximate) ---------- */
function coordsToLocation(lat, lng) {
  // Simple approximation for display purposes
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(1)}° ${latDir}, ${Math.abs(lng).toFixed(1)}° ${lngDir}`;
}

/* ---------- URL Params ---------- */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- Amenity Icons ---------- */
const AMENITY_ICONS = {
  'wifi': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  'pool': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M2 16c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/></svg>',
  'air conditioning': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10m0 0l3-3m-3 3l-3-3"/><path d="M2 17c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/></svg>',
  'parking': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
  'kitchen': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
};

function getAmenityIcon(name) {
  const key = name.toLowerCase();
  for (const [k, icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(k)) return icon;
  }
  // Default icon
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>';
}

/* ---------- Skeleton Loaders ---------- */
function skeletonCards(count = 6) {
  return Array(count).fill('<div class="skeleton skeleton--card"></div>').join('');
}

/* ---------- Init Common ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  updateNavAuth();
  initReveal();
});

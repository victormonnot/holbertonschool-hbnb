/* ============================================
   Place Detail Page - HBnB Horizon
   ============================================ */

let currentPlace = null;
let placeReviews = [];

document.addEventListener('DOMContentLoaded', () => {
  const placeId = getParam('id');
  if (!placeId) {
    window.location.href = 'index.html';
    return;
  }
  loadPlaceDetail(placeId);
});

async function loadPlaceDetail(placeId) {
  try {
    const [place, reviews] = await Promise.all([
      fetchPlace(placeId),
      fetchPlaceReviews(placeId).catch(() => []),
    ]);

    currentPlace = place;
    placeReviews = reviews;

    document.title = `${place.title} — Horizon`;
    renderHero(place);
    renderContent(place, reviews);
    renderReviews(reviews, placeId);
  } catch (err) {
    document.getElementById('place-hero').innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <h3 class="empty-state__title">Place not found</h3>
        <p class="empty-state__text">${err.message}</p>
      </div>
    `;
    document.getElementById('place-content').innerHTML = '';
  }
}

function renderHero(place) {
  const gradient = getGradient(place.id);

  document.getElementById('place-hero').innerHTML = `
    <div class="place-detail__hero">
      <img
        class="place-detail__hero-img"
        src="${getPlaceImage(place.id)}"
        alt="${escapeHTML(place.title)}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
      >
      <div class="place-detail__hero-gradient" style="background: ${gradient}; display:none;">
      </div>
      <div class="place-detail__hero-overlay"></div>
      <div class="place-detail__hero-content">
        <h1 class="place-detail__title">${escapeHTML(place.title)}</h1>
        <div class="place-detail__meta">
          <div class="place-detail__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${coordsToLocation(place.latitude, place.longitude)}
          </div>
          <div class="place-detail__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            $${place.price} / night
          </div>
          ${place.owner ? `
            <div class="place-detail__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Hosted by ${escapeHTML(place.owner.first_name || '')} ${escapeHTML(place.owner.last_name || '')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderContent(place, reviews) {
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const amenities = place.amenities || [];

  document.getElementById('place-content').innerHTML = `
    <div class="place-detail__grid">
      <div>
        <!-- Description -->
        ${place.description ? `
          <div class="place-detail__section-title">About this place</div>
          <p class="place-detail__description">${escapeHTML(place.description)}</p>
        ` : ''}

        <!-- Amenities -->
        ${amenities.length > 0 ? `
          <div class="place-detail__section-title">Amenities</div>
          <div class="amenities-grid">
            ${amenities.map(a => {
              const name = typeof a === 'string' ? a : a.name;
              return `
                <div class="amenity-tag">
                  ${getAmenityIcon(name)}
                  ${escapeHTML(name)}
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Sidebar -->
      <div>
        <div class="sidebar-card">
          <div class="sidebar-card__price">$${place.price} <span>/ night</span></div>
          <div class="sidebar-card__divider"></div>
          <div class="sidebar-card__info">
            ${avgRating > 0 ? `
              <div class="sidebar-card__row">
                <span class="sidebar-card__label">Rating</span>
                <span class="sidebar-card__value" style="display:flex;align-items:center;gap:6px;">
                  ${starSVG(true, 14)} ${avgRating.toFixed(1)}
                </span>
              </div>
            ` : ''}
            <div class="sidebar-card__row">
              <span class="sidebar-card__label">Reviews</span>
              <span class="sidebar-card__value">${reviews.length}</span>
            </div>
            <div class="sidebar-card__row">
              <span class="sidebar-card__label">Latitude</span>
              <span class="sidebar-card__value font-mono" style="font-family:var(--font-mono);font-size:0.85rem;">${place.latitude.toFixed(4)}</span>
            </div>
            <div class="sidebar-card__row">
              <span class="sidebar-card__label">Longitude</span>
              <span class="sidebar-card__value font-mono" style="font-family:var(--font-mono);font-size:0.85rem;">${place.longitude.toFixed(4)}</span>
            </div>
          </div>
          <div class="sidebar-card__divider"></div>
          ${isAuthenticated() ? `
            <a href="add_review.html?id=${place.id}" class="btn btn--primary" style="width:100%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Write a review
            </a>
          ` : `
            <a href="login.html" class="btn btn--secondary" style="width:100%;">
              Sign in to review
            </a>
          `}
        </div>
      </div>
    </div>
  `;
}

async function renderReviews(reviews, placeId) {
  const section = document.getElementById('reviews-section');

  if (reviews.length === 0) {
    section.innerHTML = `
      <div class="reviews-section">
        <div class="place-detail__section-title">Reviews</div>
        <div class="empty-state">
          <div class="empty-state__icon">💬</div>
          <h3 class="empty-state__title">No reviews yet</h3>
          <p class="empty-state__text">Be the first to share your experience.</p>
        </div>
      </div>
    `;
    return;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const currentUserId = getCurrentUserId();
  const userIsAdmin = isAdmin();

  // Fetch reviewer names
  const userCache = {};
  const userIds = [...new Set(reviews.map(r => r.user_id))];
  await Promise.all(
    userIds.map(async (uid) => {
      try {
        userCache[uid] = await fetchUser(uid);
      } catch {
        userCache[uid] = { first_name: 'Anonymous', last_name: '' };
      }
    })
  );

  section.innerHTML = `
    <div class="reviews-section">
      <div class="reviews-header">
        <div class="reviews-stats">
          <div class="reviews-stats__avg">${avgRating.toFixed(1)}</div>
          <div class="reviews-stats__detail">
            <div class="reviews-stats__stars">${starsHTML(Math.round(avgRating), 16)}</div>
            <div class="reviews-stats__count">${reviews.length} review${reviews.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      ${reviews.map(review => {
        const user = userCache[review.user_id] || { first_name: 'A', last_name: '' };
        const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || '');
        const canDelete = currentUserId === review.user_id || userIsAdmin;

        return `
          <div class="review-card reveal">
            <div class="review-card__header">
              <div class="review-card__author">
                <div class="review-card__avatar" style="background:${getAvatarColor(review.user_id)}">
                  ${initials.toUpperCase()}
                </div>
                <div>
                  <div class="review-card__name">${escapeHTML(user.first_name)} ${escapeHTML(user.last_name)}</div>
                  <div class="review-card__date">${formatDate(review.created_at)}</div>
                </div>
              </div>
              <div class="review-card__stars">${starsHTML(review.rating, 14)}</div>
            </div>
            <p class="review-card__text">${escapeHTML(review.text)}</p>
            ${canDelete ? `
              <div class="review-card__actions">
                <button class="btn btn--danger btn--sm" onclick="handleDeleteReview('${review.id}', '${placeId}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;

  setTimeout(initReveal, 50);
}

async function handleDeleteReview(reviewId, placeId) {
  if (!confirm('Delete this review?')) return;

  try {
    await deleteReview(reviewId);
    showToast('Review deleted', 'success');
    // Reload reviews
    const reviews = await fetchPlaceReviews(placeId).catch(() => []);
    placeReviews = reviews;
    renderReviews(reviews, placeId);
    renderContent(currentPlace, reviews);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================
   Index Page - HBnB Horizon
   ============================================ */

let allPlaces = [];
let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  loadPlaces();
  initFilters();
});

async function loadPlaces() {
  const grid = document.getElementById('places-grid');

  try {
    allPlaces = await fetchPlaces();
    renderPlaces(allPlaces);
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state__icon">⚡</div>
        <h3 class="empty-state__title">Unable to load places</h3>
        <p class="empty-state__text">${err.message}. Make sure the API server is running.</p>
      </div>
    `;
  }
}

function renderPlaces(places) {
  const grid = document.getElementById('places-grid');
  const count = document.getElementById('places-count');

  count.textContent = `${places.length} place${places.length !== 1 ? 's' : ''}`;

  if (places.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state__icon">🏠</div>
        <h3 class="empty-state__title">No places found</h3>
        <p class="empty-state__text">Try adjusting your filters or check back later.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = places.map((place, i) => createPlaceCard(place, i)).join('');

  // Re-init reveal for new cards
  setTimeout(initReveal, 50);
}

function createPlaceCard(place, index) {
  const gradient = getGradient(place.id);
  const amenities = (place.amenities || []).slice(0, 3);
  const rating = place.average_rating || place.rating || 0;
  const delayClass = `reveal--delay-${(index % 4) + 1}`;

  return `
    <article class="place-card reveal ${delayClass}" onclick="window.location.href='place.html?id=${place.id}'">
      <div class="place-card__image">
        <img
          class="place-card__img"
          src="${getPlaceImage(place.id)}"
          alt="${escapeHTML(place.title)}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
        >
        <div class="place-card__gradient" style="background: ${gradient}; display:none;">
        </div>
        <div class="place-card__price">$${place.price}<span>/night</span></div>
      </div>
      <div class="place-card__body">
        <h3 class="place-card__title">${escapeHTML(place.title)}</h3>
        <div class="place-card__location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${coordsToLocation(place.latitude, place.longitude)}
        </div>
        <div class="place-card__footer">
          <div class="place-card__amenities">
            ${amenities.map(a => {
              const name = typeof a === 'string' ? a : a.name;
              return `<span class="place-card__amenity">${escapeHTML(name)}</span>`;
            }).join('')}
            ${(place.amenities || []).length > 3
              ? `<span class="place-card__amenity">+${place.amenities.length - 3}</span>`
              : ''
            }
          </div>
          ${rating > 0 ? `
            <div class="place-card__rating">
              ${starSVG(true, 14)}
              ${rating.toFixed(1)}
            </div>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}

function initFilters() {
  const container = document.getElementById('filters');

  container.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;

    // Update active state
    container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('filter-chip--active'));
    chip.classList.add('filter-chip--active');

    activeFilter = chip.dataset.price;
    applyFilter();
  });
}

function applyFilter() {
  let filtered = allPlaces;

  if (activeFilter !== 'all') {
    const max = parseInt(activeFilter);
    if (max <= 200) {
      filtered = allPlaces.filter(p => p.price < max);
    } else {
      filtered = allPlaces.filter(p => p.price >= 200);
    }
  }

  renderPlaces(filtered);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

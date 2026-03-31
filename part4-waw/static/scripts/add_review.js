/* ============================================
   Add Review Page - HBnB Horizon
   ============================================ */

let selectedRating = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Must be logged in
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  const placeId = getParam('id');
  if (!placeId) {
    window.location.href = 'index.html';
    return;
  }

  // Set back links
  const backUrl = `place.html?id=${placeId}`;
  document.getElementById('back-link').href = backUrl;
  document.getElementById('cancel-btn').href = backUrl;

  loadPlaceInfo(placeId);
  initStarRating();
  initForm(placeId);
});

async function loadPlaceInfo(placeId) {
  try {
    const place = await fetchPlace(placeId);
    const gradient = getGradient(place.id);

    document.getElementById('place-info').innerHTML = `
      <div class="review-form-card__place-info">
        <div class="review-form-card__place-thumb" style="background:${gradient};"></div>
        <div>
          <div class="review-form-card__place-name">${escapeHTML(place.title)}</div>
          <div class="review-form-card__place-price">$${place.price} / night</div>
        </div>
      </div>
    `;
  } catch {
    // Silently fail - not critical
  }
}

function initStarRating() {
  const container = document.getElementById('star-rating');
  const label = document.getElementById('rating-label');
  const stars = container.querySelectorAll('.star-rating__star');
  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  function updateStars(value, isHover = false) {
    stars.forEach((star, i) => {
      const v = i + 1;
      star.classList.remove('star-rating__star--active', 'star-rating__star--hover');

      if (v <= value) {
        star.classList.add(isHover ? 'star-rating__star--hover' : 'star-rating__star--active');
        star.style.fill = 'currentColor';
      } else {
        star.style.fill = 'none';
      }
    });

    label.textContent = value > 0 ? labels[value] : '-';
  }

  stars.forEach((star) => {
    star.addEventListener('mouseenter', () => {
      updateStars(parseInt(star.dataset.value), true);
    });

    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.value);
      updateStars(selectedRating, false);
    });
  });

  container.addEventListener('mouseleave', () => {
    updateStars(selectedRating, false);
  });
}

function initForm(placeId) {
  const form = document.getElementById('review-form');
  const errorEl = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const text = document.getElementById('review-text').value.trim();

    // Validate
    if (selectedRating === 0) {
      errorEl.textContent = 'Please select a rating.';
      errorEl.style.display = 'block';
      return;
    }

    if (!text) {
      errorEl.textContent = 'Please write your review.';
      errorEl.style.display = 'block';
      return;
    }

    // Loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn__spinner"></span> Submitting...';
    submitBtn.classList.add('btn--loading');

    try {
      await submitReview(placeId, text, selectedRating);
      showToast('Review submitted successfully!', 'success');

      setTimeout(() => {
        window.location.href = `place.html?id=${placeId}`;
      }, 800);
    } catch (err) {
      errorEl.textContent = err.message || 'Failed to submit review.';
      errorEl.style.display = 'block';
      submitBtn.innerHTML = originalHTML;
      submitBtn.classList.remove('btn--loading');
    }
  });
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

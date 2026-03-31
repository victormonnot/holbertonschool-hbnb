/* ============================================
   API Client - HBnB Horizon
   ============================================ */

const API_BASE = 'http://localhost:5000/api/v1';

/**
 * Make an authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    if (!window.location.pathname.includes('login')) {
      window.location.href = 'login.html';
    }
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null;
  return response.json();
}

/* ---------- Auth ---------- */
async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/* ---------- Places ---------- */
async function fetchPlaces() {
  return apiRequest('/places/');
}

async function fetchPlace(id) {
  return apiRequest(`/places/${id}`);
}

async function fetchPlaceReviews(placeId) {
  return apiRequest(`/places/${placeId}/reviews`);
}

/* ---------- Reviews ---------- */
async function submitReview(placeId, text, rating) {
  return apiRequest('/reviews/', {
    method: 'POST',
    body: JSON.stringify({
      place_id: placeId,
      text,
      rating,
    }),
  });
}

async function deleteReview(reviewId) {
  return apiRequest(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}

/* ---------- Users ---------- */
async function fetchUser(userId) {
  return apiRequest(`/users/${userId}`);
}

/* ---------- Amenities ---------- */
async function fetchAmenities() {
  return apiRequest('/amenities/');
}

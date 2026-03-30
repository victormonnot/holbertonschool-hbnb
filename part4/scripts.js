/* ===== Configuration ===== */
const API_BASE_URL = 'http://localhost:5000/api/v1';

/* ===== Cookie Helpers ===== */
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/* ===== Auth Helpers ===== */
function isAuthenticated() {
    return getCookie('token') !== null;
}

function getToken() {
    return getCookie('token');
}

/* ===== API Wrapper ===== */
async function apiRequest(endpoint, options = {}) {
    const url = API_BASE_URL + endpoint;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        deleteCookie('token');
        window.location.href = 'login.html';
        return;
    }

    return response;
}

/* ===== UI Helpers ===== */
function updateAuthUI() {
    const loginLink = document.getElementById('login-link');
    if (!loginLink) return;

    if (isAuthenticated()) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#';
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            deleteCookie('token');
            window.location.href = 'index.html';
        });
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';
    }
}

function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += '<span class="star-filled">&#9733;</span>';
        } else {
            html += '<span class="star-empty">&#9733;</span>';
        }
    }
    return html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="error-message">' + escapeHtml(message) + '</div>';
        container.hidden = false;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ===== Page Router ===== */
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    const page = document.body.dataset.page;
    if (page === 'login') initLogin();
    else if (page === 'index') initIndex();
    else if (page === 'place') initPlace();
    else if (page === 'add-review') initAddReview();
});

/* ===== Login Page ===== */
function initLogin() {
    if (isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const msgContainer = document.getElementById('error-message');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        if (msgContainer) msgContainer.hidden = true;

        try {
            const response = await fetch(API_BASE_URL + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                setCookie('token', data.access_token, 1);
                window.location.href = 'index.html';
            } else {
                const data = await response.json().catch(() => null);
                const errorMsg = data && data.error ? data.error : 'Login failed. Please check your credentials.';
                showError('error-message', errorMsg);
            }
        } catch (err) {
            showError('error-message', 'Network error. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
}

/* ===== Index Page ===== */
let allPlaces = [];

function initIndex() {
    fetchPlaces();

    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', () => {
            const maxPrice = priceFilter.value;
            if (!maxPrice) {
                renderPlaces(allPlaces);
            } else {
                const filtered = allPlaces.filter(p => p.price <= Number(maxPrice));
                renderPlaces(filtered);
            }
        });
    }
}

async function fetchPlaces() {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = '<div class="loading"></div>';

    try {
        const response = await apiRequest('/places/');
        if (!response || !response.ok) {
            placesList.innerHTML = '<p class="error-message">Failed to load places.</p>';
            return;
        }
        allPlaces = await response.json();
        renderPlaces(allPlaces);
    } catch (err) {
        placesList.innerHTML = '<p class="error-message">Network error. Please try again.</p>';
    }
}

function renderPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = '';

    if (places.length === 0) {
        placesList.innerHTML = '<p style="text-align:center;color:var(--color-text-secondary);grid-column:1/-1;">No places found.</p>';
        return;
    }

    for (const place of places) {
        const card = document.createElement('div');
        card.className = 'place-card';

        const amenitiesHtml = place.amenities && place.amenities.length > 0
            ? place.amenities.map(a => '<span class="amenity-tag">' + escapeHtml(a.name) + '</span>').join('')
            : '';

        card.innerHTML =
            '<div class="place-card-image">&#127968;</div>' +
            '<div class="place-card-content">' +
                '<div class="place-card-header">' +
                    '<h3>' + escapeHtml(place.title) + '</h3>' +
                    '<div class="place-card-price">$' + place.price + ' <span>/ night</span></div>' +
                '</div>' +
                (place.description
                    ? '<p class="place-card-description">' + escapeHtml(place.description) + '</p>'
                    : '') +
                (amenitiesHtml
                    ? '<div class="place-card-amenities">' + amenitiesHtml + '</div>'
                    : '') +
                '<a href="place.html?id=' + place.id + '" class="details-button">View Details</a>' +
            '</div>';

        placesList.appendChild(card);
    }
}

/* ===== Place Details Page ===== */
function initPlace() {
    const params = new URLSearchParams(window.location.search);
    const placeId = params.get('id');

    if (!placeId) {
        window.location.href = 'index.html';
        return;
    }

    const addReviewSection = document.getElementById('add-review');
    if (addReviewSection) {
        addReviewSection.style.display = isAuthenticated() ? 'block' : 'none';
    }

    fetchPlaceDetails(placeId);
}

async function fetchPlaceDetails(placeId) {
    const detailsSection = document.getElementById('place-details');
    if (!detailsSection) return;

    detailsSection.innerHTML = '<div class="loading"></div>';

    try {
        const [placeRes, reviewsRes] = await Promise.all([
            apiRequest('/places/' + placeId),
            apiRequest('/places/' + placeId + '/reviews')
        ]);

        if (!placeRes || !placeRes.ok) {
            detailsSection.innerHTML = '<p class="error-message">Place not found.</p>';
            return;
        }

        const place = await placeRes.json();
        const reviews = reviewsRes && reviewsRes.ok ? await reviewsRes.json() : [];

        /* Fetch owner name */
        let ownerName = 'Unknown host';
        try {
            const ownerRes = await apiRequest('/users/' + place.owner_id);
            if (ownerRes && ownerRes.ok) {
                const owner = await ownerRes.json();
                ownerName = owner.first_name + ' ' + owner.last_name;
            }
        } catch (e) { /* keep default */ }

        /* Fetch reviewer names in batch */
        const userIds = [...new Set(reviews.map(r => r.user_id))];
        const userMap = {};
        if (userIds.length > 0) {
            const userFetches = userIds.map(async (uid) => {
                try {
                    const res = await apiRequest('/users/' + uid);
                    if (res && res.ok) {
                        const u = await res.json();
                        userMap[uid] = u.first_name + ' ' + u.last_name;
                    }
                } catch (e) { /* skip */ }
            });
            await Promise.all(userFetches);
        }

        displayPlaceDetails(place, ownerName, reviews, userMap);
    } catch (err) {
        detailsSection.innerHTML = '<p class="error-message">Failed to load place details.</p>';
    }
}

function displayPlaceDetails(place, ownerName, reviews, userMap) {
    const detailsSection = document.getElementById('place-details');
    if (!detailsSection) return;

    const amenitiesHtml = place.amenities && place.amenities.length > 0
        ? place.amenities.map(a => '<span class="amenity-pill">' + escapeHtml(a.name) + '</span>').join('')
        : '<p class="no-reviews">No amenities listed.</p>';

    let reviewsHtml = '';
    if (reviews.length > 0) {
        reviewsHtml = reviews.map(r =>
            '<div class="review-card">' +
                '<div class="review-card-header">' +
                    '<span class="review-card-author">' + escapeHtml(userMap[r.user_id] || 'Anonymous') + '</span>' +
                    '<span class="review-card-date">' + formatDate(r.created_at) + '</span>' +
                '</div>' +
                '<div class="review-card-rating">' + renderStars(r.rating) + '</div>' +
                '<p class="review-card-text">' + escapeHtml(r.text) + '</p>' +
            '</div>'
        ).join('');
    } else {
        reviewsHtml = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
    }

    detailsSection.innerHTML =
        '<div class="place-detail-header">' +
            '<h1>' + escapeHtml(place.title) + '</h1>' +
            '<p class="place-detail-host">Hosted by ' + escapeHtml(ownerName) + '</p>' +
        '</div>' +
        '<div class="place-detail-image">&#127968;</div>' +
        '<div class="place-info">' +
            '<div class="place-info-item">' +
                '<span class="place-info-label">Price per night</span>' +
                '<span class="place-info-value">$' + place.price + '</span>' +
            '</div>' +
            '<div class="place-info-item">' +
                '<span class="place-info-label">Location</span>' +
                '<span class="place-info-value">' + place.latitude + ', ' + place.longitude + '</span>' +
            '</div>' +
        '</div>' +
        (place.description
            ? '<div class="place-description"><h2>About this place</h2><p>' + escapeHtml(place.description) + '</p></div>'
            : '') +
        '<div class="place-amenities-section">' +
            '<h2>Amenities</h2>' +
            '<div class="amenities-list">' + amenitiesHtml + '</div>' +
        '</div>' +
        '<div class="reviews-section">' +
            '<h2>Reviews</h2>' +
            '<div class="reviews-list">' + reviewsHtml + '</div>' +
        '</div>';

    /* Update add review link */
    const addReviewLink = document.getElementById('add-review-link');
    if (addReviewLink) {
        addReviewLink.href = 'add_review.html?place_id=' + place.id;
    }
}

/* ===== Add Review Page ===== */
function initAddReview() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const placeId = params.get('place_id');

    if (!placeId) {
        window.location.href = 'index.html';
        return;
    }

    /* Load place name for context */
    loadPlaceName(placeId);

    const reviewForm = document.getElementById('review-form');
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const ratingInput = document.querySelector('input[name="rating"]:checked');
        const textInput = document.getElementById('review-text');
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        const msgContainer = document.getElementById('form-message');

        if (!ratingInput) {
            showError('form-message', 'Please select a rating.');
            return;
        }

        const rating = parseInt(ratingInput.value);
        const text = textInput.value.trim();

        if (!text) {
            showError('form-message', 'Please write a review.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        if (msgContainer) msgContainer.hidden = true;

        try {
            const response = await apiRequest('/reviews/', {
                method: 'POST',
                body: JSON.stringify({ text, rating, place_id: placeId })
            });

            if (response && response.ok) {
                window.location.href = 'place.html?id=' + placeId;
            } else {
                const data = response ? await response.json().catch(() => null) : null;
                const errorMsg = data && data.error ? data.error : 'Failed to submit review.';
                showError('form-message', errorMsg);
            }
        } catch (err) {
            showError('form-message', 'Network error. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    });
}

async function loadPlaceName(placeId) {
    const placeTitle = document.getElementById('place-title');
    if (!placeTitle) return;

    try {
        const res = await apiRequest('/places/' + placeId);
        if (res && res.ok) {
            const place = await res.json();
            placeTitle.textContent = place.title;
        }
    } catch (e) { /* keep default */ }
}

/* ============================================
   Auth Utilities - HBnB Horizon
   ============================================ */

const TOKEN_KEY = 'hbnb_token';

function getToken() {
  return document.cookie.replace(
    new RegExp(`(?:(?:^|.*;\\s*)${TOKEN_KEY}\\s*=\\s*([^;]*).*$)|^.*$`),
    '$1'
  ) || null;
}

function setToken(token) {
  const expires = new Date(Date.now() + 86400000).toUTCString(); // 1 day
  document.cookie = `${TOKEN_KEY}=${token}; expires=${expires}; path=/; SameSite=Strict`;
}

function clearToken() {
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function isAuthenticated() {
  return !!getToken();
}

/**
 * Decode JWT payload (without verification - for display purposes only)
 */
function decodeToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function getCurrentUserId() {
  const payload = decodeToken();
  return payload?.sub || null;
}

function isAdmin() {
  const payload = decodeToken();
  return payload?.is_admin === true;
}

/**
 * Update navigation based on auth state
 */
function updateNavAuth() {
  const loginLink = document.getElementById('nav-login');
  const logoutBtn = document.getElementById('nav-logout');

  if (!loginLink || !logoutBtn) return;

  if (isAuthenticated()) {
    loginLink.style.display = 'none';
    logoutBtn.style.display = '';
  } else {
    loginLink.style.display = '';
    logoutBtn.style.display = 'none';
  }
}

function handleLogout() {
  clearToken();
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

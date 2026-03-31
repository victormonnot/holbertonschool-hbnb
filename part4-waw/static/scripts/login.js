/* ============================================
   Login Page - HBnB Horizon
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  if (isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      errorEl.textContent = 'Please fill in all fields.';
      errorEl.style.display = 'block';
      return;
    }

    // Loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn__spinner"></span> Signing in...';
    submitBtn.classList.add('btn--loading');

    try {
      const data = await login(email, password);
      setToken(data.access_token);
      showToast('Welcome back!', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 600);
    } catch (err) {
      errorEl.textContent = err.message || 'Invalid email or password.';
      errorEl.style.display = 'block';
      submitBtn.innerHTML = originalHTML;
      submitBtn.classList.remove('btn--loading');

      // Shake animation
      form.style.animation = 'none';
      requestAnimationFrame(() => {
        form.style.animation = 'shake 0.4s ease-in-out';
      });
    }
  });
});

// Add shake keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);

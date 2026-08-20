// TaskMaster - Shared Frontend Helpers
// Session management and UI message helpers

// Save the session (token + user) after login
function setSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Get the current logged-in user (or null)
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        return null;
    }
}

// Clear the session (logout)
function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Log out and go back to the login page
function logout() {
    clearSession();
    window.location.href = '/login';
}

// ---------- DARK MODE (Phase 14) ----------

// Apply the stored theme (persistent preference)
function applyTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);
    updateThemeIcon(isDark);
    return isDark;
}

// Toggle between light and dark mode
function toggleTheme() {
    const isDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

// Swap the theme toggle icon (moon / sun)
function updateThemeIcon(isDark) {
    const btn = document.getElementById('themeBtn');
    if (btn) {
        btn.innerHTML = isDark
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }
}

// Show a message (error or success) inside a container
function showMessage(container, text, isError = true) {
    container.textContent = text;
    container.classList.remove('hidden');
    container.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
    container.classList.remove('bg-red-50', 'text-red-700', 'border-red-200');
    container.classList.add(
        isError
            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
    );
}

// ---------- TOAST NOTIFICATIONS (UI/UX polish) ----------

// Floating success / error toast, auto-dismisses after ~3.5s
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type === 'error' ? 'toast-error' : 'toast-success');
    toast.innerHTML =
        '<i class="fas ' + (type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check') + '"></i><span></span>';
    toast.querySelector('span').textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('toast-show'), 10);
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
// TaskMaster - Authentication Frontend Logic
// Handles the Login and Register forms (real backend API only)
// Includes real-time per-field validation hints + toast feedback

document.addEventListener('DOMContentLoaded', () => {

    // ---------- VALIDATION HELPERS ----------

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showHint(hintId, message) {
        const hint = document.getElementById(hintId);
        if (!hint) return;
        hint.querySelector('span').textContent = message;
        hint.classList.remove('hidden');
    }

    function hideHint(hintId) {
        const hint = document.getElementById(hintId);
        if (hint) hint.classList.add('hidden');
    }

    function validateEmail(value) {
        if (!value.trim()) return 'Email is required';
        if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address';
        return '';
    }

    function validatePassword(value, minLength) {
        if (!value) return 'Password is required';
        if (value.length < minLength) return `Password must be at least ${minLength} characters`;
        return '';
    }

    // Live validation: re-check on input, hide on clear
    function watchField(inputId, hintId, validator) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('blur', () => {
            const error = validator(input.value);
            if (error) showHint(hintId, error); else hideHint(hintId);
        });
        input.addEventListener('input', () => {
            const error = validator(input.value);
            if (error) showHint(hintId, error); else hideHint(hintId);
        });
    }

    // ---------- LOGIN PAGE ----------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        watchField('email', 'emailHint', validateEmail);
        watchField('password', 'passwordHint', (v) => validatePassword(v, 1));

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const submitBtn = document.getElementById('submitBtn');

            // Real-time validation on submit
            const emailError = validateEmail(emailInput.value);
            const passwordError = validatePassword(passwordInput.value, 1);
            if (emailError) showHint('emailHint', emailError);
            if (passwordError) showHint('passwordHint', passwordError);
            if (emailError || passwordError) return;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

            try {
                const data = await apiRequest('/auth/login', 'POST', {
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                });

                // Save the session and go to the dashboard
                setSession(data.token, data.user);
                showToast(`Welcome back, ${data.user.name}!`, 'success');
                setTimeout(() => { window.location.href = '/dashboard'; }, 600);
            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Log In';
            }
        });
    }

    // ---------- REGISTER PAGE ----------
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        watchField('name', 'nameHint', (v) => (v.trim() ? '' : 'Name is required'));
        watchField('email', 'emailHint', validateEmail);
        watchField('password', 'passwordHint', (v) => validatePassword(v, 6));

        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const submitBtn = document.getElementById('submitBtn');

            // Real-time validation on submit
            const nameError = nameInput.value.trim() ? '' : 'Name is required';
            const emailError = validateEmail(emailInput.value);
            const passwordError = validatePassword(passwordInput.value, 6);
            if (nameError) showHint('nameHint', nameError);
            if (emailError) showHint('emailHint', emailError);
            if (passwordError) showHint('passwordHint', passwordError);
            if (nameError || emailError || passwordError) return;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

            try {
                await apiRequest('/auth/register', 'POST', {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                });

                // Registered successfully - redirect to login (success toast there)
                window.location.href = '/login?registered=1';
            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Account';
            }
        });
    }

});
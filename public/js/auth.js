// TaskMaster - Authentication Frontend Logic
// Handles the Login and Register forms (real backend API only)

document.addEventListener('DOMContentLoaded', () => {

    // ---------- LOGIN PAGE ----------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const messageBox = document.getElementById('message');
            const submitBtn = document.getElementById('submitBtn');

            // Client-side validation
            if (!emailInput.value.trim() || !passwordInput.value) {
                showMessage(messageBox, 'Please enter your email and password');
                return;
            }

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
                window.location.href = '/dashboard';
            } catch (error) {
                showMessage(messageBox, error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Log In';
            }
        });
    }

    // ---------- REGISTER PAGE ----------
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const messageBox = document.getElementById('message');
            const submitBtn = document.getElementById('submitBtn');

            // Client-side validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value) {
                showMessage(messageBox, 'All fields are required');
                return;
            }
            if (passwordInput.value.length < 6) {
                showMessage(messageBox, 'Password must be at least 6 characters');
                return;
            }

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

            try {
                await apiRequest('/auth/register', 'POST', {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                });

                // Registered successfully - redirect to login
                window.location.href = '/login?registered=1';
            } catch (error) {
                showMessage(messageBox, error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Create Account';
            }
        });
    }

});
// TaskMaster - API Helper
// Central place for all API requests (Fetch API)

const API_BASE = '/api';

// Generic API request helper
// - Adds the JWT token to protected requests automatically
// - Returns parsed JSON data, throws Error on failure
async function apiRequest(path, method = 'GET', body = null, auth = true) {
    const headers = { 'Content-Type': 'application/json' };

    const token = localStorage.getItem('token');
    if (auth && token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(API_BASE + path, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}
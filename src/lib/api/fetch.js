import { PUBLIC_API_URL } from '$env/static/public';
import { browser } from '$app/environment';

export async function apiFetch(endpoint, options = {}, retried = false) {
    const accessToken = browser ? localStorage.getItem('accessToken') : null;

    const res = await fetch(`${PUBLIC_API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...(options.headers || {})
        },
        ...options
    });

    if (res.status === 401 && browser && !retried) {
        const refreshToken = localStorage.getItem('refreshToken');

        const refreshRes = await fetch(`${PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (!refreshRes.ok) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return null;
        }

        const { accessToken: newToken } = await refreshRes.json();
        localStorage.setItem('accessToken', newToken);

        return apiFetch(endpoint, options, true);
    }
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const err = new Error(error.error || 'API request failed');
        if (error.details) err.details = error.details;
        throw err;
    }

    if (res.status === 204) return null;
    
    return res.json();
}

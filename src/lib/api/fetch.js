import { PUBLIC_API_URL } from '$env/static/public';
import { browser } from '$app/environment';

export async function apiFetch(endpoint, options = {}) {
    const accessToken = browser ? localStorage.getItem('accessToken') : null;

    const res = await fetch(`${PUBLIC_API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...(options.headers || {})
        },
        ...options
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const err = new Error(error.error || 'API request failed');
        if (error.details) err.details = error.details;
        throw err;
    }

    if (res.status === 204) return null;
    
    return res.json();
}

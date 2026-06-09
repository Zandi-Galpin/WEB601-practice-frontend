import { browser } from '$app/environment';
import { apiFetch } from './fetch';

export async function login(credentials) {
    const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });

    if (browser) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return data;
}

export async function logout() {
    const refreshToken = browser ? localStorage.getItem('refreshToken') : null;

    await apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
    });

    if (browser) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}
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

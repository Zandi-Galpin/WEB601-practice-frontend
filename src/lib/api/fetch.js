import { PUBLIC_API_URL } from '$env/static/public';

export async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${PUBLIC_API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const err = new Error(error.error || "API request failed");
        if (error.details) err.details = error.details;
        throw err;
    };


    if (res.status === 204) return null;

    return res.json();
}

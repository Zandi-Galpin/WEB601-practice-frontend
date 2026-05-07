import * as store from '$lib/server/profile.js';

export function load() {
    return { profile: store.getProfile() };
}




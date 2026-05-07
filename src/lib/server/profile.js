import { readFileSync } from 'fs';

const profile = JSON.parse(readFileSync('data/profile.json', 'utf8'));

export function getProfile() {
    return profile;
}
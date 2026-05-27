import { apiFetch } from "./fetch.js";

export function getProfile() {
    return apiFetch("/profile");
}
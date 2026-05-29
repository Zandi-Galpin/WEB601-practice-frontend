import { apiFetch } from "./fetch.js";

export function getUsers() {
  return apiFetch("/users");
}

export function getUser(id) {
  return apiFetch(`/users/${id}`);
}

export function createUser(data) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateUser(id, data) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteUser(id) {
  return apiFetch(`/users/${id}`, {
    method: "DELETE"
  });
}
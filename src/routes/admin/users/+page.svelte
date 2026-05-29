<script>
  import { onMount } from "svelte";
  import { getUsers, deleteUser } from "$lib/api/users";

  let users = $state([]);

  async function fetchUsers() {
    users = await getUsers();
  }

  onMount(fetchUsers);

  async function handleDelete(id) {
    await deleteUser(id);
    await fetchUsers();
  }
</script>

<h1 class="text-2xl font-bold">Users</h1>
<a href="/admin/users/add" class="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Add User</a>

<table class="mt-6 w-full text-sm">
  <thead>
    <tr class="border-b text-left">
      <th class="py-2">Username</th>
      <th class="py-2">Email</th>
      <th class="py-2">Role</th>
      <th class="py-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each users as user}
      <tr class="border-b">
        <td class="py-2">{user.username}</td>
        <td class="py-2">{user.email}</td>
        <td class="py-2">{user.role}</td>
        <td class="flex gap-3 py-2">
          <a href="/admin/users/{user.id}/edit" class="text-blue-600 hover:underline">Edit</a>
          <button onclick={() => handleDelete(user.id)} class="text-red-600 hover:underline">Delete</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
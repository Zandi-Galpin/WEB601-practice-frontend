<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { getUser, updateUser, deleteUser } from "$lib/api/users";
  import { updateUserSchema } from "$lib/schemas/user";

  const id = page.params.id;

  let username = $state('');
  let email = $state('');
  let role = $state('staff');

  let usernameTouched = $state(false);
  let emailTouched = $state(false);

  function validateField(schema, value) {
    const result = schema.safeParse(value);
    return result.success ? null : result.error.errors[0].message;
  }

  let usernameError = $derived(validateField(updateUserSchema.shape.username, username));
  let emailError = $derived(validateField(updateUserSchema.shape.email, email));

  let formValid = $derived(
    usernameError === null &&
    emailError === null
  );

  let serverErrors = $state({});

  onMount(async () => {
    const user = await getUser(id);
    username = user.username;
    email = user.email;
    role = user.role;
  });

  async function handleUpdate(e) {
    e.preventDefault();
    usernameTouched = true;
    emailTouched = true;
    if (!formValid) return;
    serverErrors = {};
    try {
      await updateUser(id, { username, email, role });
      goto('/admin/users');
    } catch (err) {
      if (err.details) {
        serverErrors = Object.fromEntries(
          err.details.map(d => [d.field, d.message])
        );
      }
    }
  }

  async function handleDelete() {
    await deleteUser(id);
    goto('/admin/users');
  }
</script>

<h1 class="text-2xl font-bold">Edit User</h1>

<form onsubmit={handleUpdate} class="mt-6 flex max-w-lg flex-col gap-4">
  <label class="flex flex-col gap-1 text-sm font-medium">
    Username
    <input bind:value={username} onblur={() => usernameTouched = true} class="rounded border px-3 py-2 text-sm font-normal" />
  </label>
  {#if usernameTouched && usernameError}
    <p class="text-sm text-red-600">{usernameError}</p>
  {/if}
  {#if serverErrors.username}
    <p class="text-sm text-red-600">{serverErrors.username}</p>
  {/if}

  <label class="flex flex-col gap-1 text-sm font-medium">
    Email
    <input type="email" bind:value={email} onblur={() => emailTouched = true} class="rounded border px-3 py-2 text-sm font-normal" />
  </label>
  {#if emailTouched && emailError}
    <p class="text-sm text-red-600">{emailError}</p>
  {/if}
  {#if serverErrors.email}
    <p class="text-sm text-red-600">{serverErrors.email}</p>
  {/if}

  <label class="flex flex-col gap-1 text-sm font-medium">
    Role
    <select bind:value={role} class="rounded border px-3 py-2 text-sm font-normal">
      <option value="staff">Staff</option>
      <option value="admin">Admin</option>
    </select>
  </label>

  <div class="flex gap-3">
    <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
      Save Changes
    </button>
    <a href="/admin/users" class="rounded px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
      Cancel
    </a>
  </div>
</form>

<button
  onclick={handleDelete}
  class="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
>
  Delete User
</button>
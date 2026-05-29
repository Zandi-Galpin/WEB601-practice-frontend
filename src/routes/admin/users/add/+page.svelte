<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { createUser } from "$lib/api/users";
  import { getTechnologies } from "$lib/api/technologies";
  import { userSchema } from "$lib/schemas/user";

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let role = $state('staff');

  let usernameTouched = $state(false);
  let emailTouched = $state(false);
  let passwordTouched = $state(false);

  function validateField(schema, value) {
    const result = schema.safeParse(value);
    return result.success ? null : result.error.errors[0].message;
  }

  let usernameError = $derived(validateField(userSchema.shape.username, username));
  let emailError = $derived(validateField(userSchema.shape.email, email));
  let passwordError = $derived(validateField(userSchema.shape.password, password));

  let formValid = $derived(
    usernameError === null &&
    emailError === null &&
    passwordError === null
  );

  let serverErrors = $state({});

  async function handleSubmit(e) {
    e.preventDefault();
    usernameTouched = true;
    emailTouched = true;
    passwordTouched = true;
    if (!formValid) return;
    serverErrors = {};
    try {
      await createUser({ username, email, password, role });
      goto('/admin/users');
    } catch (err) {
      if (err.details) {
        serverErrors = Object.fromEntries(
          err.details.map(d => [d.field, d.message])
        );
      }
    }
  }
</script>

<h1 class="text-2xl font-bold">Add User</h1>

<form onsubmit={handleSubmit} class="mt-6 flex max-w-lg flex-col gap-4">
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
    Password
    <input type="password" bind:value={password} onblur={() => passwordTouched = true} class="rounded border px-3 py-2 text-sm font-normal" />
  </label>
  {#if passwordTouched && passwordError}
    <p class="text-sm text-red-600">{passwordError}</p>
  {/if}
  {#if serverErrors.password}
    <p class="text-sm text-red-600">{serverErrors.password}</p>
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
      Add User
    </button>
    <a href="/admin/users" class="rounded px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
      Cancel
    </a>
  </div>
</form>
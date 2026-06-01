<script>
    import { login } from '$lib/api/auth';
    import { goto } from '$app/navigation';
    import { loginSchema } from '$lib/schemas/user';

    let username = $state('');
    let password = $state('');

    let usernameTouched = $state(false);
    let passwordTouched = $state(false);

    function validateField(schema, value) {
        const result = schema.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
    }

    let usernameError = $derived(validateField(loginSchema.shape.username, username));
    let passwordError = $derived(validateField(loginSchema.shape.password, password));

    let formValid = $derived(usernameError === null && passwordError === null);

    let serverError = $state(null);

    async function handleSubmit() {
        usernameTouched = true;
        passwordTouched = true;

        if (!formValid) return;

        serverError = null;

        try {
            await login({ username, password });
            goto('/');
        } catch (err) {
            serverError = err.message;
        }
    }
</script>

<h1 class="text-2xl font-bold">Login</h1>

<form onsubmit={handleSubmit} class="mt-6 flex max-w-lg flex-col gap-4">

    <label class="flex flex-col gap-1 text-sm font-medium">
        Username
        <input
            bind:value={username}
            onblur={() => usernameTouched = true}
            class="rounded border px-3 py-2 text-sm font-normal"
        />
    </label>
    {#if usernameTouched && usernameError}
        <p class="text-sm text-red-600">{usernameError}</p>
    {/if}

    <label class="flex flex-col gap-1 text-sm font-medium">
        Password
        <input
            type="password"
            bind:value={password}
            onblur={() => passwordTouched = true}
            class="rounded border px-3 py-2 text-sm font-normal"
        />
    </label>
    {#if passwordTouched && passwordError}
        <p class="text-sm text-red-600">{passwordError}</p>
    {/if}

    {#if serverError}
        <p class="text-sm text-red-600">{serverError}</p>
    {/if}

    <div class="flex gap-3">
        <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Login
        </button>
    </div>
</form>
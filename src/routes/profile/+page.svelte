<script>
    import { onMount } from "svelte";
    import { getProfile } from "$lib/api/profile";

    let profile = $state(null);

    onMount(async () => {
        profile = await getProfile();
    });
</script>

{#if profile}
    <h1>{profile.name}</h1>
    <p><strong>Email:</strong> {profile.email}</p>
    <p><strong>Location:</strong> {profile.location}</p>
    <p>{@html profile.bio}</p>
{/if}

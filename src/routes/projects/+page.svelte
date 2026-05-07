<script>
    import ProjectCard from '$lib/ProjectCard.svelte';

    let { data } = $props();

    let search = $state('');

    let filtered = $derived(
        data.projects.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase())
        )
    );

</script>

<h1>Projects</h1>

<a href="/projects/add">Add Project</a>

<input
    bind:value={search}
    placeholder="Search projects…"
    class="w-full rounded border px-3 py-2 text-sm"
/>

<p>{filtered.length} project(s)</p>



<div class="mt-6 flex flex-col gap-4">
    {#if filtered.length === 0}
        <p class="text-sm text-gray-500">No projects match your search.</p>
    {:else}
        {#each filtered as project (project.id)}
            <ProjectCard {project} />
        {/each}
    {/if}
</div>



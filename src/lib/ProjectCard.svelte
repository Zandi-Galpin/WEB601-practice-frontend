<script>
    let { project } = $props();
</script>

<div class="rounded border p-4">
    <h2 class="text-lg font-semibold">{project.title}</h2>
    <p class="mt-1 text-sm text-gray-600">{project.description}</p>
    {#if project.status === 'complete'}
        <span class="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            {project.status}
        </span>
    {:else}
        <span class="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
            {project.status}
        </span>
    {/if}
    <ul class="mt-2 flex gap-1">
        {#each project.technologies as tag}
            <li class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {tag}
            </li>
        {/each}
    </ul>

    <a href="/projects/{project.id}/edit">Edit</a>
</div>


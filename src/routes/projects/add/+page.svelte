<script>
    import { onMount } from "svelte";
    import { createProject } from "$lib/api/projects";
    import { getTechnologies } from "$lib/api/technologies";
    import { goto } from "$app/navigation";

    let title = $state('');
    let description = $state('');
    let status = $state('in-progress');
    let technologies = $state([]);
    let options = $state([]);

    let titleTouched = $state(false);
    let descriptionTouched = $state(false);
    let technologiesTouched = $state(false);

    let titleError = $derived(
        validateField(projectSchema.shape.title, title)
    );
    let descriptionError = $derived(
        validateField(projectSchema.shape.description, description)
    );
    let technologiesError = $derived(
        validateField(projectSchema.shape.technologies, technologies)
    );

    let formValid = $derived(
        titleError === null &&
        descriptionError === null &&
        technologiesError === null
    );

    let serverErrors = $state({});

    onMount(async () => {
        options = await getTechnologies();
    });

    async function handleSubmit() {
        titleTouched = true;
        descriptionTouched = true;
        technologiesTouched = true;

        if (!formValid) return;

        serverErrors = {};

        try {
            await createProject({ title, description, status, technologies });
            goto("/projects");
        } catch (err) {
            if (err.details) {
                serverErrors = Object.fromEntries(
                    err.details.map(d => [d.field, d.message])
                );
            }
        }
    }


    import { projectSchema } from '$lib/schemas/project';

    function validateField(schema, value) {
        const result = schema.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
    }

</script>

<h1 class="text-2xl font-bold">Add Project</h1>

<form onsubmit={handleSubmit} class="mt-6 flex max-w-lg flex-col gap-4">
    <label class="flex flex-col gap-1 text-sm font-medium">
        Title
        <input
            bind:value={title}
            onblur={() => titleTouched = true}
            class="rounded border px-3 py-2 text-sm font-normal"
        />
    </label>
    {#if titleTouched && titleError}
        <p class="text-sm text-red-600">{titleError}</p>
    {/if}
    {#if serverErrors.title}
        <p class="text-sm text-red-600">{serverErrors.title}</p>
    {/if}


    <label class="flex flex-col gap-1 text-sm font-medium">
        Description
        <input
            bind:value={description}
            onblur={() => descriptionTouched = true}
            class="rounded border px-3 py-2 text-sm font-normal"
        />
    </label>
    {#if descriptionTouched && descriptionError}
        <p class="text-sm text-red-600">{descriptionError}</p>
    {/if}
    {#if serverErrors.description}
        <p class="text-sm text-red-600">{serverErrors.description}</p>
    {/if}




    <label class="flex flex-col gap-1 text-sm font-medium">
        Status
        <select bind:value={status} class="rounded border px-3 py-2 text-sm font-normal">
            <option value="in-progress">In Progress</option>
            <option value="complete">Complete</option>
        </select>
    </label>



    <fieldset class="flex flex-col gap-1">
        <legend class="text-sm font-medium">Technologies</legend>
        <div class="mt-1 flex flex-wrap gap-3">
            {#each options as option}
                <label class="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        bind:group={technologies}
                        value={option}
                        onchange={() => technologiesTouched = true}
                    />
                    {option}
                </label>
            {/each}
        </div>
        {#if technologiesTouched && technologiesError}
            <p class="text-sm text-red-600">{technologiesError}</p>
        {/if}
        {#if serverErrors.technologies}
            <p class="text-sm text-red-600">{serverErrors.technologies}</p>
        {/if}
    </fieldset>

    <div class="flex gap-3">
        <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-sm fontmedium text-white hover:bg-blue-700">
            Add Project
        </button>
        <a href="/projects" class="rounded px-4 py-2 text-sm font-medium textgray-600 hover:text-gray-900">
            Cancel
        </a>
    </div>
</form>

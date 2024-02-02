<script lang="ts">
	import { onMount } from 'svelte';
	import Projects from '$lib/projects/projects';
	import Project from '$lib/projects/project';
	const projects = Projects.getInstance();

	let projectsList: Project[] = [];
	onMount(async () => {
		projectsList = await getAll();
	});

	const addProject = async () => {
		const project = {
			name: 'New Project',
			repositories: []
		};
		const result = await projects.add(project);
		console.log(result);
	};

	const getAll = async () => {
		return await projects.getAll();
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={addProject}>Add Project</button>

Projects:
{#each projectsList as project}
	<div>{project.name}</div>
{/each}

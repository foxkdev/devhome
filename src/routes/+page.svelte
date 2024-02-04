<script lang="ts">
	import { onMount } from 'svelte';

	import Projects from '$lib/projects/projects';
	import Project from '$lib/projects/project';

	import { open, save } from '@tauri-apps/api/dialog';

	let projects = null;

	let projectsList: Project[] = [];
	onMount(async () => {
		projects = Projects.getInstance();
		projectsList = await getAll();
		// await invoke('plugin:git_manager|initialize');
		// invoke('plugin:git_manager|open_repo', {
		// 	path: '/Users/foxkdev/Dev/foxkdev/tree-sitter-groovy'
		// });
	});

	const addProject = async () => {
		let directoryPath = await open({
			directory: true,
			filters: [{ name: 'All Files', extensions: ['*'] }]
		});
		if (directoryPath) {
			await projects.add(directoryPath);
			projectsList = await getAll();
		}
	};

	const getAll = async () => {
		return await projects.getAll();
	};

	const removeProject = async (projectName) => {
		await projects.remove(projectName);
		projectsList = await getAll();
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={addProject}>Add Project</button>

Projects:
{#each projectsList as project}
	<div>{project.name}</div>
	<div>{project.path}</div>
	<div>{project.repository?.provider}</div>
	<button on:click={() => removeProject(project.name)}>Remove</button>
{/each}

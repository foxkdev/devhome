<script lang="ts">
	import Projects from '$lib/projects/projects';
	import { onMount } from 'svelte';
	import { open, save } from '@tauri-apps/api/dialog';
	import { Icon, Trash } from 'svelte-hero-icons';
	import Button from '../../ui/Button.svelte';

	let projectsManager = null;
	let projects = [];
	onMount(async () => {
		projectsManager = Projects.getInstance();
		projects = await getAll();
	});

	const addProject = async () => {
		let directoryPath = await open({
			directory: true,
			filters: [{ name: 'All Files', extensions: ['*'] }]
		});
		if (directoryPath) {
			await projectsManager.add(directoryPath);
			projects = await getAll();
		}
	};

	const getAll = async () => {
		let items = [];
		for (const p of await projectsManager.getAll()) {
			const branch = await p.repository?.getBranch();
			items.push({
				name: p.name,
				path: p.path,
				repository: {
					url: p.repository?.url,
					provider: p.repository?.provider,
					branch
				}
			});
		}
		return items;
	};

	const removeProject = async (projectName) => {
		await projectsManager.remove(projectName);
		projects = await getAll();
	};
</script>

<div class="flex justify-between my-3">
	<h1 class="text-2xl">Projects</h1>
	<Button on:click={addProject}>Add Project</Button>
</div>

<div class="flex">
	{#each projects as project}
		<div class="flex flex-col gap-1 m-2 w-2/5 p-3 rounded-lg bg-zinc-800">
			<div class="flex justify-between w-full">
				<div class="flex">
					{#if project.repository.provider === 'github'}
						<svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6 fill-white"
							><path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
							></path></svg
						>
					{/if}
					<span class="mx-1 text-lg font-bold">{project.name}</span>
				</div>
				<div class="flex">
					<Button on:click={() => removeProject(project.name)}>
						<Icon src={Trash} class="h-4 w-4 fill-white" />
					</Button>
				</div>
			</div>
			<div class="flex w-full">
				<span class="bg-zinc-700 px-1 rounded-lg">{project.repository.branch}</span>
				<span class="px-1">Last Commit:</span>
				<span class="px-1 underline text-indigo-600">dsajdlr</span>
				<span class="px-1">2 days ago</span>
			</div>
		</div>
	{/each}
</div>

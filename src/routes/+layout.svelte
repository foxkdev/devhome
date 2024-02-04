<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { Logger } from '$lib/utils/logger';
	import Settings from '$lib/settings';
	import Projects from '$lib/projects/projects';

	import { Icon, Home } from 'svelte-hero-icons';
	let setup = false;
	onMount(async () => {
		Logger.getInstance();
		const settings = Settings.getInstance();
		await settings.setup();
		const projects = Projects.getInstance();
		await projects.loadFromSettings();
		Logger.info('App started');
		setup = true;
	});
</script>

{#if setup}
	<div class="w-full h-full flex">
		<div
			class="w-20 h-full bg-stone-800 border-r-stone-600 p-6 flex flex-column items-tart justify-center"
		>
			<a href="/projects">
				<Icon src={Home} size="32" />
			</a>
		</div>
		<div class="w-full p-6">
			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.stone.900);
		color: white;
	}
</style>
